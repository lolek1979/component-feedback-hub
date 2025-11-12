import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getInsuredDetail } from '../services/getInsuredDetail';

const useInsuredDetail = (insuredId: string | null) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: insuredId ? ['insuredDetail', insuredId] : ['insuredDetail'],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      if (!id) throw new Error('Missing insuredId');

      await ensureAccessToken(msalInstance);

      const result = await getInsuredDetail(id);

      return result;
    },
    enabled: !!insuredId && isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useInsuredDetail;
