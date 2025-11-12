import { useMutation } from '@tanstack/react-query';

import { returnRequest } from '@/domain-central-codelist-management/api/services/returnRequest';

import { ReturnRequestBody, ReturnRequestResponse } from '../services/types';

export function useReturnRequest() {
  return useMutation<ReturnRequestResponse, Error, { requestId: string; body: ReturnRequestBody }>({
    mutationFn: ({ requestId, body }) => returnRequest(requestId, body),
  });
}
