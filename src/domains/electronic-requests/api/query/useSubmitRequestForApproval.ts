import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { submitRequestForApproval } from '@/domains/electronic-requests/api/services/submitRequestForApproval';

export const useSubmitRequestForApproval = (options?: UseMutationOptions<any, Error, string>) => {
  return useMutation({
    mutationFn: (id: string) => submitRequestForApproval(id),
    ...options,
  });
};
