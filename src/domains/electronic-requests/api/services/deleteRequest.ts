import { axiosInstance } from '@/core/api/axiosInstance';

import { REQUESTS_BASE_URL } from '.';

interface DeleteRequestResponse {
  status: 'Success' | 'Error';
  messages: [];
}

export const deleteRequest = async (requestId: string): Promise<DeleteRequestResponse | null> => {
  try {
    const response = await axiosInstance.delete(`${REQUESTS_BASE_URL}/${requestId}`);

    return response.data as DeleteRequestResponse;
  } catch (error) {
    console.error('Error deleting request:', error);

    return null;
  }
};
