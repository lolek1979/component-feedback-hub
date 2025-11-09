using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vzp.Config;
using Vzp.FeedbackHub.Api.Logging;

namespace Vzp.FeedbackHub.Api.Services;

/// <summary>
/// Service responsible for handling feedback processing and integration with Azure DevOps.
/// </summary>
public class DevOpsService : IFeedbackService {
    private readonly FeedbackHubConf _options;
    private readonly WorkItemTrackingHttpClient _workItemClient;
    private readonly ComponentInfoConf _componentInfoConf;
    private readonly ILogger<DevOpsService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="DevOpsService"/> class.
    /// </summary>
    /// <param name="options">Configuration options for the FeedbackHub.</param>
    /// <param name="workItemClient">Work Item Tracking HTTP client.</param>
    /// <param name="componentInfoConf">Configuration options for the ComponentInfo.</param>
    /// <param name="logger">Logger instance.</param>
    public DevOpsService(IOptions<FeedbackHubConf> options, WorkItemTrackingHttpClient workItemClient, IOptions<ComponentInfoConf> componentInfoConf, ILogger<DevOpsService> logger) {
        _options = options.Value;
        _workItemClient = workItemClient;
        _componentInfoConf = componentInfoConf.Value;
        _logger = logger;
    }

    /// <summary>
    /// Uploads attachments to Azure DevOps and returns their URLs.
    /// </summary>
    /// <param name="files">Array of files to upload as attachments.</param>
    /// <returns>List of uploaded attachment URLs.</returns>
    private async Task<List<string>> UploadAttachmentsAsync(IFormFile[] files) {
        var uploadTasks = files.Select(async file => {
            using var stream = file.OpenReadStream();
            var attachmentRef = await _workItemClient.CreateAttachmentAsync(stream, file.FileName, null, null, null, default);
            return attachmentRef.Url;
        });

        return [.. await Task.WhenAll(uploadTasks)];
    }

    /// <summary>
    /// Processes user feedback and creates a work item in Azure DevOps.
    /// </summary>
    /// <param name="request">The feedback creation request containing details about the issue.</param>
    /// <returns>A boolean value indicating whether the feedback was successfully processed.</returns>
    public async Task<bool> ProcessFeedbackAsync(FeedbackCreateRequest request) {
        var attachmentUrls = await UploadAttachmentsAsync(request.Attachments);

        var reproStepsBuilder = new StringBuilder();
        _ = reproStepsBuilder.Append($"<div>{request.Description}</div><br><br>");
        _ = reproStepsBuilder.Append("<div><ul>");
        _ = reproStepsBuilder.AppendFormat("<li><b>{0}:</b> {1}</li>", nameof(request.ReportTime), request.ReportTime.ToUniversalTime().ToString(Constants.DateTimeFormatForUTC));
        _ = reproStepsBuilder.AppendFormat("<li><b>{0}:</b> {1} </li>", nameof(request.UserIdentifier), request.UserIdentifier);
        if (!string.IsNullOrEmpty(request.FeedbackData)) _ = reproStepsBuilder.AppendFormat("<li><b>{0}:</b> {1}</li>", nameof(request.FeedbackData), request.FeedbackData);
        if (!string.IsNullOrEmpty(request.Url)) _ = reproStepsBuilder.AppendFormat("<li><b>{0} :</b> {1}</li>", nameof(request.Url), request.Url);
        _ = reproStepsBuilder.Append("</ul></div>");

        var systemInfoBuilder = new StringBuilder();
        _ = systemInfoBuilder.Append("<div><ul>");
        _ = systemInfoBuilder.AppendFormat("<li><b>{0}:</b> {1}</li>", nameof(request.Browser), request.Browser);
        _ = systemInfoBuilder.AppendFormat("<li><b>{0}:</b> {1} </li>", nameof(request.BrowserVersion), request.BrowserVersion);
        _ = systemInfoBuilder.AppendFormat("<li><b>{0}:</b> {1} </li>", nameof(request.OperatingSystem), request.OperatingSystem);
        _ = systemInfoBuilder.AppendFormat("<li><b>{0}:</b> {1} </li>", nameof(request.VersionOfOperatingSystem), request.VersionOfOperatingSystem);
        _ = systemInfoBuilder.Append("</ul></div>");

        var titlePrefix = string.IsNullOrEmpty(_options.TitlePrefix) ? $"{_componentInfoConf.EnvironmentName} " : $"{_options.TitlePrefix}:{_componentInfoConf.EnvironmentName} ";
        var patchDocument = new JsonPatchDocument {
            new JsonPatchOperation
            {
                Operation = Operation.Add,
                Path = "/fields/System.Title",
                Value = request.Title is not null ? $"{titlePrefix}{request.Title}" : $"{titlePrefix}{_options.DefaultTitle} - {request.ReportTime.ToUniversalTime().ToString(Constants.DateTimeFormatForUTC)}",
            },
            new JsonPatchOperation
            {
                Operation = Operation.Add,
                Path = "/fields/Microsoft.VSTS.TCM.ReproSteps",
                Value = reproStepsBuilder.ToString()
            },
            new JsonPatchOperation
            {
                Operation = Operation.Add,
                Path = "/fields/Microsoft.VSTS.TCM.SystemInfo",
                Value = systemInfoBuilder.ToString()
            }
        };

        patchDocument.AddIf(!string.IsNullOrEmpty(_options.AreaPath),
        new JsonPatchOperation {
            Operation = Operation.Add,
            Path = "/fields/System.AreaPath",
            Value = _options.AreaPath
        });
        patchDocument.AddIf(!string.IsNullOrEmpty(_options.IterationPath),
        new JsonPatchOperation {
            Operation = Operation.Add,
            Path = "/fields/System.IterationPath",
            Value = _options.IterationPath
        });
        patchDocument.AddIf(!string.IsNullOrEmpty(_options.Priority),
        new JsonPatchOperation {
            Operation = Operation.Add,
            Path = "/fields/Microsoft.VSTS.Common.Priority",
            Value = _options.Priority
        });

        foreach (var attachmentUrl in attachmentUrls) {
            patchDocument.Add(new JsonPatchOperation {
                Operation = Operation.Add,
                Path = "/relations/-",
                Value = new {
                    rel = "AttachedFile",
                    url = attachmentUrl,
                    attributes = new { comment = "Přiložený soubor" }
                }
            });
        }

        try {
            _ = await _workItemClient.CreateWorkItemAsync(patchDocument, _options.ProjectName, _options.IncidentType);
        } catch (Exception ex) {
            _logger.DevOpsWorkItemCreationFailed(ex);
            return false;
        }

        return true;
    }
}
