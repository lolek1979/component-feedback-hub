import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getSuklLimits } from '../services/getSuklLimits';

export type GetSuklLimitsParams = {
  insuranceNum: string;
};

const useSuklLimits = (params: GetSuklLimitsParams | null) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: params ? ['suklLimits', params] : ['suklLimits'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetSuklLimitsParams];
      if (!queryParams) throw new Error('Missing parameters');

      await ensureAccessToken(msalInstance);

      return getSuklLimits(queryParams);
    },
    enabled: !!params && isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useSuklLimits;
