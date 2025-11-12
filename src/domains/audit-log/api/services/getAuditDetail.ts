import { AuditLog } from 'src/domains/audit-log/types/AuditLog';

import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { AuditDetailParams } from '../query/useAuditDetail';

// async function to fetch audit list data
export const getAuditDetail = async (params: AuditDetailParams): Promise<AuditLog | null> => {
  const queryParams = { id: params.id };

  try {
    const result = await axiosInstance.get(
      `java-cip-audit-ui/api/rest/v${API_VERSION}/detail/${queryParams.id}`,
    );

    return result.data as AuditLog;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch audit detail: ${error}`);
  }
};
