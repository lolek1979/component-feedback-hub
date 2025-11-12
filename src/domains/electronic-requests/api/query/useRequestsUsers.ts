import { useQuery } from '@tanstack/react-query';

import { getRequestsUsers } from '@/domains/electronic-requests/api/services/getRequestsUsers';
import { GetImpersonateUsersResponse } from '@/domains/electronic-requests/api/services/types';

interface UseRequestsUsersOptions {
  enabled?: boolean;
}

export const useRequestsUsers = (options: UseRequestsUsersOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<GetImpersonateUsersResponse | null>({
    queryKey: ['requestsUsers'],
    queryFn: () => getRequestsUsers(),
    enabled,
  });
};
