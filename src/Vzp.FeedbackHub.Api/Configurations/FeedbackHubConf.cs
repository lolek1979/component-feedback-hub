using System.ComponentModel.DataAnnotations;

namespace Vzp.FeedbackHub.Api.Configurations;

/// <summary>
/// Configuration for FeedbackHub
/// </summary>
public class FeedbackHubConf {

    /// <summary>
    /// SectionName - Configuration section name
    /// </summary>
    public const string SectionName = "FeedbackHub";

    /// <summary>
    /// Client - Configuration: FeedbackHub client to use (values: DevOps or Smax)
    /// </summary>
    [Required]
    [EnumDataType(typeof(FeedbackHubClient))]
    public FeedbackHubClient Client { get; set; }

    /// <summary>
    /// IsEnabled - Configuration: if true, bug will be created
    /// </summary>
    [Required]
    public bool IsEnabled { get; set; } = false;

    /// <summary>
    /// Endpoint
    /// </summary>
    [Required(AllowEmptyStrings = false)]
    public required string Endpoint { get; set; }

    /// <summary>
    /// SmaxUser - username for Smax authentification
    /// </summary>
    public string? SmaxUser { get; set; }

    /// <summary>
    /// Pass - DEVOPS = Personal Access Token, Smax = password for SMax authentification
    /// </summary>
    [Required(AllowEmptyStrings = false)]
    public required string Pass { get; set; }

    /// <summary>
    /// Priority - DevOps = [1,2,3], Smax = ["NoDisruption","SlightDisruption","SevereDisruption","TotalLossOfService"] for Smax field Urgency
    /// </summary>
    public string? Priority { get; set; }

    /// <summary>
    /// ProjectName
    /// </summary>
    public string? ProjectName { get; set; }

    /// <summary>
    /// IncidentType
    /// </summary>
    [Required(AllowEmptyStrings = false)]
    public required string IncidentType { get; set; }

    /// <summary>
    /// DefaultTitle
    /// </summary>
    public string? DefaultTitle { get; set; }

    /// <summary>
    /// AreaPath - only for DevOps
    /// </summary>
    public string? AreaPath { get; set; }

    /// <summary>
    /// IterationPath - only for DevOps
    /// </summary>
    public string? IterationPath { get; set; }

    /// <summary>
    /// TenantId - only for Smax
    /// </summary>
    public string? TenantId { get; set; }

    /// <summary>
    /// ContactPerson - only for Smax
    /// </summary>
    public int? ContactPerson { get; set; }

    /// <summary>
    /// RequestsOffering - only for Smax
    /// </summary>
    public int? RequestsOffering { get; set; }

    /// <summary>
    /// AffectedService - only for Smax
    /// </summary>
    public int? AffectedService { get; set; }

    /// <summary>
    /// Title prefix
    /// </summary>
    public string? TitlePrefix { get; set; }

    /// <summary>
    /// SmaxTokenLifetime - only for Smax
    /// </summary>
    public int SmaxTokenLifetime { get; set; }
}