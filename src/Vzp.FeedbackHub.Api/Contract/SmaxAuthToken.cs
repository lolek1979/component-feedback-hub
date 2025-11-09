namespace Vzp.FeedbackHub.Api.Contract;

/// <summary>
/// SmaxAuthToken
/// </summary>
public class SmaxAuthToken {
    /// <summary>
    /// Generated authentification token.
    /// </summary>
    public string AuthToken { get; set; } = string.Empty;

    /// <summary>
    /// When token expires.
    /// </summary>
    public DateTime ExpiresAt { get; set; }
}