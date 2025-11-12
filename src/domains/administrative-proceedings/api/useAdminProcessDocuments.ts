import { useQuery } from '@tanstack/react-query';

import { getAdminProcessDocuments } from './services/getAdminProcessDocuments';

export const useAdminProcessDocuments = (adminProcessId: string) => {
  const query = useQuery({
    queryKey: ['adminProcessDocuments', adminProcessId],
    queryFn: async () => {
      return getAdminProcessDocuments(adminProcessId);
    },
    enabled: !!adminProcessId,
  });

  return { ...query };
};
