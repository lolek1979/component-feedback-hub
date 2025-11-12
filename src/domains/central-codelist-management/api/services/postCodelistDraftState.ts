import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface Messages {
  severity: string;
  code: string;
  data: string[];
}

interface PostCodeListDraftStateResponse {
  state: 'Success' | 'Failure';
  messages: Messages[];
  payload: string;
}

export const postStateCodeListDraft = async (
  codeListId: string,
  state: string,
): Promise<PostCodeListDraftStateResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${codeListId}/state?state=${encodeURIComponent(state)}`,
    );

    return response.data as PostCodeListDraftStateResponse;
  } catch (error) {
    console.error('Error publishing', error);

    return null;
  }
};
