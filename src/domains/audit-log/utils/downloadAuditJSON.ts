import { AuditCSVParams } from '@/domains/audit-log/api/query/useAuditCSV';
import { getAuditList } from '@/domains/audit-log/api/services/getAuditList';

// This function downloads the audit data as a JSON file
export const downloadAuditJSON = async (
  params: AuditCSVParams,
  MAX_CSV_EXPORT_SIZE: string,
): Promise<void> => {
  const response = await getAuditList({
    ...params,
    size: MAX_CSV_EXPORT_SIZE, // Set a large size to fetch all records
    page: 0, // Start from the first page
  });

  if (response != null) {
    const blob = new Blob([JSON.stringify(response.content, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const fileName = 'audit-export.json';

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
