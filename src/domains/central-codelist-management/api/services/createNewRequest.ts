import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';
import { REQUESTS_BASE_URL } from '@/domain-electronic-requests/api/services';
import { GetRequesterRequestsResponse } from '@/domain-electronic-requests/api/services/types';

export interface RequestCreateDTO {
  recipientId: string;
  description: string;
  justification: string;
  deliveryAddress: string;
}

export const createNewRequest = async (
  data: RequestCreateDTO,
): Promise<AxiosResponse<GetRequesterRequestsResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}`, data);
};
