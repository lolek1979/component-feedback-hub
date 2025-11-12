import { axiosInstance } from '@/core/api/axiosInstance';

import { CodeListDto } from './getAdminProcesses';
import { ADMIN_PROCESS_STATUSES_URL } from '.';

export type GetAdminProcessStatusesResponse = CodeListDto[];

export const getAdminProcessStatuses =
  async (): Promise<GetAdminProcessStatusesResponse | null> => {
    return await axiosInstance
      .get(ADMIN_PROCESS_STATUSES_URL)
      .then((res) => {
        return res.data as GetAdminProcessStatusesResponse;
      })
      .catch(() => {
        return null;
      });
  };
