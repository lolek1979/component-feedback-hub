import { useQuery } from '@tanstack/react-query';

import { getCodeLists } from '../services';

export type GetCodelistsParams = {
  time?: string;
  id?: string;
};

const useCodeLists = (params: GetCodelistsParams | null) => {
  const query = useQuery({
    queryKey: params ? ['codeLists', params] : ['codeLists'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetCodelistsParams];

      return getCodeLists(queryParams);
    },
  });

  return { ...query };
};

export default useCodeLists;
