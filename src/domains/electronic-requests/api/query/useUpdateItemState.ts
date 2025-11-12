import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateItemState,
  UpdateItemStateDTO,
} from '@/domain-central-codelist-management/api/services/updateItemState';

export const useUpdateItemState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemStateDTO) => updateItemState(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error('Error updating item state:', error);
    },
  });
};
