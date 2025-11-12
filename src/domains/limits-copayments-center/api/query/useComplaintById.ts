import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getComplaintById } from '../services/getComplaintById';

const useComplaintById = (complaintId: string | null) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: ['complaint', complaintId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      if (!id) throw new Error('Missing complaint ID');

      await ensureAccessToken(msalInstance);
      const result = await getComplaintById(id);

      return result;
    },
    enabled: !!complaintId && isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useComplaintById;
