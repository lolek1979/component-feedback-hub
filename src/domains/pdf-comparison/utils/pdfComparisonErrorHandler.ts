import { AxiosError } from 'axios';

type TranslateFn = (key: string, values?: Record<string, unknown>) => string;

export interface PdfComparisonRedirectParams {
  code: number;
  message: string;
}

export interface PdfComparisonErrorHandlerDeps {
  t: TranslateFn;
  showErrorToast: (message: string, id: string) => void;
  onRedirectToResults: (params: PdfComparisonRedirectParams) => void;
}

const extractServerMessage = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const candidate = obj.message ?? obj.error ?? obj.detail ?? '';
    if (typeof candidate === 'string') return candidate;
  }

  return '';
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError)?.isAxiosError === true;
};

export const handlePdfComparisonError = (
  error: Error | AxiosError,
  deps: PdfComparisonErrorHandlerDeps,
): void => {
  const { t, showErrorToast, onRedirectToResults } = deps;

  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      const serverMessage = extractServerMessage(error.response?.data).toLowerCase();

      if (serverMessage.includes('failed to open stream')) {
        showErrorToast(t('error.corruptedFile'), 'pdf-comparison-error-500-corrupted');

        return;
      }

      if (
        serverMessage.startsWith('400:') ||
        serverMessage.includes('očekávanou strukturu') ||
        serverMessage.includes('expected structure') ||
        serverMessage.includes('structure')
      ) {
        showErrorToast(t('error.invalidStructure'), 'pdf-comparison-error-500-structure');

        return;
      }

      onRedirectToResults({ code: 500, message: t('error.serverError') });

      return;
    }

    if (status === 400) {
      const rawMessage = extractServerMessage(error.response?.data);
      const normalized = rawMessage.toLowerCase();

      const messageKey =
        normalized.includes('strukturu') || normalized.includes('structure')
          ? 'error.invalidStructure'
          : normalized.includes('typ') || normalized.includes('type') || normalized.includes('pdf')
            ? 'error.invalidFileType'
            : 'error.uploadFailed';

      showErrorToast(t(messageKey), 'pdf-comparison-error-400');

      return;
    }

    if (status === 403) {
      showErrorToast(t('error.unauthorized'), 'pdf-comparison-error-403');

      return;
    }
  }

  showErrorToast(t('error.uploadFailed'), 'pdf-comparison-error-unknown');
};
