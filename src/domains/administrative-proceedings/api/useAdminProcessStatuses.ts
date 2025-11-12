import { useQuery } from '@tanstack/react-query';

import { getAdminProcessStatuses } from './services/getAdminProcessStatuses';

export const useAdminProcessStatuses = () => {
  const query = useQuery({
    queryKey: ['adminProcessStatuses'],
    queryFn: async () => {
      return getAdminProcessStatuses();
    },
  });

  return { ...query };
};
