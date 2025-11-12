import { FieldErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';

import { Step } from '@/design-system/molecules/StepProgressBar';
import { toast } from '@/design-system/molecules/Toast';
import {
  CSCCategory,
  GetRequestCSCCategoriesResponse,
} from '@/domains/electronic-requests/api/services/CSC/types';
import {
  GetAdminContractResponse,
  WFState,
} from '@/domains/electronic-requests/api/services/types';

import { FormData } from './useEmptyItemsForm';

export type UploadedFile = {
  id?: string;
  name: string;
  size: number;
  type: string;
};

export type CategoriesData = {
  payload: {
    total: number;
    items: CSCCategory[];
  };
};

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export type FileUploadConfig = {
  MAX_FILE_SIZE_MB: number;
  MAX_FILES: number;
  ALLOWED_FILE_TYPES: string[];
};
export type EmptyItemsModalFormFieldsProps = {
  form: {
    control: UseFormReturn<FormData>['control'];
    errors: FieldErrors<FormData>;
    watch: UseFormReturn<FormData>['watch'];
    setValue: UseFormReturn<FormData>['setValue'];
    uploadedFiles: UploadedFile[];
    setUploadedFiles: (files: UploadedFile[]) => void;
    handleDateChange: (fieldName: keyof FormData, dateValue: string) => void;
    calculateTotalPrice: (unitPrice: string | number, quantity: string | number) => string;
    getCurrentUnit: () => string;
    amountTypes: Record<string, string>;
    inputReadonly: boolean;
    categoriesData: GetRequestCSCCategoriesResponse | null | undefined;
    contractsData: GetAdminContractResponse | null | undefined;
    isLoadingCategories: boolean;
    isLoadingContracts: boolean;
    unitPrice: number;
    quantity: number;
  };
  config: {
    FILE_UPLOAD_CONFIG: FileUploadConfig;
    styles: { [key: string]: string };
  };
  translations: {
    tLabels: (key: string) => string;
    tValidationErrors: (key: string, params?: Record<string, any>) => string;
  };
  isFromCatalogue: boolean;
};

function getErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return undefined;
}

function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
}

const formatDeliveryDate = (date: string | Date | undefined): string => {
  if (!date) return '';

  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }

  if (typeof date === 'string') {
    if (date.length > 10) return date.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  }

  return '';
};

const mapWorkflowStateToSteps = (currentState: WFState): Step[] => {
  const steps: Step[] = [
    {
      status: 'incomplete',
    },
    {
      status: 'incomplete',
    },
    {
      status: 'incomplete',
    },
    {
      status: 'incomplete',
    },
  ];

  switch (currentState) {
    case 'Active':
      steps[0].status = 'active';
      break;

    case 'PendingApprove0':
    case 'PendingApprove1':
    case 'PendingApprove2':
    case 'PendingApprove3':
    case 'PendingApprove4':
    case 'PendingApprove5':
    case 'Rejected':
    case 'RejectedConfirmed':
      steps[0].status = 'passed';
      steps[1].status = 'active';
      break;

    case 'Approved':
    case 'ApprovedWithoutPurchase':
      steps[0].status = 'passed';
      steps[1].status = 'passed';
      steps[2].status = 'active';
      break;

    case 'Purchase':
    case 'Ordered':
      steps[0].status = 'passed';
      steps[1].status = 'passed';
      steps[2].status = 'active';
      break;

    case 'Closed':
    case 'IssuedWithoutPurchase':
      steps[0].status = 'passed';
      steps[1].status = 'passed';
      steps[2].status = 'passed';
      steps[3].status = 'active';
      break;

    case 'Withdrawn':
    case 'Returned':
      steps[0].status = 'active';
      break;

    default:
      steps[0].status = 'active';
      break;
  }

  return steps;
};

const getAllowedCount = (filesArray: File[], uploadedFiles: UploadedFile[], maxFiles?: number) =>
  (maxFiles ?? filesArray.length) === Infinity
    ? filesArray.length
    : Math.max(0, (maxFiles ?? filesArray.length) - uploadedFiles.length);

export const handleRemoveFile = (
  fileIndex: number,
  uploadedFiles: UploadedFile[],
  setUploadedFiles: (files: UploadedFile[]) => void,
  currentAttachments: any[],
  setValue: UseFormSetValue<FormData>,
) => {
  const newFiles = [...uploadedFiles];
  const removedFile = newFiles.splice(fileIndex, 1)[0];
  setUploadedFiles(newFiles);

  if (removedFile?.id) {
    const updatedAttachments = currentAttachments.filter(
      (attachment) => attachment.id !== removedFile.id,
    );
    setValue('attachments', updatedAttachments);
  }
};

const handleUploadError = (
  error: any,
  validFiles: File[],
  messages: {
    size: string;
    error: string;
  },
) => {
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  const hasTooLargeFile = validFiles.some((file) => file.size > MAX_FILE_SIZE_BYTES);

  if (
    hasTooLargeFile ||
    error?.response?.status === 413 ||
    error?.status === 413 ||
    error?.message?.includes('413') ||
    error?.message?.toLowerCase().includes('content too large') ||
    error?.message?.toLowerCase().includes('payload too large') ||
    error?.message?.toLowerCase().includes('file size exceeds') ||
    (error?.message === 'Network Error' && hasTooLargeFile)
  ) {
    toast.error(messages.size, { id: 'toast-upload-error' });
  } else {
    toast.error(messages.error, { id: 'toast-upload-error' });
  }
};

const validateFile = (
  file: File,
  uploadedFiles: UploadedFile[],
  maxFileSizeMB?: number,
  allowedFileTypes?: string[],
  errorMessages?: {
    sizeLimit?: string;
    wrongFormat?: string;
    missingData?: string;
    similarName?: string;
  },
): string | undefined => {
  const { sizeLimit, wrongFormat, missingData, similarName } = errorMessages ?? {};
  const maxFileSizeBytes = maxFileSizeMB ? maxFileSizeMB * 1024 * 1024 : undefined;

  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  const effectiveMaxSize = maxFileSizeBytes || MAX_SIZE_BYTES;

  if (file.size > effectiveMaxSize) {
    return sizeLimit;
  }

  if (allowedFileTypes && allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
    return wrongFormat;
  }

  if (file.size === 0) {
    return missingData;
  }

  if (uploadedFiles.some((f) => f.name === file.name)) {
    return similarName;
  }

  return undefined;
};

const getValidFilesAndErrors = (
  filesArray: File[],
  uploadedFiles: UploadedFile[],
  maxFileSizeMB?: number,
  allowedFileTypes?: string[],
  errorMessages?: {
    sizeLimit?: string;
    wrongFormat?: string;
    missingData?: string;
    similarName?: string;
  },
) => {
  const validFiles: File[] = [];
  const fileErrors: string[] = [];
  filesArray.forEach((file) => {
    const validationError = validateFile(file, uploadedFiles, maxFileSizeMB, allowedFileTypes, {
      sizeLimit: errorMessages?.sizeLimit,
      wrongFormat: errorMessages?.wrongFormat,
      missingData: errorMessages?.missingData,
      similarName: errorMessages?.similarName,
    });
    if (validationError) {
      fileErrors.push(validationError);
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, fileErrors };
};

export {
  formatDeliveryDate,
  getAllowedCount,
  getErrorMessage,
  getValidFilesAndErrors,
  handleUploadError,
  isEmpty,
  mapWorkflowStateToSteps,
};
