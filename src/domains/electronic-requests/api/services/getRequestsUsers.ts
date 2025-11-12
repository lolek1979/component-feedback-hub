import { axiosInstance } from '@/core/api/axiosInstance';

import { GetImpersonateUsersResponse } from './types';
import { REQUEST_USERS_URL } from './';

export const getRequestsUsers = async (): Promise<GetImpersonateUsersResponse | null> => {
  try {
    const res = await axiosInstance.get(REQUEST_USERS_URL);

    return res.data as GetImpersonateUsersResponse;
  } catch (error) {
    console.error('Error fetching impersonate users:', error);

    return null;
  }
};
