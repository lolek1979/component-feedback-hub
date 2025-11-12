import { ComparisonErrorResponse, ComparisonSuccessResponse, TextDifference } from '../api';

export const isComparisonError = (
  response: ComparisonSuccessResponse | ComparisonErrorResponse,
): response is ComparisonErrorResponse => {
  return 'state' in response && response.state === 'Error';
};

export const isComparisonSuccess = (
  response: ComparisonSuccessResponse | ComparisonErrorResponse,
): response is ComparisonSuccessResponse => {
  return !isComparisonError(response);
};

export const validatePdfFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxSizeBytes;
};

export const calculateMatchPercentage = (matchRate: number): number => {
  return Number(matchRate.toFixed(2));
};

export const hasDifferences = (differences: TextDifference[] | null): boolean => {
  return Array.isArray(differences) && differences.length > 0;
};

export const getDifferenceCount = (differences: TextDifference[] | null): number => {
  return Array.isArray(differences) ? differences.length : 0;
};

export const storeComparisonData = (
  data: ComparisonSuccessResponse | ComparisonErrorResponse,
  fileNames: { file1: string; file2: string },
): void => {
  const dataToStore = {
    ...data,
    fileNames,
  };
  localStorage.setItem('pdfComparisonData', JSON.stringify(dataToStore));
};

export const getStoredComparisonData = (): any | null => {
  try {
    const storedData = localStorage.getItem('pdfComparisonData');
    if (!storedData) return null;

    const parsed = JSON.parse(storedData);

    return parsed && typeof parsed === 'object' && 'data' in parsed ? parsed.data : parsed;
  } catch (error) {
    console.error('Failed to parse stored comparison data:', error);

    return null;
  }
};

export const clearStoredComparisonData = (): void => {
  localStorage.removeItem('pdfComparisonData');
};

export const createErrorData = (
  code: number,
  message: string,
  fileNames: { file1: string; file2: string },
) => ({
  state: 'Error' as const,
  messages: [message],
  fileNames,
});

export const PDF_COMPARISON_CONSTANTS = {
  MAX_FILE_SIZE_MB: 10,
  SUPPORTED_FILE_TYPE: 'application/pdf',
  LOCAL_STORAGE_KEY: 'pdfComparisonData',
} as const;
