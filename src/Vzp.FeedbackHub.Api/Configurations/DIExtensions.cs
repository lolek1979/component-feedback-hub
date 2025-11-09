using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;
using Vzp.FeedbackHub.Api.Services;

namespace Vzp.FeedbackHub.Api.Configurations;

/// <summary>
/// DI Extensions
/// </summary>
public static class DIExtensions {
    /// <summary>
    /// Adds the FeedbackHub services to the DI container, based on the provided configuration.
    /// Initializes the appropriate feedback service depending on the configuration settings.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to which services will be added.</param>
    /// <param name="configuration">The <see cref="IConfiguration"/> instance containing configuration settings.</param>
    /// <returns>The updated <see cref="IServiceCollection"/> instance with the added services.</returns>
    public static IServiceCollection AddFeedbackHub(this IServiceCollection services, IConfiguration configuration) {
        var logger = services.BuildServiceProvider().GetRequiredService<ILogger<FeedbackHubConf>>();
        var feedbackHubConfiguration = configuration.GetSection(FeedbackHubConf.SectionName).Get<FeedbackHubConf>() ?? throw new InvalidOperationException($"{FeedbackHubConf.SectionName} configuration section is missing.");

        if (!feedbackHubConfiguration.IsEnabled) {
            logger.LogWarning("FeedbackHub will be disabled. {FeedbackHubConf.SectionName} is explicitly turned off.", FeedbackHubConf.SectionName);
            _ = services.AddSingleton<IFeedbackService, NullService>();
            return services;
        }

        _ = services.AddOptions<FeedbackHubConf>().BindConfiguration(FeedbackHubConf.SectionName).ValidateDataAnnotations().ValidateOnStart();
        var conf = services.BuildServiceProvider().GetRequiredService<IOptions<FeedbackHubConf>>().Value;

            switch (conf.Client) {
            case FeedbackHubClient.Smax:
                _ = services.AddHttpClient();
                _ = services.AddSingleton<SmaxAuthService>();
                _ = services.AddScoped<IFeedbackService, SmaxService>();
                logger.LogInformation("Smax feedback hub client initialized.");
                break;
            case FeedbackHubClient.DevOps:
                _ = services.AddSingleton<VssConnection>(serviceProvider => {
                    var connection = new VssConnection(new Uri(conf.Endpoint), new VssBasicCredential(string.Empty, conf.Pass));
                    return connection;
                });
                _ = services.AddScoped<WorkItemTrackingHttpClient>(serviceProvider => {
                    var connection = serviceProvider.GetRequiredService<VssConnection>();
                    return connection.GetClient<WorkItemTrackingHttpClient>();
                });
                _ = services.AddScoped<IFeedbackService, DevOpsService>();
                logger.LogInformation("DevOps feedback hub client initialized.");
                break;
            default:
                throw new NotImplementedException("Feedback hub client is not implemented.");
        }

        return services;
    }
}