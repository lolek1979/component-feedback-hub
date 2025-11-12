import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { GetAllDraftsInCodelistParams } from '../query/useAllDraftsInCodelist';

export interface AllDraftsInCodelistResponse {
  id: string;
  codeListId: string;
  name: string;
  description: string;
  validFrom: string;
  versionType: string;
  code: string;
}

export const getAllDraftsInCodelist = async (
  params: GetAllDraftsInCodelistParams,
): Promise<AllDraftsInCodelistResponse | null> => {
  const queryParams = {
    ...(params.id && { id: params.id }),
  };

  const result = await axiosInstance
    .get(`codelists/api/rest/v${API_VERSION}/codelists/${params.id}/drafts`, {
      params: queryParams,
    })
    .then((res) => {
      return res.data as AllDraftsInCodelistResponse;
    })
    .catch(() => {
      return null;
    });

  return result;
};
