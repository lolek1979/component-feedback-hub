import { AxiosResponse } from 'axios';

import { REQUESTS_BASE_URL } from '@/domain-electronic-requests/api/services';
import { ReturnRequestResponse } from '@/domain-electronic-requests/api/services/types';

import { axiosInstance } from '@/core';

export interface UpdateItemStateDTO {
  itemIds: string[];
  newState: string;
  reason: string;
}

export const updateItemState = async (
  data: UpdateItemStateDTO,
): Promise<AxiosResponse<ReturnRequestResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}/ApproverWorkflow/UpdateItemState`, data);
};
