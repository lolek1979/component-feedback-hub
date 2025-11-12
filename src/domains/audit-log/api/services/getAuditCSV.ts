import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { AuditCSVParams } from '../query/useAuditCSV';

// async function to fetch audit list data
export const getAuditCSV = async (params: AuditCSVParams): Promise<Blob> => {
  const queryParams = {
    ...(params.timestampFrom && { timestampFrom: params.timestampFrom }),
    ...(params.timestampTo && { timestampTo: params.timestampTo }),
    ...(params.entityId && { entityId: params.entityId }),
    ...(params.identityId && { identityId: params.identityId }),
    ...(params.success && params.success != '-' && { success: params.success }),
    _ts: Date.now(), // Add a timestamp to prevent caching issues
  };

  try {
    const result = await axiosInstance.get(
      `java-cip-audit-ui/api/rest/v${API_VERSION}/export-csv`,
      {
        params: queryParams,
        responseType: 'blob',
      },
    );

    return new Blob([result.data], { type: 'text/csv' });
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch audit CSV: ${error}`);
  }
};
