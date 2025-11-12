import { axiosInstance } from '@/core/api/axiosInstance';

import { REQUEST_CSC_USERS_URL } from './index';
import { GetRequestCSCUsersResponse } from './types';

export const getRequestCSCUsers = async (
  skip?: number | null,
  take?: number | null,
  fulltextSearch?: string | null,
): Promise<GetRequestCSCUsersResponse | null> => {
  const params: Record<string, string | number | null> = {
    skip: skip ?? null,
    take: take ?? null,
    fulltextSearch: fulltextSearch ?? null,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = REQUEST_CSC_USERS_URL + (queryString ? '?' + queryString : '');

  return await axiosInstance
    .get(url)
    .then((res) => {
      return res.data as GetRequestCSCUsersResponse;
    })
    .catch(() => {
      return null;
    });
};
