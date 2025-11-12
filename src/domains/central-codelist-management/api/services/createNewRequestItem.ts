import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';
import { REQUESTS_BASE_URL } from '@/domain-electronic-requests/api/services';
import {
  GetRequesterRequestsResponse,
  RequestItemUpdateModel,
} from '@/domain-electronic-requests/api/services/types';

export const createNewRequestItem = async (
  requestId: string,
  data: RequestItemUpdateModel[],
): Promise<AxiosResponse<GetRequesterRequestsResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}/${requestId}/Items`, data);
};
