import { AxiosResponse } from 'axios';

import { REQUEST_ITEM_URL } from '@/domain-electronic-requests/api/services';
import { GetRequestItemResponse } from '@/domain-electronic-requests/api/services/types';

import { axiosInstance } from '@/core';

export const getRequestItemById = async (
  itemId: string,
): Promise<AxiosResponse<GetRequestItemResponse>> => {
  return await axiosInstance.get(`${REQUEST_ITEM_URL}/${itemId}`);
};
