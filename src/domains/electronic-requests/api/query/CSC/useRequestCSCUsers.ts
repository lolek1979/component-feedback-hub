import { useQuery } from '@tanstack/react-query';

import { getRequestCSCUsers } from '@/domains/electronic-requests/api/services/CSC/getRequestCSCUsers';

import { UseRequestCSCOptions } from '../../services/CSC/types';

export const useRequestCSCUsers = (options: UseRequestCSCOptions = {}) => {
  const { skip, take, fulltextSearch, enabled = true } = options;

  return useQuery({
    queryKey: ['cscUsers', skip, take, fulltextSearch],
    queryFn: () => getRequestCSCUsers(skip, take, fulltextSearch),
    enabled,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};
