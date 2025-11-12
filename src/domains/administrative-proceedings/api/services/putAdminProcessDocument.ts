import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_DOCUMENTS_URL } from '.';

export interface PutAdminProcessDocumentParams {
  id: string;
  documentTypeCode: string;
}

export interface ProblemDetailsResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}

export const putAdminProcessDocument = async ({
  id,
  documentTypeCode,
}: PutAdminProcessDocumentParams): Promise<void> => {
  const payload = {
    documentTypeCode,
  };

  try {
    await axiosInstance.put(`${ADMIN_PROCESS_DOCUMENTS_URL}/${id}`, payload);

    return;
  } catch (error: any) {
    if (error.response) {
      const err: ProblemDetailsResponse = error.response.data;
      throw err;
    }
    throw error;
  }
};
