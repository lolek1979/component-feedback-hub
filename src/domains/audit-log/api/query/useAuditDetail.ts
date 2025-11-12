import { useQuery } from '@tanstack/react-query';

import { getAuditDetail } from '../services/getAuditDetail';

export type AuditDetailParams = {
  id: number;
};

const useAuditDetail = (params: AuditDetailParams | null, options: { enabled: boolean }) => {
  const query = useQuery({
    queryKey: params ? ['auditDetail', params] : ['auditDetail'],
    enabled: options.enabled && !!params, // Only enable the query if params are provided and enabled is true
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, AuditDetailParams];

      return getAuditDetail(queryParams); //request server to fetch audit list data
    },
  });

  return { ...query };
};

export default useAuditDetail;
