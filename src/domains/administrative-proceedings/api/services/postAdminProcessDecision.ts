import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_DECISIONS_URL } from '.';

export interface DecisionCreateDto {
  adminProcessId?: string;
  reasoning?: string | null;
  dateDecision?: string | null;
  amount?: number | null;
  decisionTypeCode: string | null;
}

export const postAdminProcessDecision = async (dto: DecisionCreateDto): Promise<void> => {
  try {
    const response = await axiosInstance.post(ADMIN_PROCESS_DECISIONS_URL, dto);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
