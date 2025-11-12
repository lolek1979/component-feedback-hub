import { useQuery } from '@tanstack/react-query';

import { getAdminProcessDocumentTypes } from './services/getAdminProcessDocumentTypes';

export const useAdminProcessDocumentTypes = () => {
  const query = useQuery({
    queryKey: ['adminProcessDocumentTypes'],
    queryFn: async () => {
      return getAdminProcessDocumentTypes();
    },
  });

  return { ...query };
};
