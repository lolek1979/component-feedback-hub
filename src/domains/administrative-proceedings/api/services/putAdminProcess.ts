import { axiosInstance } from '@/core/api/axiosInstance';

import { AdminProcessDto } from './getAdminProcesses';
import { ADMIN_PROCESS_URL } from '.';

export interface PutAdminProcessParams {
  id: string;
  note: string;
  highAttention?: boolean;
}

export interface PutAdminProcessErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}

export const putAdminProcess = async ({
  id,
  note,
  highAttention = false,
}: PutAdminProcessParams): Promise<AdminProcessDto> => {
  const payload = {
    note,
    highAttention: !!highAttention,
  };

  try {
    const response = await axiosInstance.put(`${ADMIN_PROCESS_URL}/${id}`, payload);

    if (response.status === 200) {
      return response.data;
    }

    if (response.status === 404) {
      throw new Error('Admin process not found');
    }

    throw new Error('Unexpected response status');
  } catch (error: any) {
    if (error.response) {
      const err: PutAdminProcessErrorResponse = error.response.data;
      throw err;
    }
    throw error;
  }
};
