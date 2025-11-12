import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { GetSuklLimitsParams } from '../query/useSuklLimits';

export interface SuklLimitsResponse {
  payload: {
    surchargeLimit: number;
    surchargeReverseBalance: number;
    name?: string;
  } | null;
  state: string;
  messages?: Array<{
    severity: string;
    code: string;
    data: {
      description: string;
    };
  }>;
  error?: {
    status: number | string;
    message: string;
  };
}

export const getSuklLimits = async (
  queryParams: GetSuklLimitsParams,
): Promise<SuklLimitsResponse> => {
  const result = await axiosInstance
    .get(
      `integration-sukl/api/rest/v${API_VERSION}/sukl-cuer-data/${queryParams.insuranceNum}/surcharge-limit`,
    )
    .then((res) => {
      return res?.data || null;
    })
    .catch((error) => {
      return {
        state: 'Error',
        error: {
          status: error.status,
          message: error.response.data.message || error.response.data?.messages?.[0].code,
        },
        messages: [error.message],
        payload: null,
      };
    });

  return result;
};
