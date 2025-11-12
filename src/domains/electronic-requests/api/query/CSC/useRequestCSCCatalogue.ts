import { useQuery } from '@tanstack/react-query';

import { getRequestCSCCatalogue } from '@/domains/electronic-requests/api/services/CSC/getRequestCSCCatalogue';

import { UseRequestCSCOptions } from '../../services/CSC/types';

interface UseRequestCSCCatalogueOptions extends UseRequestCSCOptions {
  favouriteOnly?: boolean;
}

export const useRequestCSCCatalogue = (options: UseRequestCSCCatalogueOptions = {}) => {
  const { favouriteOnly, skip, take, fulltextSearch, enabled = true } = options;

  return useQuery({
    queryKey: ['cscCatalogue', favouriteOnly, skip, take, fulltextSearch],
    queryFn: () => getRequestCSCCatalogue(favouriteOnly, skip, take, fulltextSearch),
    enabled: enabled && (fulltextSearch != null || favouriteOnly === true),
  });
};
