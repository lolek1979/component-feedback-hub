import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { ComplaintResponse, GetComplaintParams } from './types';

export const getComplaint = async (params?: GetComplaintParams): Promise<ComplaintResponse[]> => {
  const result = await axiosInstance
    .get(`integration-sukl/api/rest/v${API_VERSION}/Complaint`, {
      params,
    })
    .then((res) => {
      return res?.data || [];
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
