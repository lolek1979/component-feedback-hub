import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';
import { ColumnType } from '@/design-system/molecules/Table';

import { GetDraftsByIdParams } from '../query/useDraftsById';

export interface Field {
  code: string | null;
  name: string;
  index: number;
  length: number;
  default: string;
  valueType: ColumnType;
  description: string;
  validations: undefined[];
}

export interface Structure {
  name: string;
  fields: Field[];
}

export interface Garants {
  id: string;
  abbrev: string;
  fullName: string;
  mail: string;
  department: string;
  businessPhones: string[];
}

export type Content = string[][];

export interface DraftsByIdResponse {
  structure: {
    structGuid: string;
    version: string;
    name: string;
    fields: Field[];
  };
  content: Content;
  id: string;
  codeListId: string;
  name: string;
  description: string;
  validFrom: string;
  garants: Garants[];
  editors: Garants[];
  versionType: string;
  code: string;
}

export const getDraftsById = async (
  params: GetDraftsByIdParams,
): Promise<DraftsByIdResponse | null> => {
  const result = await axiosInstance
    .get(`codelists/api/rest/v${API_VERSION}/drafts/${params.id}`)
    .then((res) => {
      return res.data as DraftsByIdResponse;
    })
    .catch(() => {
      return null;
    });

  return result;
};
