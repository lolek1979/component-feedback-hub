import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { AdminProcessDto } from './getAdminProcesses';
import { ADMIN_PROCESS_URL } from '.';

export interface AdminProcessCreateDto {
  agendaCode: string;
  insurancePayerNumber: string;
  recordFolderNumber: string;
}

export const postNewAdminProcess = async (
  data: AdminProcessCreateDto,
): Promise<AxiosResponse<AdminProcessDto | null>> => {
  return await axiosInstance.post(ADMIN_PROCESS_URL, data);
};
