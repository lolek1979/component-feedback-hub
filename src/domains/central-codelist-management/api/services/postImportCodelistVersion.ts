import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

export interface PostImportCodelistVersionParams {
  id: string;
  name: string;
  description: string;
  validFrom: string;
  garants: string[];
  editors: string[];
  versionType: string;
  code?: string;
  uploadedFiles: { file: File; type: string }[];
}

export interface PostImportCodelistVersionResponse {
  draftId: string;
  codeListId: string;
}

export const postImportCodelistVersion = async (
  data: PostImportCodelistVersionParams,
): Promise<PostImportCodelistVersionResponse> => {
  const formData = new FormData();
  formData.append('Name', data.name);
  formData.append('Description', data.description);
  formData.append('ValidFrom', data.validFrom);
  formData.append('VersionType', data.versionType);
  if (data.code) formData.append('Code', data.code);
  data.garants.forEach((garant) => formData.append('Garants', garant));
  data.editors.forEach((editor) => formData.append('Editors', editor));
  data.uploadedFiles.forEach(({ file, type }) => {
    formData.append(type, file);
  });
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/codelists/${data.id}/drafts/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data as PostImportCodelistVersionResponse;
  } catch (error) {
    throw error;
  }
};
