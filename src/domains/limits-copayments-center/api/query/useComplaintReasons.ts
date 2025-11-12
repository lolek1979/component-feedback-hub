import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getComplaintReasons } from '../services/getComplaintReasons';

const useComplaintReasons = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: ['complaintReasons'],
    queryFn: async () => {
      await ensureAccessToken(msalInstance);
      const result = await getComplaintReasons();

      return result;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useComplaintReasons;
