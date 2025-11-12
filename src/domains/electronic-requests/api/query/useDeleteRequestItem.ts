import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRequestItem } from '@/domains/electronic-requests/api/services/deleteRequestItem';

interface UseDeleteRequestItemOptions {
  onSuccess?: (data?: any, variables?: any, context?: any) => void;
  onError?: (error: unknown) => void;
}

export const useDeleteRequestItem = (options: UseDeleteRequestItemOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteRequestItem(itemId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error) => {
      console.error('useDeleteRequestItem mutation error:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};
