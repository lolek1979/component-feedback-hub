import { axiosInstance } from '@/core/api/axiosInstance';

import { REQUEST_CSC_CATALOGUE_URL } from './index';
import { GetRequestCSCCatalogueResponse } from './types';

export const getRequestCSCCatalogue = async (
  favouriteOnly?: boolean,
  skip?: number | null,
  take?: number | null,
  fulltextSearch?: string | null,
): Promise<GetRequestCSCCatalogueResponse | null> => {
  const params: Record<string, string | number | boolean | null> = {
    favouriteOnly: favouriteOnly ?? null,
    skip: skip ?? null,
    take: take ?? null,
    fulltextSearch: fulltextSearch ?? null,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = REQUEST_CSC_CATALOGUE_URL + (queryString ? '?' + queryString : '');

  return await axiosInstance
    .get(url)
    .then((res) => {
      return res.data as GetRequestCSCCatalogueResponse;
    })
    .catch(() => {
      return null;
    });
};
