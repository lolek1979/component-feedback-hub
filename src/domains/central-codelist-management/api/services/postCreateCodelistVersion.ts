import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

export interface PostCreateCodelistVersionParams {
  codeListId: string;
  name: string;
  description: string;
  validFrom: string;
  garants: string[];
  editors: string[];
  versionType: string;
  code?: string;
}

export interface PostCreateCodelistVersionResponse {
  draftId: string;
  codeListId: string;
}

export const postCreateCodelistVersion = async (
  data: PostCreateCodelistVersionParams,
): Promise<PostCreateCodelistVersionResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(`codelists/api/rest/v${API_VERSION}/drafts`, {
      codeListId: data.codeListId,
      name: data.name,
      description: data.description,
      validFrom: data.validFrom,
      garants: data.garants,
      editors: data.editors,
      versionType: data.versionType,
      code: data.code,
    });

    return response.data as PostCreateCodelistVersionResponse;
  } catch (error) {
    throw error;
  }
};
