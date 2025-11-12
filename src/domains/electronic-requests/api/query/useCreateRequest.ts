import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNewRequest } from '../services';
import { RequestUpdateModel } from '../services/types';

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestUpdateModel) => {
      return createNewRequest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error('Failed to create new request:', error);
    },
  });
};
