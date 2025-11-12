import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import {
  GetRequesterRequestsResponse,
  RequestItemUpdateModel,
} from '@/domains/electronic-requests/api/services/types';

import { createNewRequestItem } from '../services/postNewRequestItem';

interface UseRequestItemOptions {
  onSuccess?: (
    data: AxiosResponse<GetRequesterRequestsResponse>,
    variables: { requestId: string; items: RequestItemUpdateModel[] },
    context: unknown,
  ) => void;
  onError?: (error: AxiosError) => void;
}

export const useRequestItem = (options: UseRequestItemOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, items }: { requestId: string; items: RequestItemUpdateModel[] }) => {
      if (!items || items.length === 0) {
        throw new Error('Items array cannot be empty');
      }

      const formattedItems = items.map((item) => ({
        ...item,
        expectedDeliveryDate: item.expectedDeliveryDate.includes('T')
          ? item.expectedDeliveryDate.split('T')[0]
          : item.expectedDeliveryDate,
      }));

      return createNewRequestItem(requestId, formattedItems);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: AxiosError) => {
      console.error('useRequestItem mutation error:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};
