import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { GetRequesterRequestsResponse, RequestItemUpdateModel } from './types';
import { REQUESTS_BASE_URL } from '.';

export interface RequestItemCreateDTO extends RequestItemUpdateModel {}

export const createNewRequestItem = async (
  requestId: string,
  data: RequestItemCreateDTO[],
): Promise<AxiosResponse<GetRequesterRequestsResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}/${requestId}/Items`, data);
};
