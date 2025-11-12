import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { CodeListDto } from './types';

export const getComplaintReasons = async (): Promise<CodeListDto[]> => {
  const result = await axiosInstance
    .get(`integration-sukl/api/rest/v${API_VERSION}/ComplaintReason`)
    .then((res) => {
      return res?.data || [];
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
