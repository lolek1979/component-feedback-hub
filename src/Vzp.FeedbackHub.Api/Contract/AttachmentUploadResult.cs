namespace Vzp.FeedbackHub.Api.Contract;

/// <summary>
/// Represents the result of a file upload operation, including metadata and status.
/// </summary>
public class AttachmentUploadResult {
    /// <summary>
    /// The identifier of the user who uploaded the file.
    /// </summary>
    public required string Creator { get; set; }

    /// <summary>
    /// Indicates whether the upload operation was successful.
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// The original name of the uploaded file.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// The globally unique identifier assigned to the uploaded file.
    /// </summary>
    public required string Guid { get; set; }

    /// <summary>
    /// The size of the uploaded file in bytes.
    /// </summary>
    public long ContentLength { get; set; }

    /// <summary>
    /// The MIME type of the uploaded file.
    /// </summary>
    public required string ContentType { get; set; }
}
