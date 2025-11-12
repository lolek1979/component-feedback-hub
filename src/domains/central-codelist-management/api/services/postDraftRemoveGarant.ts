import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostDraftRemoveGarantResponse {
  status: number;
}

export const postDraftRemoveGarant = async (
  draftId: string,
  garants: string[],
): Promise<PostDraftRemoveGarantResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/garants/remove`,
      garants,
    );

    return response.data as PostDraftRemoveGarantResponse;
  } catch (error) {
    console.error('Error remove garants to draft:', error);

    return null;
  }
};
