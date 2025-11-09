using System.Threading.Tasks;

namespace Vzp.FeedbackHub.Api.Services;

/// <summary>
/// Null service
/// </summary>
public class NullService : IFeedbackService {

    /// <summary>
    /// ProcessFeedbackAsync - return false
    /// </summary>
    public async Task<bool> ProcessFeedbackAsync(FeedbackCreateRequest request) {
        return await Task.FromResult(false);
    }
}