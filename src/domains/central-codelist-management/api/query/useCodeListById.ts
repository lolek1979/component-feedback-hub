import { useQuery } from '@tanstack/react-query';

import { CodeListByIdResponse, getCodeListsById } from '../services';

export type GetCodelistsByIdParams = {
  time?: string;
  id: string;
  isCodelist: boolean;
};

const useCodeListsById = (
  params: GetCodelistsByIdParams | null = { id: '', isCodelist: false },
) => {
  const query = useQuery<CodeListByIdResponse>({
    enabled: !!params && !!params.id && params.isCodelist,
    queryKey: params ? ['codeLists', params] : ['codeLists'],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetCodelistsByIdParams];
      const response = await getCodeListsById(queryParams);
      if (!response) {
        throw new Error('No data found');
      }

      return response;
    },
  });

  return { ...query };
};

export default useCodeListsById;
