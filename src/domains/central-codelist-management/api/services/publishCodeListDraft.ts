import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface Messages {
  severity: string;
  code: string;
  data: string[];
}

interface PostCodeListDraftResponse {
  state: 'Success' | 'Error' | 'Failure';
  messages: Messages[];
  payload: string;
}

export const publishCodeListDraft = async (
  codeListId: string,
): Promise<PostCodeListDraftResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${codeListId}/publish`,
    );

    return response.data as PostCodeListDraftResponse;
  } catch (error) {
    console.error('Error publishing', error);

    return null;
  }
};
