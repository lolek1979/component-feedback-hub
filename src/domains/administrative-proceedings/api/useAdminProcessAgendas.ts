import { useQuery } from '@tanstack/react-query';

import { getAdminProcessAgendas } from './services/getAdminProcessAgendas';

export const useAdminProcessAgendas = () => {
  const query = useQuery({
    queryKey: ['adminProcessAgendas'],
    queryFn: async () => {
      return getAdminProcessAgendas();
    },
  });

  return { ...query };
};
