using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Vzp.FeedbackHub.Api.Logging;

namespace Vzp.FeedbackHub.Api.Services;

/// <summary>
/// Service responsible for handling feedback processing and integration with Smax.
/// This service includes functionality to create requests, process attachments, and manage authentication tokens.
/// </summary>
public class SmaxService : IFeedbackService {
    private readonly FeedbackHubConf _options;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly SmaxAuthService _auth;
    private readonly ILogger<SmaxService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="SmaxService"/> class.
    /// </summary>
    /// <param name="options">The configuration options for FeedbackHub.</param>
    /// <param name="auth">The authentication service for SMAX.</param>
    /// <param name="factory">The HTTP client factory used to create HTTP clients.</param>
    /// <param name="logger">The logger instance for logging operations.</param>
    public SmaxService(IOptions<FeedbackHubConf> options, SmaxAuthService auth, IHttpClientFactory factory, ILogger<SmaxService> logger)
    {
        _options = options.Value;
        _auth = auth;
        _httpClientFactory = factory;
        _logger = logger;
    }

    /// <summary>
    /// Processes the feedback request, including creating the request in SMAX and processing attachments.
    /// </summary>
    /// <param name="request">The feedback creation request containing title, description, and other details.</param>
    /// <returns>True if the process succeeds, otherwise false.</returns>
    public async Task<bool> ProcessFeedbackAsync(FeedbackCreateRequest request) {
        var title = $"[{_options.TitlePrefix}][{request.FrontendUrl ?? "No frontend URL"}] - {request.Title ?? _options.DefaultTitle}";
        var description = BuildDescription(request);
        var client = _httpClientFactory.CreateClient();

        _logger.SmaxProcessingFeedback(title);
        _logger.SmaxFeedbackRequestDetails(request.UserIdentifier,request.ReportTime.ToUniversalTime().ToString(Constants.DateTimeFormatForUTC),request.Browser,request.OperatingSystem,request.Url!); 

        var token = await _auth.GetTokenAsync();
        if (string.IsNullOrWhiteSpace(token.AuthToken)) {
            _logger.SmaxAuthTokenFailed();
            return false;
        }

        var userId = await GetPersonIdAsync(request.UserIdentifier, request.UserName, token.AuthToken)
             ?? _options.ContactPerson.ToString();
        var requestedByPerson = userId;

        string? affectedServiceId = null;
        if (!string.IsNullOrEmpty(request.FrontendUrl)) {
            affectedServiceId = await GetServiceIdByCodeAsync(request.FrontendUrl, token.AuthToken);
        }

        var affectedService = affectedServiceId ?? _options.AffectedService?.ToString() ?? "";

        var entityPayload = JsonSerializer.Serialize(new {
            operation = "CREATE",
            entities = new[] {
                new {
                    entity_type = _options.IncidentType,
                    properties = new {
                        DisplayLabel = title,
                        Description = description,
                        Urgency = _options.Priority?.ToString(),
                        RegisteredForActualService = affectedService,
                        RequestedByPerson = requestedByPerson,
                        RequestsOffering = _options.RequestsOffering.ToString(),
                        UserOptions = JsonSerializer.Serialize(new {
                            complexTypeProperties = new[] {
                                new {
                                    properties = new Dictionary<string, object> {
                                        ["OvlivnenaSluzba_c"] = affectedService
                                    }
                                }
                            }
                        })
                    }
                }
            }
        });

        var requestMsg = new HttpRequestMessage(HttpMethod.Post, $"{_options.Endpoint}/rest/{_options.TenantId}/ems/bulk") {
            Content = new StringContent(entityPayload, Encoding.UTF8, "application/json")
        };

        var responseContent = await SendRequestAsync(requestMsg, client, token.AuthToken);
        if (string.IsNullOrEmpty(responseContent)) return false;

        using var doc = JsonDocument.Parse(responseContent);
        var root = doc.RootElement;

        string? entityId = null;

        if (root.TryGetProperty("entity_result_list", out var resultList) &&
            resultList.ValueKind == JsonValueKind.Array &&
            resultList.GetArrayLength() > 0) {
            var firstItem = resultList[0];

            if (firstItem.TryGetProperty("entity", out var entity) &&
                entity.TryGetProperty("properties", out var properties) &&
                properties.TryGetProperty("Id", out var idProp)) {
                entityId = idProp.GetString();
            }
        }

        if (string.IsNullOrWhiteSpace(entityId)) {
            _logger.SmaxEntityIdMissing();
            return false;
        }

        _logger.SmaxRequestCreated(entityId);

        // Process attachments
        if (!await ProcessAttachmentsAsync(request, entityId, token.AuthToken)) {
            return false;
        }

        _logger.SmaxFeedbackProcessed(title);
        return true;
    }

    /// <summary>
    /// Processes the attachments for the feedback and associates them with the created request.
    /// </summary>
    /// <param name="request">The feedback creation request.</param>
    /// <param name="entityId">The entity ID of the created request.</param>
    /// <param name="token">The authorization token to be included in the request headers.</param>
    /// <returns>True if all attachments were processed successfully, otherwise false.</returns>
    private async Task<bool> ProcessAttachmentsAsync(FeedbackCreateRequest request, string entityId, string token) {
        var client = _httpClientFactory.CreateClient();
        foreach (var file in request.Attachments) {
            if (file.Length == 0) continue;

            var attachmentContent = new MultipartFormDataContent();
            var streamContent = new StreamContent(file.OpenReadStream()) {
                Headers = { ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream") }
            };
            attachmentContent.Add(streamContent, "files[]", CleanResponseString(file.FileName));

            var uploadRequest = new HttpRequestMessage(HttpMethod.Post, $"{_options.Endpoint}/rest/{_options.TenantId}/ces/attachment") {
                Content = attachmentContent
            };
            var uploadResponse = await SendRequestAsync(uploadRequest, client, token);
            if (uploadResponse == null) return false;

            using var doc = JsonDocument.Parse(uploadResponse);
            var root = doc.RootElement;

            var attachmentResult = new AttachmentUploadResult {
                Creator = root.TryGetProperty("creator", out var creator) ? creator.GetString() ?? "" : "",
                Success = root.TryGetProperty("success", out var success) && success.GetBoolean(),
                Name = CleanResponseString(root.TryGetProperty("name", out var name) ? name.GetString() ?? "" : ""),
                Guid = root.TryGetProperty("guid", out var guid) ? guid.GetString() ?? "" : "",
                ContentLength = root.TryGetProperty("contentLength", out var length) && length.TryGetInt64(out var lenVal) ? lenVal : 0,
                ContentType = root.TryGetProperty("contentType", out var contentType) ? contentType.GetString() ?? "" : ""
            };

            if (!attachmentResult.Success || string.IsNullOrWhiteSpace(attachmentResult.Guid)) {
                _logger.SmaxAttachmentInvalidGuid();
                return false;
            }

            _logger.SmaxAttachmentUploaded(attachmentResult.Guid);

            // Update the request with attachment
            var updatePayload = JsonSerializer.Serialize(new {
                operation = "UPDATE",
                entities = new[] {
                    new {
                        entity_type = _options.IncidentType,
                        properties = new {
                            Id = entityId,
                            RequestAttachments = JsonSerializer.Serialize(new {
                                complexTypeProperties = new[] {
                                    new {
                                        properties = new {
                                            id = attachmentResult.Guid,
                                            file_name = attachmentResult.Name,
                                            file_extension = Path.GetExtension(attachmentResult.Name)?.TrimStart('.') ?? "png",
                                            size = attachmentResult.ContentLength.ToString(),
                                            mime_type = attachmentResult.ContentType,
                                            attachmentResult.Creator
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });

            var updateRequest = new HttpRequestMessage(HttpMethod.Post, $"{_options.Endpoint}/rest/{_options.TenantId}/ems/bulk") {
                Content = new StringContent(updatePayload, Encoding.UTF8, "application/json")
            };
            var updateResponse = await SendRequestAsync(updateRequest, client, token);
            if (updateResponse == null) return false;

            _logger.SmaxAttachmentAssociated();
        }

        return true;
    }

    /// <summary>
    /// Builds a detailed description for the feedback based on the provided request data.
    /// </summary>
    /// <param name="request">The feedback creation request containing various details to include in the description.</param>
    /// <returns>A formatted string representing the complete feedback description.</returns>
    private static string BuildDescription(FeedbackCreateRequest request) {
        var sb = new StringBuilder();
        _ = sb.AppendLine("<html>");
        _ = sb.AppendLine("<body>");
        _ = sb.AppendLine($"<p><b>User:</b> {request.UserIdentifier} [{request.UserName}]</p>");
        _ = sb.AppendLine($"<p><b>Time:</b> {request.ReportTime.LocalDateTime.ToString(Constants.DateTimeFormatForUTC):G}</p>");
        _ = sb.AppendLine($"<p><b>Browser:</b> {request.Browser} {request.BrowserVersion}</p>");
        _ = sb.AppendLine($"<p><b>OS:</b> {request.OperatingSystem} {request.VersionOfOperatingSystem}</p>");
        _ = sb.AppendLine($"<p><b>URL:</b> {request.Url}</p>");
        _ = sb.AppendLine("<hr>");
        _ = sb.AppendLine($"<p><b>Description:</b> {request.Description}</p>");
        _ = sb.AppendLine("<hr>");
        _ = sb.AppendLine($"<p><b>Feedback Data:</b> {request.FeedbackData}</p>");
        _ = sb.AppendLine("</body>");
        _ = sb.AppendLine("</html>");
        return sb.ToString();
    }

    /// <summary>
    /// Sends a request to the specified URL and returns the response content.
    /// </summary>
    /// <param name="requestMsg">The HTTP request message.</param>
    /// <param name="client">The HTTP client.</param>
    /// <param name="token">The authorization token to be included in the request headers.</param>
    /// <returns>The response content as a string if successful, otherwise null.</returns>
    private async Task<string?> SendRequestAsync(HttpRequestMessage requestMsg, HttpClient client, string token) {
        try {
            requestMsg.Headers.Add("Cookie", $"SMAX_AUTH_TOKEN={token}");
            var response = await client.SendAsync(requestMsg);

            if (!response.IsSuccessStatusCode) {
                //var errorContent = await response.Content.ReadAsStringAsync();
                _logger.SmaxHttpRequestFailed(response.StatusCode, response.ReasonPhrase);
                return null;
            }

            return await response.Content.ReadAsStringAsync();
        } catch (Exception ex) {
            _logger.SmaxHttpRequestException(ex);
            return null;
        }
    }

    /// <summary>
    /// Retrieves the user ID based on the email and optional on name.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="name">Optional name of the user.</param>
    /// <param name="authToken">The authorization token to be included in the request headers.</param>
    /// <returns>The user ID if found, otherwise null.</returns>
    private async Task<string?> GetPersonIdAsync(string email, string? name, string authToken) {
        var filter = name != null ? $"Email eq '{email}' and Name eq '{name}'" : $"Email eq '{email}'";
        var url = $"{_options.Endpoint}/rest/{_options.TenantId}/ems/Person?filter={filter}&layout=Id";
        var client = _httpClientFactory.CreateClient();
        var requestMsg = new HttpRequestMessage(HttpMethod.Get, url);

        var responseContent = await SendRequestAsync(requestMsg, client, authToken);
        if (!string.IsNullOrEmpty(responseContent)) {
            using var doc = JsonDocument.Parse(responseContent);
            if (doc.RootElement.TryGetProperty("entities", out var entities)
                && entities.ValueKind == JsonValueKind.Array
                && entities.GetArrayLength() > 0) {
                var userId = entities[0]
                            .GetProperty("properties")
                            .GetProperty("Id")
                            .GetString();
                if (!string.IsNullOrWhiteSpace(userId))
                    return userId;
            }
        }

        _logger.SmaxNoUserFound(filter);

        if (name != null)
            return await GetPersonIdAsync(email, null, authToken);

        return null;
    }

    /// <summary>
    /// Retrieves the service ID based on the component code.
    /// </summary>
    /// <param name="frontendUrl">The component code.</param>
    /// <param name="authToken">The authorization token to be included in the request headers.</param>
    /// <returns>The service ID if found, otherwise null.</returns>
    private async Task<string?> GetServiceIdByCodeAsync(string frontendUrl, string authToken) {
        var url = $"{_options.Endpoint}/rest/{_options.TenantId}/ems/ActualService?filter=ShortDescription_c startswith ('{frontendUrl}')&layout=Id";
        var client = _httpClientFactory.CreateClient();
        var requestMsg = new HttpRequestMessage(HttpMethod.Get, url);

        var responseContent = await SendRequestAsync(requestMsg, client, authToken);
        if (string.IsNullOrEmpty(responseContent)) return null;

        using var doc = JsonDocument.Parse(responseContent);
        var root = doc.RootElement;

        if (!root.TryGetProperty("entities", out var entities) || entities.GetArrayLength() == 0) {
            _logger.SmaxNoServiceFound(frontendUrl);
            return null;
        }

        var userId = entities[0].GetProperty("properties").GetProperty("Id").GetString();
        return string.IsNullOrWhiteSpace(userId) ? null : userId;
    }

    /// <summary>
    /// Cleans and decodes an attachment file name returned in RFC 5987 format (e.g., "utf-8''fileName").
    /// If the name starts with the UTF-8 encoding prefix, it removes the prefix and decodes any percent-encoded characters.
    /// </summary>
    /// <param name="rawName">The raw attachment name as returned by the SMAX API.</param>
    /// <returns>The cleaned and readable file name.</returns>
    private static string CleanResponseString(string rawName) {
        const string prefix = "utf-8''";
        if (rawName.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) {
            var encodedPart = rawName[prefix.Length..];
            return Uri.UnescapeDataString(encodedPart);
        }

        return rawName;
    }
}
