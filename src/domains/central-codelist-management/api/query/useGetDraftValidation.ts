import { useQuery } from '@tanstack/react-query';

import { getDraftValidation } from '../services';

export const useGetDraftValidation = (draftId: string | null) => {
  return useQuery({
    queryKey: ['draftValidation', draftId],
    queryFn: () => getDraftValidation(draftId!),
    enabled: !!draftId,
  });
};
