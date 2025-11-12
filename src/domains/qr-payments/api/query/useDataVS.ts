import { useQuery } from '@tanstack/react-query';

import { getDataVS } from '../services/getDataVS';

/**
 * Type of payer.
 * - `'1'` = Individual
 * - `'2'` = Bulk
 */
type payerType = '1' | '2';

/**
 * Parameters for fetching variable symbols (VS) data.
 */
export type getDataVSParams = {
  /**
   * Organizational unit or identifier.
   */
  up: string;

  /**
   * Type of payer.
   */
  type: payerType;

  /**
   * Shortened type code used to filter results.
   */
  tpShrt: string;
};

/**
 * Custom React hook for fetching variable symbols (VS) data using React Query.
 *
 * @param params - Parameters used to query the VS data. If `null`, the query is disabled.
 * @returns The result of the query including status, data, and error information.
 */
const useDataVS = (params: getDataVSParams | null) => {
  const query = useQuery({
    queryKey: ['QrVS', params],
    enabled: params?.tpShrt !== '1' && params?.tpShrt !== '2' && params?.tpShrt !== '',
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, getDataVSParams];

      return getDataVS(queryParams);
    },
  });

  return { ...query };
};

export default useDataVS;
