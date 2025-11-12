import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { CodeListDto } from './types';

export const getProcessingStates = async (): Promise<CodeListDto[]> => {
  const result = await axiosInstance
    .get(`integration-sukl/api/rest/v${API_VERSION}/ProcessingState`)
    .then((res) => {
      return res?.data || [];
    })
    .catch((error) => {
      throw error;
    });

  return result;
};
