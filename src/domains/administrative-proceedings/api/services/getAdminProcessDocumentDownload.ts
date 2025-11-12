import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_DOCUMENTS_URL } from '.';

export const getAdminProcessDocumentDownload = async (id: string): Promise<string> => {
  if (!id) {
    throw new Error('Document ID is required');
  }

  const response = await axiosInstance.get<string>(`${ADMIN_PROCESS_DOCUMENTS_URL}/${id}/download`);

  return response.data;
};
