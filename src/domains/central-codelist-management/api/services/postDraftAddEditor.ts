import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostDraftAddEditorsResponse {
  status: number;
}

export const postDraftAddEditor = async (
  draftId: string,
  editors: string[],
): Promise<PostDraftAddEditorsResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/editors/add`,
      editors,
    );

    return response.status as unknown as PostDraftAddEditorsResponse;
  } catch (error) {
    console.error('Error adding editors to draft:', error);

    return null;
  }
};
