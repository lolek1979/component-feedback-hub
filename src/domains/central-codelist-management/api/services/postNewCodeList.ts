import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostNewCodeListResponse {
  draftId: string;
  codeListId: string;
}

export const postNewCodeList = async (data: {
  name: string;
  description: string;
  validFrom: string;
  garants: string[];
  versionType: string;
}): Promise<PostNewCodeListResponse | null> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(`codelists/api/rest/v${API_VERSION}/drafts`, data);

    return response.data as PostNewCodeListResponse;
  } catch (error: unknown) {
    throw error;
  }
};
