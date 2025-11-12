import { axiosInstance } from '@/core/api/axiosInstance';

import { UserDto } from './getAdminProcesses';
import { ADMIN_PROCESS_USERS_URL } from '.';

export type GetAdminProcessUsersResponse = UserDto[];

export const getAdminProcessUsers = async (): Promise<GetAdminProcessUsersResponse | null> => {
  return await axiosInstance
    .get(ADMIN_PROCESS_USERS_URL)
    .then((res) => {
      return res.data as GetAdminProcessUsersResponse;
    })
    .catch(() => {
      return null;
    });
};
