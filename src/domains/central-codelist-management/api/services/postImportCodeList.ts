import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface validationErrors {
  field: string;
  errors: string[];
}

interface importMessages {
  severity: string;
  code: string | null;
  data: {
    description: string;
  };
}

export interface PostImportCodeListParams {
  codeListId: string | null;
  name: string;
  code: string | null;
  description: string;
  validFrom: string;
  garants: string[];
  editors: string[];
  versionType: string;
  uploadedFiles: { file: File; type: string }[];
}

export interface PostImportCodeListResponse {
  draftId: string;
  codeListId: string;
  payload: {
    validationErrors: validationErrors[];
  };
  state: string;
  messages: importMessages[];
}

export const postImportCodeList = async (
  data: PostImportCodeListParams,
): Promise<PostImportCodeListResponse | null> => {
  const formData = new FormData();
  formData.append('CodeListId', data.codeListId || '');
  formData.append('Name', data.name);
  formData.append('Description', data.description);
  data.garants.forEach((garant) => formData.append('Garants', garant));
  data.editors.forEach((editor) => formData.append('Editors', editor));
  formData.append('ValidFrom', data.validFrom);
  formData.append('VersionType', data.versionType);

  data.uploadedFiles.forEach(({ file, type }) => {
    formData.append(type, file);
  });

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/codelists/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data as PostImportCodeListResponse;
  } catch (error: unknown) {
    throw error;
  }
};
