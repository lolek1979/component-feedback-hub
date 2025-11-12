import { useQuery } from '@tanstack/react-query';

import { DraftsByIdResponse, getDraftsById } from '../services/getDraftsById';

export type GetDraftsByIdParams = {
  id: string;
  isConcept: boolean;
};

const useCodeListsById = (params: GetDraftsByIdParams | null) => {
  const query = useQuery<DraftsByIdResponse>({
    enabled: !!params && !!params.id && params.isConcept,
    queryKey: params ? ['codeLists', params] : ['codeLists'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetDraftsByIdParams];

      const response = await getDraftsById(queryParams);
      if (!response) {
        throw new Error('No data found');
      }

      return response;
    },
  });

  return { ...query };
};

export default useCodeListsById;
