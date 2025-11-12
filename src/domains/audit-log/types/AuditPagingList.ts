import { AuditLog } from './AuditLog';

// AuditPagingList type for the paginated audit log data
export interface AuditPagingList {
  content: AuditLog[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
