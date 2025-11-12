import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface DeleteCodeListDraftResponse {
  status: 'Success' | 'Error';
  messages: [];
}

export const deleteCodeListDraft = async (
  draftId: string,
): Promise<DeleteCodeListDraftResponse | null> => {
  try {
    const response = await axiosInstance.delete(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}`,
    );

    return response.data as DeleteCodeListDraftResponse;
  } catch (error) {
    console.error('Error deleting code list draft:', error);

    return null;
  }
};
