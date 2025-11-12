import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approveRequest } from '@/domain-central-codelist-management/api/services/approveRequest';

export const useApproveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => {
      return approveRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error('Failed to approve request:', error);
    },
  });
};
