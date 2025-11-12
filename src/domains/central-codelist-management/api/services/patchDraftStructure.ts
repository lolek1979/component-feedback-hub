import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface ValidationParameter {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}

interface Validation {
  validatorType: string;
  parameters: ValidationParameter[];
}

export interface Field {
  index: number;
  length: number;
  name: string;
  code: string;
  description: string;
  valueType: string;
  valueFormat: string;
  validations: Validation[];
  default: string;
}

export interface PatchDraftStructureData {
  version: string;
  name: string;
  fields: Field[];
}

interface PostNewCodeListResponse {
  draftId: string;
  codeListId: string;
}

export const patchDraftStructure = async (
  draftId: string,
  data: PatchDraftStructureData,
): Promise<PostNewCodeListResponse | null> => {
  try {
    const response = await axiosInstance.patch(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/structure`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as PostNewCodeListResponse;
  } catch (error) {
    console.error('Error Patching new code list:', error);

    return null;
  }
};
