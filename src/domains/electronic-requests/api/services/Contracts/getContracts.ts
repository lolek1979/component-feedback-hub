import { GetAdminContractResponse } from '../types';
import { CONTRACT_URL } from '..';

import { axiosInstance } from '@/core';

type GetContractsParams = {
  skip?: number;
  take?: number;
  fulltextSearch?: string;
};

export const getContracts = async (
  params: GetContractsParams,
): Promise<GetAdminContractResponse> => {
  try {
    const response = await axiosInstance.get(CONTRACT_URL, { params });

    return response.data as GetAdminContractResponse;
  } catch (error) {
    console.error('Error fetching admin requests', error);

    return {
      items: [],
      total: 0,
    };
  }
};
