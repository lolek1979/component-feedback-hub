import { axiosInstance } from '@/core/api/axiosInstance';

import { ResultMessage } from './types';
import { REQUEST_ITEM_URL } from '.';

interface DeleteRequestItemResponse {
  status: 'Success' | 'Error';
  messages: ResultMessage[];
}

export const deleteRequestItem = async (
  itemId: string,
): Promise<DeleteRequestItemResponse | null> => {
  try {
    const response = await axiosInstance.delete(`${REQUEST_ITEM_URL}/${itemId}`);

    return response.data as DeleteRequestItemResponse;
  } catch (error) {
    console.error('Error deleting request item:', error);

    return null;
  }
};
