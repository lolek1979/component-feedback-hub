import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getSuklData } from '../services/getSuklData';

export type GetSuklDataParams = {
  insuranceNum: string;
  year?: number;
  month?: number | null;
  searchFilter?: string;
  limit?: number;
  skip?: number;
};

const useSuklData = (params: GetSuklDataParams | null) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: params ? ['suklData', params] : ['suklData'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetSuklDataParams];
      if (!queryParams) throw new Error('Missing parameters');

      await ensureAccessToken(msalInstance);

      const requestParams = {
        ...queryParams,
        limit: queryParams.limit,
        skip: queryParams.skip,
      };

      const result = await getSuklData(requestParams);

      return result;
    },
    enabled: !!params && isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useSuklData;
