import { useQuery } from '@tanstack/react-query';

import { getAuditList } from '@/domains/audit-log/api/services/getAuditList';

export type AuditListParams = {
  page?: number;
  size?: string;
  timestampFrom?: Date | null;
  timestampTo?: Date | null;
  idOrEntityIdOrSessionId?: string | null;
  identityId?: string | null;
  success?: string | null;
  sort?: string;
};

const useAuditList = (params: AuditListParams | null, enabled: boolean) => {
  const query = useQuery({
    queryKey: params ? ['auditList', params] : ['auditList'],
    staleTime: 0, // Do not cache data
    enabled: enabled && !!params, // Only enable the query if params are provided and enabled is true
    queryFn: async ({ queryKey }) => {
      // Extract the parameters from the query key
      const [, queryParams] = queryKey as [string, AuditListParams];

      return getAuditList(queryParams); //request server to fetch audit list data
    },
  });

  return { ...query };
};

export default useAuditList;
