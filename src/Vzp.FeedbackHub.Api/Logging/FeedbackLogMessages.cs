using Microsoft.Extensions.Logging;

namespace Vzp.FeedbackHub.Api.Logging;

/// <summary>
/// Structured log messages for feedback processing events.
/// </summary>
static partial class FeedbackLoggerExtensions {
    // SMAX
    [LoggerMessage(EventId = 1, Level = LogLevel.Information, Message = "Starting to process feedback for request: {Title}")]
    public static partial void SmaxProcessingFeedback(this ILogger logger, string title);

    [LoggerMessage(EventId = 2, Level = LogLevel.Information, Message = "Request details: User: {User}, Time: {Time}, Browser: {Browser}, OS: {OS}, URL: {Url}")]
    public static partial void SmaxFeedbackRequestDetails(this ILogger logger, string user, string time, string browser, string os, string url);

    [LoggerMessage(EventId = 3, Level = LogLevel.Error, Message = "Failed to acquire authentication token.")]
    public static partial void SmaxAuthTokenFailed(this ILogger logger);

    [LoggerMessage(EventId = 4, Level = LogLevel.Error, Message = "The return value is empty. An error occurred while creating a new request.")]
    public static partial void SmaxEntityIdMissing(this ILogger logger);

    [LoggerMessage(EventId = 5, Level = LogLevel.Information, Message = "Request created successfully in SMAX with Entity ID: {EntityId}")]
    public static partial void SmaxRequestCreated(this ILogger logger, string entityId);

    [LoggerMessage(EventId = 6, Level = LogLevel.Information, Message = "Feedback processed successfully for request: {Title}")]
    public static partial void SmaxFeedbackProcessed(this ILogger logger, string title);

    [LoggerMessage(EventId = 7, Level = LogLevel.Error, Message = "Attachment uploaded but failed to return a valid GUID.")]
    public static partial void SmaxAttachmentInvalidGuid(this ILogger logger);

    [LoggerMessage(EventId = 8, Level = LogLevel.Information, Message = "Attachment uploaded successfully with GUID: {Guid}")]
    public static partial void SmaxAttachmentUploaded(this ILogger logger, string guid);

    [LoggerMessage(EventId = 9, Level = LogLevel.Information, Message = "Attachment successfully associated with the request.")]
    public static partial void SmaxAttachmentAssociated(this ILogger logger);

    [LoggerMessage(EventId = 10, Level = LogLevel.Error, Message = "Request failed: {StatusCode} - {ReasonPhrase}")]
    public static partial void SmaxHttpRequestFailed(this ILogger logger, System.Net.HttpStatusCode statusCode, string? reasonPhrase);

    [LoggerMessage(EventId = 11, Level = LogLevel.Error, Message = "Error during HTTP request")]
    public static partial void SmaxHttpRequestException(this ILogger logger, Exception exception);

    [LoggerMessage(EventId = 12, Level = LogLevel.Warning, Message = "No user found for {Upn}:")]
    public static partial void SmaxNoUserFound(this ILogger logger, string upn);

    [LoggerMessage(EventId = 13, Level = LogLevel.Warning, Message = "No Actual Service found for frontend url: {FrontendUrl}")]
    public static partial void SmaxNoServiceFound(this ILogger logger, string FrontendUrl);

    // SmaxAuthService
    [LoggerMessage(EventId = 101, Level = LogLevel.Information, Message = "Getting new SMAX token...")]
    public static partial void SmaxTokenRequestStarted(this ILogger logger);

    [LoggerMessage(EventId = 102, Level = LogLevel.Information, Message = "New SMAX token obtained. Valid until: {Expiry}")]
    public static partial void SmaxTokenReceived(this ILogger logger, DateTime expiry);

    [LoggerMessage(EventId = 103, Level = LogLevel.Warning, Message = "The SMAX token has expired or is not available.")]
    public static partial void SmaxTokenExpiredOrMissing(this ILogger logger);

    // DevOps
    [LoggerMessage(EventId = 201, Level = LogLevel.Error, Message = "Error creating work item in Azure DevOps.")]
    public static partial void DevOpsWorkItemCreationFailed(this ILogger logger, Exception exception);
}
