import { useQuery } from '@tanstack/react-query';

import { AllDraftsInCodelistResponse, getAllDraftsInCodelist } from '../services';

export type GetAllDraftsInCodelistParams = {
  id: string;
};

const useAllDraftsInCodelist = (params: GetAllDraftsInCodelistParams | null) => {
  const query = useQuery<AllDraftsInCodelistResponse>({
    queryKey: params ? ['id', params] : ['id'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetAllDraftsInCodelistParams];

      const response = await getAllDraftsInCodelist(queryParams);
      if (!response) {
        throw new Error('No data found');
      }

      return response;
    },
  });

  return { ...query };
};

export default useAllDraftsInCodelist;
