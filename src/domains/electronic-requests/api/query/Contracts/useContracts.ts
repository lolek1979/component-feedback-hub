import { useQuery } from '@tanstack/react-query';

import { getContracts } from '../../services/Contracts/getContracts';

type UseContractsOptions = {
  skip?: number;
  take?: number;
  fulltextSearch?: string;
  enabled?: boolean;
};

export const useContracts = (options: UseContractsOptions) => {
  const { enabled = true, ...params } = options;

  return useQuery({
    queryKey: ['contract', params.skip, params.take, params.fulltextSearch],
    queryFn: () => getContracts(params),
    enabled,
  });
};
