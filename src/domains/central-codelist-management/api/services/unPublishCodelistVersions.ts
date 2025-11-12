import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface UnPublishCodeListDraftResponse {
  state: 'Success' | 'Error';
  messages: string[];
  payload: string;
}

export const unPublishCodeListVersion = async (
  codeListId: string,
): Promise<UnPublishCodeListDraftResponse> => {
  const response = await axiosInstance.post(
    `codelists/api/rest/v${API_VERSION}/codelists/versions/${codeListId}/unpublish`,
  );

  return response.data;
};
