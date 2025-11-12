import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';
import { TableRowType } from '@/design-system/molecules/Table';

import { GetCodelistsParams } from '../query/useCodeLists';

export interface Garant {
  abbrev: string;
  fullName: string;
}

export interface Version extends TableRowType {
  id: string;
  name: string;
  description: string;
  validFrom: string;
  validTo: string | null;
  versionType: string;
}

export interface Draft extends TableRowType {
  id: string;
  name: string;
  description: string;
  validFrom: string;
  validTo: string | null;
  versionType: string;
  state: string;
}

export interface Codelist {
  id: string;
  name: string;
  description: string;
  validFrom: string;
  validTo: string;
  garants: Garant[];
  versionType: string;
  versions: Version[];
  drafts: Draft[];
}

export type tCodelistResponse = Codelist[];

export const getCodeLists = async (
  params: GetCodelistsParams,
): Promise<tCodelistResponse | null> => {
  const queryParams = {
    ...(params.time && { time: params.time }),
    ...(params.id && { id: params.id }),
  };

  const result = await axiosInstance
    .get(`codelists/api/rest/v${API_VERSION}/codelists`, {
      params: queryParams,
    })
    .then((res) => {
      return res.data as tCodelistResponse;
    })
    .catch(() => {
      return null;
    });

  return result;
};
