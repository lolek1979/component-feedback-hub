import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { deleteRequest } from '@/domains/electronic-requests/api/services/deleteRequest';

export const useDeleteRequest = (options?: UseMutationOptions<void, Error, string>) => {
  return useMutation({
    mutationFn: async (requestId: string) => {
      await deleteRequest(requestId);
    },
    ...options,
  });
};
