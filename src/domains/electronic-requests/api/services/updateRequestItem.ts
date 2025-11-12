import { axiosInstance } from '@/core/api/axiosInstance';

import { RequestItemUpdateModel, ResultMessage } from './types';
import { REQUEST_ITEM_URL } from '.';

export interface UpdateRequestItemResponse {
  payload: RequestItemUpdateModel;
  state: string;
  messages: ResultMessage[];
}

export const updateRequestItem = async (
  itemId: string,
  payload: RequestItemUpdateModel,
): Promise<UpdateRequestItemResponse> => {
  try {
    const response = await axiosInstance.put(`${REQUEST_ITEM_URL}/${itemId}`, payload);

    return response.data;
  } catch (error) {
    console.error('Error updating request item:', error);
    throw error;
  }
};

export const updateRequestItemQuantity = async (
  itemId: string,
  quantity: number,
  currentItem: RequestItemUpdateModel,
): Promise<UpdateRequestItemResponse> => {
  const payload: RequestItemUpdateModel = {
    manualItem: currentItem.manualItem,
    description: currentItem.description,
    quantity: quantity,
    justification: currentItem.justification,
    expectedDeliveryDate: currentItem.expectedDeliveryDate,
    attachments: currentItem.attachments,
  };

  return updateRequestItem(itemId, payload);
};
