import { axiosInstance } from '@/core/api/axiosInstance';
import { AdminProcessActionTypeCode } from '@/core/lib/definitions';

import { ADMIN_PROCESS_URL } from '.';

export interface PostAdminProcessActionParams {
  id: string;
  actionTypeCode: AdminProcessActionTypeCode;
}

export const postAdminProcessAction = async ({
  id,
  actionTypeCode,
}: PostAdminProcessActionParams): Promise<void> => {
  const payload = {
    actionTypeCode,
  };

  try {
    const response = await axiosInstance.post(`${ADMIN_PROCESS_URL}/${id}/actions`, payload);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
