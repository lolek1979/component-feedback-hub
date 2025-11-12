import { API_VERSION, axiosInstance } from '@/core';

interface PostDraftDataUpdateResponse {
  draftId: string;
  codeListId: string;
}
export type PostDraftDataUpdate = {
  delete: number[];
  update: {
    [rowNr: number]: string[];
  };
  add: Array<{
    rowNr?: number;
    values: string[];
  }>;
};
export const postDraftDataUpdate = async (
  draftId: string,
  data: PostDraftDataUpdate,
): Promise<PostDraftDataUpdateResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/data/update`,
      data,
    );

    return response.data as PostDraftDataUpdateResponse;
  } catch (error) {
    console.error('Error Patching draft data:', error);

    return null;
  }
};
