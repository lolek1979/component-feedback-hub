import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { DEBUG_IMPERSONATE_URL } from '..';

export const clearImpersonation = async (): Promise<AxiosResponse<void>> => {
  try {
    const response = await axiosInstance.post(`${DEBUG_IMPERSONATE_URL}/clear`);

    return response;
  } catch (error) {
    console.error('Error clearing impersonation:', error);
    throw error;
  }
};
