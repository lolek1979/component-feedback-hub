// Define FilterChange interface for callback method onFilterChange
export interface FilterChange {
  fromDate?: Date | null;
  toDate?: Date | null;
  idOrEntityIdOrSessionId?: string | null;
  identityId?: string | null;
  success?: string | null;
  resetPage?: boolean; // Optional flag to reset the page when filters change
}

// Define the props for the AuditListFilter component
export interface AuditListFilterProps {
  initialSuccess?: string | null | undefined; // Optional initial success filter value
  idOrEntityIdOrSessionId?: string | null | undefined; // Optional initial entity ID filter value
  initialIdentityId?: string | null | undefined; // Optional initial identity ID filter value
  initialFromDate?: Date | null; // Optional initial from date filter value
  initialToDate?: Date | null; // Optional initial to date filter value
  onFilterChange: (filter: FilterChange) => void;
}
