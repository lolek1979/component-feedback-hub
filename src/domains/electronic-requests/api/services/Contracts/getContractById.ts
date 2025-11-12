import { AdminContract } from '../types';
import { CONTRACT_URL } from '..';

import { axiosInstance } from '@/core';

export const getContractById = async (contractId: string): Promise<AdminContract> => {
  try {
    const response = await axiosInstance.get(`${CONTRACT_URL}/${contractId}`);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch contract with ID ${contractId}:`, error);

    throw error;
  }
};
