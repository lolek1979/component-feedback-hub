import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { ComplaintCreateRequest, ComplaintResponse } from './types';

export const postComplaint = async (data: ComplaintCreateRequest): Promise<ComplaintResponse> => {
  const result = await axiosInstance
    .post(`integration-sukl/api/rest/v${API_VERSION}/Complaint`, data)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
