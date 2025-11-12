import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostDraftRemoveEditorResponse {
  status: number;
}

export const postDraftRemoveEditor = async (
  draftId: string,
  editors: string[],
): Promise<PostDraftRemoveEditorResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/editors/remove`,
      editors,
    );

    return response.data as PostDraftRemoveEditorResponse;
  } catch (error) {
    console.error('Error removing editors to draft:', error);

    return null;
  }
};
