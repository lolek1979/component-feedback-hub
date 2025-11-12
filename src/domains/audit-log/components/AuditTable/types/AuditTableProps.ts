export interface AuditTableProps {
  shouldFetch: boolean;
  initialPage: number;
  initialPageSize: string;
  identityId?: string | null;
  idOrEntityIdOrSessionId?: string | null;
  timestampFrom?: Date | null;
  timestampTo?: Date | null;
  success?: string | null;
  sort?: string;

  onNumberOfRecordsChange?: (numberOfRecords: number) => void;
}
