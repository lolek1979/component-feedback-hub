import { useQuery } from '@tanstack/react-query';

import { getAdminProcessUsers } from './services/getAdminProcessUsers';

export const useAdminProcessUsers = () => {
  const query = useQuery({
    queryKey: ['adminProcessUsers'],
    queryFn: async () => {
      return getAdminProcessUsers();
    },
  });

  return { ...query };
};
