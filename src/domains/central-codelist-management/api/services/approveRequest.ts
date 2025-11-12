import { AxiosResponse } from 'axios';

import { REQUESTS_BASE_URL } from '@/domain-electronic-requests/api/services';
import { GetRequestCSCAddressesResponse } from '@/domain-electronic-requests/api/services/CSC/types';

import { axiosInstance } from '@/core';

export const approveRequest = async (
  requestId: string,
): Promise<AxiosResponse<GetRequestCSCAddressesResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}/${requestId}/ApproverWorkflow/Confirm`);
};
