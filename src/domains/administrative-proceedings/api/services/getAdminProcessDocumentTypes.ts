import { axiosInstance } from '@/core/api/axiosInstance';

import { CodeListDto } from './getAdminProcesses';
import { ADMIN_PROCESS_DOCUMENT_TYPES_URL } from '.';

export type GetAdminProcessDocumentTypesResponse = CodeListDto[];

export const getAdminProcessDocumentTypes =
  async (): Promise<GetAdminProcessDocumentTypesResponse | null> => {
    return await axiosInstance
      .get(ADMIN_PROCESS_DOCUMENT_TYPES_URL)
      .then((res) => {
        return res.data as GetAdminProcessDocumentTypesResponse;
      })
      .catch(() => {
        return null;
      });
  };
