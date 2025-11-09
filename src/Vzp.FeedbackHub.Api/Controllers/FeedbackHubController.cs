using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Vzp.AspNetCore.Controllers;

namespace Vzp.FeedbackHub.Api.Controllers;

/// <summary>
/// Feedback Hub Controller
/// </summary>
[Route("api/rest/v{version:apiVersion}/feedbackhub")]
[ApiVersion("1.0")]
[ApiController]
public class FeedbackHubController(IFeedbackService feedbackService, IOptions<FeedbackHubConf> options) : BaseController {
    private readonly IFeedbackService _feedbackService = feedbackService;
    private readonly FeedbackHubConf _options = options.Value;

    /// <summary>
    /// CreateAsync
    /// </summary>
    /// <param name="request"></param>
    [HttpPost()]
    [EndpointSummary("Create a new work item.")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [Consumes(typeof(FeedbackCreateRequest), "multipart/form-data")]
    [Authorize(Roles = "NIS.User")]
    public async Task<IActionResult> CreateAsync([FromForm] FeedbackCreateRequest request) {
        if (_options.IsEnabled) {
            var success = await _feedbackService.ProcessFeedbackAsync(request);
            if (!success) {
                return BadRequest(new ProblemDetails() { Title = "Failed to create ticket." });
            }

            return Created();
        } else {
            return NotFound(new ProblemDetails() { Title = "Ticketing is disabled." });
        }
    }
}
