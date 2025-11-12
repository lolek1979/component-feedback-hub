import { useQuery } from '@tanstack/react-query';

import { getAdminProcessById } from './services/getAdminProcessById';

export const useAdminProcessById = (id: string) => {
  const query = useQuery({
    queryKey: ['adminProcess', id],
    queryFn: async () => {
      return getAdminProcessById({ id });
    },
    enabled: !!id,
  });

  return { ...query };
};
