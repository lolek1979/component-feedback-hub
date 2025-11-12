import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getProcessingStates } from '../services/getProcessingStates';

const useProcessingStates = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: ['processingStates'],
    queryFn: async () => {
      await ensureAccessToken(msalInstance);
      const result = await getProcessingStates();

      return result;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useProcessingStates;
