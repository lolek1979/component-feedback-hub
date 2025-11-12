import { API_VERSION, axiosInstance } from '@/core/api';

import { getDataVSParams } from '../query/useDataVS';

/**
 * Response type for the `getDataVS` function.
 * An array of strings representing data values.
 */
export type getDataVSResponse = string[];

/**
 * Fetches variable symbols (VS) data from the backend API.
 *
 * @param params - Query parameters used to filter the data.
 * @returns A Promise that resolves to an array of strings.
 */
export const getDataVS = async (params: getDataVSParams): Promise<getDataVSResponse> => {
  try {
    const { data } = await axiosInstance.get<getDataVSResponse>(
      `/cdg-qr/api/v${API_VERSION}/VS/DataVSzUP`,
      { params },
    );

    return data;
  } catch (error) {
    console.error('Failed to fetch DataVS:', error);
    throw error;
  }
};
