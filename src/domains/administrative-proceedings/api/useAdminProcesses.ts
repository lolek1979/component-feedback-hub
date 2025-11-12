import { useQuery } from '@tanstack/react-query';

import { getAdminProcesses } from './services/getAdminProcesses';

export const useAdminProcesses = (
  fullText: string | null,
  responsibleUserId: string | null,
  adminProcessStatusCode: string | null,
) => {
  const query = useQuery({
    queryKey: ['adminProcesses', fullText, adminProcessStatusCode, responsibleUserId],
    queryFn: async () => {
      return getAdminProcesses(fullText, responsibleUserId, adminProcessStatusCode);
    },
  });

  return { ...query };
};
