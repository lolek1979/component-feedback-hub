import { useQuery } from '@tanstack/react-query';

import { getRequestCSCCategories } from '@/domains/electronic-requests/api/services/CSC/getRequestCSCCategories';

import { UseRequestCSCOptions } from '../../services/CSC/types';

export const useRequestCSCCategories = (options: UseRequestCSCOptions = {}) => {
  const { skip, take, fulltextSearch, enabled = true } = options;

  return useQuery({
    queryKey: ['cscCategories', skip, take, fulltextSearch],
    queryFn: () => getRequestCSCCategories(skip, take, fulltextSearch),
    enabled: enabled,
  });
};
