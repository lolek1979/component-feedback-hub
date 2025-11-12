import { useQuery } from '@tanstack/react-query';

import { getAuditCSV } from '../services/getAuditCSV';

export type AuditCSVParams = {
  timestampFrom?: Date | null;
  timestampTo?: Date | null;
  entityId?: string | null;
  identityId?: string | null;
  success?: string | null;
};

const useAuditCSV = (params: AuditCSVParams | null, options: { enabled: boolean }) => {
  const query = useQuery({
    queryKey: params ? ['auditCSV', params] : ['auditCSV'],
    enabled: options.enabled,
    queryFn: async ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, AuditCSVParams];

      return getAuditCSV(queryParams); //request server to fetch audit CSV Export
    },
  });

  return { ...query };
};

export default useAuditCSV;
