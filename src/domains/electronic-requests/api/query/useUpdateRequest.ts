import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { RequestUpdateModel } from '../services/types';
import { updateRequest, UpdateRequestResponse } from '../services/updateRequest';

interface UseUpdateRequestOptions {
  onSuccess?: (
    data: UpdateRequestResponse,
    variables: { requestId: string; payload: RequestUpdateModel },
    context: unknown,
  ) => void;
  onError?: (error: AxiosError) => void;
}

interface MutationContext {
  previousRequest?: Request;
}

export const useUpdateRequest = (options: UseUpdateRequestOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRequestResponse,
    AxiosError,
    { requestId: string; payload: RequestUpdateModel },
    MutationContext
  >({
    mutationFn: ({ requestId, payload }) => updateRequest(requestId, payload),
    onMutate: async ({ requestId }) => {
      const previousRequest = queryClient.getQueryData<Request>(['request', requestId]);

      return { previousRequest };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['request'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: AxiosError) => {
      console.error('useUpdateRequest mutation error:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};
