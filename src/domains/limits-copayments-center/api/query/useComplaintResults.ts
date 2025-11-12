import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getComplaintResults } from '../services/getComplaintResults';

const useComplaintResults = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: ['complaintResults'],
    queryFn: async () => {
      await ensureAccessToken(msalInstance);
      const result = await getComplaintResults();

      return result;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useComplaintResults;
