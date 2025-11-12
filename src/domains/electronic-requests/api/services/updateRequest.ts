import { RequestDetailModel, RequestUpdateModel, ResultMessage } from './types';
import { REQUESTS_BASE_URL } from '.';

import { axiosInstance } from '@/core';

export interface UpdateRequestResponse {
  payload: RequestDetailModel;
  success: boolean;
  message: ResultMessage[];
}

export const updateRequest = async (
  requestId: string,
  payload: RequestUpdateModel,
): Promise<UpdateRequestResponse> => {
  try {
    const response = await axiosInstance.put(`${REQUESTS_BASE_URL}/${requestId}`, payload);

    return {
      payload: response.data,
      success: true,
      message: [],
    };
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};
