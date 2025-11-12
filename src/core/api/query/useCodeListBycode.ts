import { useQuery } from '@tanstack/react-query';

import { CodeListBycodeResponse, postCodeListBycode } from '../services/postCodeListBycode';

/** Parameters for fetching a code list by code */
export type useCodeListBycodeParams = {
  /** Optional timestamp for retrieving a specific version of the code list */
  time?: string;

  /** Code of the code list to fetch */
  code: string;
};

/**
 * Custom React Query hook for fetching a code list by its code and optional time.
 * Uses `postCodeListBycode` service to retrieve data from the API.
 *
 * @param params - Parameters including code and optional time
 * @returns React Query result object containing the code list data or error state
 */
const useCodeListBycode = (params: useCodeListBycodeParams = { code: '', time: '' }) => {
  const query = useQuery<CodeListBycodeResponse>({
    queryKey: ['bycode', params],
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, useCodeListBycodeParams];
      const response = await postCodeListBycode(queryParams);
      if (!response) {
        throw new Error('No data found');
      }

      return response;
    },
  });

  return { ...query };
};

export default useCodeListBycode;
