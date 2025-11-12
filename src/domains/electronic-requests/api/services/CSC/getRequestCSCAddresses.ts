import { axiosInstance } from '@/core/api/axiosInstance';

import { REQUEST_CSC_ADDRESSES_URL } from './index';
import { GetRequestCSCAddressesResponse } from './types';

export const getRequestCSCAddresses = async (
  skip?: number | null,
  take?: number | null,
  fulltextSearch?: string | null,
): Promise<GetRequestCSCAddressesResponse | null> => {
  const params: Record<string, string | number | null> = {
    skip: skip ?? null,
    take: take ?? null,
    fulltextSearch: fulltextSearch ?? null,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = REQUEST_CSC_ADDRESSES_URL + (queryString ? '?' + queryString : '');

  const response = await axiosInstance.get(url);

  return response.data as GetRequestCSCAddressesResponse;
};
