import { AuditCSVParams } from '@/domains/audit-log/api/query/useAuditCSV';
import { getAuditCSV } from '@/domains/audit-log/api/services/getAuditCSV';

// This function downloads the audit data as a CSV file
export const downloadAuditCSV = async (params: AuditCSVParams): Promise<void> => {
  const response = await getAuditCSV(params);

  if (response != null) {
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;

    const fileName = 'audit-export.csv';

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
