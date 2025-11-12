import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostDraftAddGarantResponse {
  status: number;
}

export const postDraftAddGarant = async (
  draftId: string,
  garants: string[],
): Promise<PostDraftAddGarantResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/garants/add`,
      garants,
    );

    return response.data as PostDraftAddGarantResponse;
  } catch (error) {
    console.error('Error adding garants to draft:', error);

    return null;
  }
};
