using System.Threading.Tasks;
using Vzp.FeedbackHub.Api.Contract;

namespace Vzp.FeedbackHub.Api;

/// <summary>
/// IFeedbackService
/// </summary>
public interface IFeedbackService {
    /// <summary>
    /// ProcessFeedbackAsync
    /// </summary>
    Task<bool> ProcessFeedbackAsync(FeedbackCreateRequest request);
}
