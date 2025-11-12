import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';
import { GetCodelistsByIdParams } from '@/domains/central-codelist-management/api/query/useCodeListById';

export interface Message {
  severity: string;
  code: string;
  data: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}

export interface Field {
  code: string | null;
  name: string;
  index: number;
  length: number;
  default: string;
  valueType: number;
  description: string;
  validations: undefined[];
}

export interface Structure {
  name: string;
  fields: Field[];
}
export interface Users {
  id: string;
  abbrev: string;
  fullName: string;
  mail: string;
  department: string;
  businessPhones: string[];
}

export interface Content {
  data: string[][];
  structure: Structure;
}

export interface Payload {
  id: string;
  codeListId: string;
  name: string;
  code: string;
  description: string;
  validFrom: string;
  garants: Users[];
  editors: Users[];
  content: Content;
  versionType: string;
}

export interface CodeListByIdResponse {
  state: 'Success' | 'Error';
  messages: Message[];
  payload: Payload;
}

export const getCodeListsById = async (
  params: GetCodelistsByIdParams,
): Promise<CodeListByIdResponse | null> => {
  const queryParams = {
    ...(params.time && { time: params.time }),
    ...(params.id && { id: params.id }),
  };
  const result = await axiosInstance
    .get(`codelists/api/rest/v${API_VERSION}/codelists/versions/${params.id}`, {
      params: queryParams.time,
    })
    .then((res) => {
      return res.data as CodeListByIdResponse;
    })
    .catch(() => {
      return null;
    });

  return result;
};
