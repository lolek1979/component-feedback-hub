import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_AGENDAS_URL } from '.';

export interface CodeListDto {
  code: string;
  name: string;
}

export type GetAdminProcessAgendasResponse = CodeListDto[];

export const getAdminProcessAgendas = async (): Promise<GetAdminProcessAgendasResponse | null> => {
  return await axiosInstance
    .get(ADMIN_PROCESS_AGENDAS_URL)
    .then((res) => {
      return res.data as GetAdminProcessAgendasResponse;
    })
    .catch(() => {
      return null;
    });
};
