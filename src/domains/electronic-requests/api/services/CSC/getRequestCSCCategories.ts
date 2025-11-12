import { axiosInstance } from '@/core/api/axiosInstance';

import { REQUEST_CSC_CATEGORIES_URL } from './index';
import { GetRequestCSCCategoriesResponse } from './types';

export const getRequestCSCCategories = async (
  skip?: number | null,
  take?: number | null,
  fulltextSearch?: string | null,
): Promise<GetRequestCSCCategoriesResponse | null> => {
  const params: Record<string, string | number | null> = {
    skip: skip ?? null,
    take: take ?? null,
    fulltextSearch: fulltextSearch ?? null,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = REQUEST_CSC_CATEGORIES_URL + (queryString ? '?' + queryString : '');

  return await axiosInstance
    .get(url)
    .then((res) => {
      return res.data as GetRequestCSCCategoriesResponse;
    })
    .catch(() => {
      return null;
    });
};
