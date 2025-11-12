import { useQuery } from '@tanstack/react-query';

import { getRequestCSCAddresses } from '@/domains/electronic-requests/api/services/CSC/getRequestCSCAddresses';

import { UseRequestCSCOptions } from '../../services/CSC/types';

export const useRequestCSCAddresses = (options: UseRequestCSCOptions = {}) => {
  const { skip, take, fulltextSearch, enabled = true } = options;

  return useQuery({
    queryKey: ['cscAddresses', skip, take, fulltextSearch],
    queryFn: () => getRequestCSCAddresses(skip, take, fulltextSearch),
    enabled,
  });
};
