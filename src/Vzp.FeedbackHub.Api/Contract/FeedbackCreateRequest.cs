using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;

namespace Vzp.FeedbackHub.Api.Contract;

/// <summary>
/// FeedbackCreate Request
/// </summary>
public record FeedbackCreateRequest : IValidatableObject {
    /// <summary>
    /// Date and time when report was created.
    /// </summary>
    [BindRequired]
    public required DateTimeOffset ReportTime { get; set; }

    /// <summary>
    /// String identifier of the reporting user (email, id form IDM, ....)
    /// </summary>
    [MaxLength(250)]
    public required string UserIdentifier { get; set; }

    /// <summary>
    /// UserName of the reporting user
    /// </summary>
    [MaxLength(100)]
    public string? UserName { get; set; }

    /// <summary>
    /// Title of the feedback describing problem/feedback content.
    /// </summary>
    [MaxLength(90)] // + max 50? pro prefix
    public string? Title { get; set; }

    /// <summary>
    /// Detailed description of the feedback.
    /// </summary>
    [MaxLength(1000)]
    public required string Description { get; set; }

    /// <summary>
    /// Feedback entry can contain these data when applicable. For example URL doesn't make sense for desktop applications.
    /// </summary>
    [MaxLength(3000)]
    public string? FeedbackData { get; set; }

    /// <summary>
    /// Url of the page related to provided feedback if applicable.
    /// </summary>
    [Url]
    [MaxLength(2000)]
    public string? Url { get; set; }

    /// <summary>
    /// Log files, screenshots and other possible attachments which helps to describe the problem and provide solution of the problem.
    /// </summary>
    [MaxLength(5)]
    public required IFormFile[] Attachments { get; set; }

    // TODO prověrit jak pro desktop aplikaci
    /// <summary>
    /// Brand of the browser like Firefox, Edge, Chrome, WebView2, .....
    /// </summary>
    [MaxLength(50)]
    public required string Browser { get; set; }

    // TODO prověrit jak pro desktop aplikaci
    /// <summary>
    /// Version of the browser where application is running.
    /// </summary>
    [MaxLength(50)]
    public required string BrowserVersion { get; set; }

    /// <summary>
    /// Brand of the operating system like Windows 11 , MacOS, Linux .....
    /// </summary>
    [MaxLength(50)]
    public required string OperatingSystem { get; set; }

    /// <summary>
    /// Version of operating system user is running.
    /// </summary>
    [MaxLength(50)]
    public required string VersionOfOperatingSystem { get; set; }

    /// <summary>
    /// URL of the frontend application from which the feedback was submitted, if available.
    /// </summary>
    [MaxLength(100)]
    public string? FrontendUrl { get; set; }

    ///<inheritdoc/>
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
        var _maxFileSizeBytes = (long)2 * 1024 * 1024;
        string[] allowedExtensions = [".png"];
        if (Attachments is IFormFile[] files) {
            foreach (var file in files) {
                if (file.Length > _maxFileSizeBytes) {
                    yield return new ValidationResult($"File \"{file.FileName}\" exceeds the maximum allowed size of {_maxFileSizeBytes / (1024.0 * 1024):0.##} MB.", [nameof(Attachments)]);
                }

                if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower())) {
                    yield return new ValidationResult($"File \"{file.FileName}\" is not a valid file type. Only PNG files are allowed.", [nameof(Attachments)]);
                }
            }
        }
    }
}
