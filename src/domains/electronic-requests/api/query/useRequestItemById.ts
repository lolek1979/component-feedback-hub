import { useQuery } from '@tanstack/react-query';

import { getRequestItemById } from '@/domain-central-codelist-management/api/services/getRequestItemById';

interface UseRequestItemByIdOptions {
  id: string;
}

export const useRequestItemById = ({ id }: UseRequestItemByIdOptions) => {
  return useQuery({
    queryKey: ['requestItem', id],
    queryFn: () => getRequestItemById(id),
    enabled: !!id,
  });
};
