import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { ComplaintResponse, ComplaintUpdateRequest } from './types';

export const putComplaint = async (data: ComplaintUpdateRequest): Promise<ComplaintResponse> => {
  const result = await axiosInstance
    .put(`integration-sukl/api/rest/v${API_VERSION}/Complaint`, data)
    .then((res) => {
      return res?.data;
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
