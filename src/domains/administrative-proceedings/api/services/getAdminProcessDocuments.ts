import { axiosInstance } from '@/core/api/axiosInstance';

import { CodeListDto } from './getAdminProcesses';
import { ADMIN_PROCESS_DOCUMENTS_URL } from '.';

export type AdminProcessDocument = {
  fileName: string;
  name: string;
  documentType: null | CodeListDto;
  id: string;
};

export const getAdminProcessDocuments = async (
  adminProcessId: string,
): Promise<AdminProcessDocument[]> => {
  if (!adminProcessId) {
    throw new Error('Admin process ID is required');
  }

  const response = await axiosInstance.get<AdminProcessDocument[]>(
    `${ADMIN_PROCESS_DOCUMENTS_URL}?adminProcessId=${adminProcessId}`,
  );

  return response.data;
};
