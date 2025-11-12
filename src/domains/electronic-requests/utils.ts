import { SortDirection } from '@/core/utils/types';
import { ChipColors } from '@/design-system/molecules/Chip';
import {
  RequestDetailModel,
  RequestItemDetailModel,
  RequestItemUpdateModel,
} from '@/domains/electronic-requests/api/services/types';

const filterRecords = (records: any[], filters: any) => {
  return records.filter((record) => {
    // Search filter
    if (
      filters.search &&
      !Object.values(record).some(
        (value: any) =>
          value && value.toString().toLowerCase().includes(filters.search.toLowerCase()),
      )
    ) {
      return false;
    }

    // Type filter
    if (filters.type && filters.type.length > 0 && !filters.type.includes(record.type)) {
      return false;
    }

    // State filter
    if (filters.state && filters.state.length > 0 && !filters.state.includes(record.status)) {
      return false;
    }

    return true;
  });
};

const sortRequestRecords = (
  data: RequestDetailModel[],
  sortColumn: string,
  sortDirection: SortDirection,
): RequestDetailModel[] => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortColumn) {
      case 'createdAt':
        valueA = new Date(a.createdAtUtc).getTime();
        valueB = new Date(b.createdAtUtc).getTime();
        break;
      case 'id':
        valueA = a.id;
        valueB = b.id;
        break;
      case 'requestNumber':
        valueA = a.requestNumber || '';
        valueB = b.requestNumber || '';
        break;
      case 'status':
        valueA = a.wfState;
        valueB = b.wfState;
        break;
      case 'description':
        valueA = a.description;
        valueB = b.description;
        break;
      case 'requester':
        valueA = `${a.createdBy.givenName} ${a.createdBy.surname}`;
        valueB = `${b.createdBy.givenName} ${b.createdBy.surname}`;
        break;
      case 'recipient':
        valueA = `${a.recipient.givenName} ${a.recipient.surname}`;
        valueB = `${b.recipient.givenName} ${b.recipient.surname}`;
        break;
      default:
        valueA = a[sortColumn as keyof RequestDetailModel] ?? '';
        valueB = b[sortColumn as keyof RequestDetailModel] ?? '';
    }

    // Handle undefined values safely
    if (valueA === undefined && valueB === undefined) return 0;
    if (valueA === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (valueB === undefined) return sortDirection === 'asc' ? 1 : -1;

    // Compare strings
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    // Compare numbers or other types
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;

    return 0;
  });

  return sortedData;
};

const formatWorkflowState = (wfState: string | { label: string } | unknown): string => {
  if (typeof wfState === 'string') {
    return wfState;
  }

  if (wfState && typeof wfState === 'object' && 'label' in wfState) {
    return (wfState as { label: string }).label;
  }

  return '';
};

/**
 * Formats a status value for use with translation keys
 * Converts strings like "New Request" to "newRequest" format
 */
const formatStatusForTranslation = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase());
};

/**
 * Gets the appropriate badge color based on workflow state string
 */
const getBadgeColor = (statusKey: string): ChipColors => {
  switch (statusKey) {
    case 'Draft':
      return 'gray';
    case 'PendingApprove':
    case 'PendingApprove1':
    case 'PendingApprove2':
    case 'Pending':
      return 'lightBlue';
    case 'Withdrawn':
      return 'lightRed';
    case 'Completed':
    case 'Approved':
      return 'lightGreen';
    case 'Rejected':
      return 'lightRed';
    default:
      return 'gray';
  }
};

const mapToUpdateItemPayload = (currentItem: RequestItemDetailModel): RequestItemUpdateModel => {
  return {
    catalogueItemId: currentItem.catalogueItem?.id,
    manualItem: {
      description: currentItem.manualItem?.description || '',
      categoryId: currentItem.manualItem?.category?.id || '',
      supplierArticleNumber: currentItem.manualItem?.supplierArticleNumber || '',
      unitOfMeasure: currentItem.manualItem?.unitOfMeasure || '',
      unitPrice: currentItem.manualItem?.unitPrice || 0,
      contract: currentItem.manualItem?.contract || '',
      externalUrl: currentItem.manualItem?.externalUrl || '',
    },
    description: currentItem.description,
    quantity: currentItem.quantity || 0,
    justification: currentItem.justification ?? null,
    expectedDeliveryDate: currentItem.expectedDeliveryDate || '',
    attachments: currentItem.attachments?.map((att) => att.id),
  };
};

export {
  filterRecords,
  formatStatusForTranslation,
  formatWorkflowState,
  getBadgeColor,
  mapToUpdateItemPayload,
  sortRequestRecords,
};
