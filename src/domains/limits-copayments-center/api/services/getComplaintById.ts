import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { ComplaintResponse } from './types';

export const getComplaintById = async (complaintId: string): Promise<ComplaintResponse> => {
  const result = await axiosInstance
    .get(`integration-sukl/api/rest/v${API_VERSION}/Complaint/${complaintId}`)
    .then((res) => {
      return res?.data || null;
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
