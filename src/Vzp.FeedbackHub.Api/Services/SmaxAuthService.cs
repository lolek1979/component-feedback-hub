using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Vzp.FeedbackHub.Api.Logging;

namespace Vzp.FeedbackHub.Api.Services;

/// <summary>
/// SmaxAuthService
/// </summary>
public class SmaxAuthService {
    private readonly FeedbackHubConf _options;
    private readonly ILogger<SmaxAuthService> _logger;
    private SmaxAuthToken? _cachedToken;
    private readonly TimeSpan TokenLifetime;

    /// <summary>
    /// Initializes a new instance of the <see cref="SmaxAuthService"/> class, used to handle authentication with the SMAX incident management system.
    /// </summary>
    /// <param name="options">Configuration settings for the FeedbackHub, including SMAX credentials and endpoints.</param>
    /// <param name="logger">Logger instance.</param>
    public SmaxAuthService(IOptions<FeedbackHubConf> options, ILogger<SmaxAuthService> logger) {
        _options = options.Value;
        _logger = logger;
        TokenLifetime = TimeSpan.FromMinutes(_options.SmaxTokenLifetime);
    }

    /// <summary>
    /// Retrieves a valid SMAX authentication token, optionally forcing a refresh.
    /// </summary>
    /// <param name="forceRefresh">If set to <c>true</c>, forces the token to be refreshed even if a valid one is cached.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="SmaxAuthToken"/>.</returns>
    public async Task<SmaxAuthToken> GetTokenAsync(bool forceRefresh = false) {
        if (!forceRefresh && IsTokenValid()) {
            return _cachedToken!;
        }

        _logger.SmaxTokenRequestStarted();

        var cookieContainer = new CookieContainer();
        var handler = new HttpClientHandler {
            UseCookies = true,
            CookieContainer = cookieContainer
        };

        using var client = new HttpClient(handler);

        var payload = new {
            login = _options.SmaxUser!,
            password = _options.Pass
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var url = $"{_options.Endpoint}/auth/authentication-endpoint/authenticate/login?TENANTID={_options.TenantId}";

        var response = await client.PostAsync(url, content);
        _ = response.EnsureSuccessStatusCode();

        var authToken = (await response.Content.ReadAsStringAsync()).Trim();

        var cookies = cookieContainer.GetCookies(new Uri(_options.Endpoint));

        _cachedToken = new SmaxAuthToken {
            AuthToken = authToken,
            ExpiresAt = DateTime.UtcNow.Add(TokenLifetime)
        };

        
        _logger.SmaxTokenReceived(_cachedToken.ExpiresAt);

        return _cachedToken;
    }

    /// <summary>
    /// Forces retrieval of a new SMAX authentication token, bypassing any cached token.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="SmaxAuthToken"/>.</returns>
    public Task<SmaxAuthToken> ForceRefreshTokenAsync() => GetTokenAsync(forceRefresh: true);

    private bool IsTokenValid() {
        var isValid = _cachedToken != null && _cachedToken.ExpiresAt > DateTime.UtcNow;
        if (!isValid) {
            _logger.SmaxTokenExpiredOrMissing();
        }

        return isValid;
    }
}
