import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { GetRequesterRequestsResponse, RequestUpdateModel } from './types';
import { REQUESTS_BASE_URL } from '.';

export const createNewRequest = async (
  data: RequestUpdateModel,
): Promise<AxiosResponse<GetRequesterRequestsResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}`, data);
};
