import { AuditPagingList } from 'src/domains/audit-log/types/AuditPagingList';

import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { AuditListParams } from '../query/useAuditList';

// async function to fetch audit list data
export const getAuditList = async (params: AuditListParams): Promise<AuditPagingList | null> => {
  const queryParams = {
    ...(params.page && { page: params.page }),
    ...(params.size && { size: params.size }),
    ...(params.sort && { sort: params.sort }),
    ...(params.timestampFrom && { timestampFrom: params.timestampFrom }),
    ...(params.timestampTo && { timestampTo: params.timestampTo }),
    ...(params.idOrEntityIdOrSessionId && {
      idOrEntityIdOrSessionId: params.idOrEntityIdOrSessionId,
    }),
    ...(params.identityId && { identityId: params.identityId }),
    ...(params.success && params.success !== '-' && { success: params.success }),
  };

  try {
    const result = await axiosInstance.get(`java-cip-audit-ui/api/rest/v${API_VERSION}/list`, {
      params: queryParams,
    });

    return result.data as AuditPagingList;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch audit list: ${error}`);
  }
};
