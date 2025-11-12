import { REQUESTS_BASE_URL } from '@/domain-electronic-requests/api/services';
import {
  ReturnRequestBody,
  ReturnRequestResponse,
} from '@/domain-electronic-requests/api/services/types';

import { axiosInstance } from '@/core';

export const returnRequest = async (
  requestId: string,
  body: ReturnRequestBody,
): Promise<ReturnRequestResponse> => {
  const response = await axiosInstance.post(
    `${REQUESTS_BASE_URL}/${requestId}/ApproverWorkflow/Return`,
    body,
  );

  return response.data;
};
