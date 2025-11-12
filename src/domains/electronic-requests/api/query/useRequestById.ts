import { useQuery } from '@tanstack/react-query';

import { getRequestById } from '@/domains/electronic-requests/api/services/getRequestById';

interface UseRequestByIdOptions {
  id: string;
  enabled?: boolean;
}

export const useRequestById = (options: UseRequestByIdOptions) => {
  const { id, enabled = true } = options;

  return useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequestById(id),
    enabled: enabled && !!id,
  });
};
