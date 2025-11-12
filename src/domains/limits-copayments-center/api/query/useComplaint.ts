import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { getComplaint } from '../services/getComplaint';
import { GetComplaintParams } from '../services/types';

const useComplaint = (params?: GetComplaintParams) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: params ? ['complaint', params] : ['complaint'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetComplaintParams | undefined];

      await ensureAccessToken(msalInstance);
      const result = await getComplaint(queryParams);

      return result;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useComplaint;
