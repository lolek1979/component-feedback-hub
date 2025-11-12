import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PutDraftUpdatesResponse {
  message: string;
}
export interface Payload {
  codeListId: string;
  name: string;
  description: string;
  validFrom: string;
  code: string | null;
  versionType: string;
}

export const putDraftUpdates = async (
  draftId: string,
  payload: Payload,
): Promise<PutDraftUpdatesResponse | null> => {
  try {
    const response = await axiosInstance.put(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}`,
      payload,
    );

    return response.data as PutDraftUpdatesResponse;
  } catch (error) {
    console.error('Error updating drafts:', error);

    return null;
  }
};
