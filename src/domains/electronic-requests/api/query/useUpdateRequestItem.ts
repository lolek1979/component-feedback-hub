import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  updateRequestItem,
  updateRequestItemQuantity,
  UpdateRequestItemResponse,
} from '@/domains/electronic-requests/api/services/updateRequestItem';

import { RequestItemUpdateModel } from '../services/types';

interface UseUpdateRequestItemOptions {
  onSuccess?: (
    data: UpdateRequestItemResponse,
    variables:
      | { itemId: string; payload: RequestItemUpdateModel }
      | { itemId: string; quantity: number; currentItem: RequestItemUpdateModel },
    context: unknown,
  ) => void;
  onError?: (error: AxiosError) => void;
}

export const useUpdateRequestItem = (options: UseUpdateRequestItemOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: RequestItemUpdateModel }) =>
      updateRequestItem(itemId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: AxiosError) => {
      console.error('useUpdateRequestItem mutation error:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};

export const useUpdateRequestItemQuantity = (options: UseUpdateRequestItemOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
      currentItem,
    }: {
      itemId: string;
      quantity: number;
      currentItem: RequestItemUpdateModel;
    }) => updateRequestItemQuantity(itemId, quantity, currentItem),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: AxiosError) => {
      console.error('useUpdateRequestItemQuantity mutation error:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};
