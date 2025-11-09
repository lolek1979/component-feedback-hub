using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;
using Moq;
using System.Net;
using Vzp.Config;
using Vzp.FeedbackHub.Api.Configurations;
using Vzp.FeedbackHub.Api.Contract;
using Vzp.FeedbackHub.Api.Services;

namespace Vzp.FeedbackHub.Api.Test.Services;

[TestClass]
public class DevOpsServiceTest {
    private readonly Mock<IOptions<FeedbackHubConf>> _mockOptions;
    private readonly Mock<WorkItemTrackingHttpClient> _mockWorkItemClient;
    private readonly DevOpsService _devOpsService;
    private readonly Mock<IOptions<ComponentInfoConf>> _mockOptionsComponentInfoConf;
    private readonly Mock<ILogger<DevOpsService>> _mockLogger;

    public DevOpsServiceTest() {
        _mockOptions = new Mock<IOptions<FeedbackHubConf>>();
        _mockWorkItemClient = new Mock<WorkItemTrackingHttpClient>(new Uri("http://dummy.url"), new VssCredentials());
        _mockOptionsComponentInfoConf = new Mock<IOptions<ComponentInfoConf>>();
        _mockLogger = new Mock<ILogger<DevOpsService>>();

        _ = _mockOptions.Setup(opt => opt.Value).Returns(new FeedbackHubConf {
            DefaultTitle = "Test Title",
            AreaPath = "TestArea",
            IterationPath = "TestIteration",
            Priority = "2",
            ProjectName = "TestProject",
            IncidentType = "Bug",
            Endpoint = "http://dummy.url",
            Pass = "sdsfsd"
        });

        _ = _mockOptionsComponentInfoConf.Setup(opt => opt.Value).Returns(new ComponentInfoConf {
            Application = "testApplication",
            ComponentCode = "testComponentCode",
            ComponentName = "testComponentName",
            Domain = "testDomain",
            EnvironmentName = "testEnv"
        });

        _devOpsService = new DevOpsService(_mockOptions.Object, _mockWorkItemClient.Object, _mockOptionsComponentInfoConf.Object, _mockLogger.Object);
    }

    [TestMethod]
    public async Task ProcessFeedbackAsync_ShouldReturnTrue_WhenWorkItemIsCreated() {
        // Arrange
        var request = new FeedbackCreateRequest {
            Title = "Test Issue",
            Description = "Test Description",
            Attachments = [],
            ReportTime = DateTime.Now,
            UserIdentifier = "user123",
            Browser = "browser",
            BrowserVersion = "1",
            OperatingSystem = "win",
            VersionOfOperatingSystem = "11"
        };

        _ = _mockWorkItemClient.Setup(client => client.CreateWorkItemAsync(It.IsAny<JsonPatchDocument>(), It.IsAny<string>(), It.IsAny<string>(), null, null, null, null, null, default))
            .ReturnsAsync(new WorkItem { Id = 1 });

        // Act
        var result = await _devOpsService.ProcessFeedbackAsync(request);

        // Assert
        Assert.IsTrue(result);
    }

    [TestMethod]
    public async Task ProcessFeedbackAsync_ShouldThrowWorkItemTrackingException_WhenCreateWorkItemAsyncFails() {
        // Arrange
        var request = new FeedbackCreateRequest {
            Title = "Test Issue",
            Description = "Test Description",
            Attachments = [],
            ReportTime = DateTime.Now,
            UserIdentifier = "user123",
            Browser = "browser",
            BrowserVersion = "1",
            OperatingSystem = "win",
            VersionOfOperatingSystem = "11"
        };

        _ = _mockWorkItemClient
            .Setup(client => client.CreateWorkItemAsync(It.IsAny<JsonPatchDocument>(), It.IsAny<string>(), It.IsAny<string>(), null, null, null, null, null, default))
            .ThrowsAsync(new VssServiceResponseException(HttpStatusCode.InternalServerError, "Error creating work item", new Exception()));

        // Act
        var result = await _devOpsService.ProcessFeedbackAsync(request);

        // Assert
        Assert.IsFalse(result);
    }
}
