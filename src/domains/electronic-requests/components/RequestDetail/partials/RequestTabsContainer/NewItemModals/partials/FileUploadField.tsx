import { useRef, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import IDelete from '@/core/assets/icons/delete_forever.svg';
import IDraft from '@/core/assets/icons/draft.svg';
import { Button, Spinner, Text } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';
import { useCreateAttachment } from '@/domains/electronic-requests/api/query/Attachments/useCreateAttachment';

import styles from '../EmptyItemsModal.module.css';
import { FormData, UploadedFile } from './useEmptyItemsForm';
import {
  getAllowedCount,
  getValidFilesAndErrors,
  handleRemoveFile,
  handleUploadError,
  MAX_FILE_SIZE_BYTES,
} from './utils';

import { Typography } from '@/design-system';

interface FileUploadFieldProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  readonly?: boolean;
  maxFiles?: number;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  helpText?: string;
}

interface ApiError {
  response?: {
    status?: number;
  };
  status?: number;
  message?: string;
}

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'status' in error || 'message' in error)
  );
};

export const FileUploadField = ({
  uploadedFiles,
  setUploadedFiles,
  setValue,
  watch,
  readonly = false,
  maxFiles = Infinity,
  maxFileSizeMB,
  allowedFileTypes,
  helpText,
}: FileUploadFieldProps) => {
  const tFileUpload = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.fileUpload',
  );
  const tErrorMessages = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.fileUpload.errorMessages',
  );
  const [isUploading, setIsUploading] = useState(false);
  const createAttachmentMutation = useCreateAttachment();

  const uploadFileToServer = async (
    file: File,
  ): Promise<{ id: string; name: string } | { error: string } | null> => {
    try {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return { error: tErrorMessages('sizeLimit') };
      }

      const response = await createAttachmentMutation.mutateAsync(file);

      if (response?.data?.state === 'Success' && response?.data?.payload) {
        return {
          id: response.data.payload,
          name: file.name,
        };
      }

      return null;
    } catch (error: unknown) {
      const apiError = isApiError(error) ? error : { message: String(error) };

      if (
        file.size > MAX_FILE_SIZE_BYTES ||
        apiError?.response?.status === 413 ||
        apiError?.status === 413 ||
        apiError?.message?.includes('413') ||
        apiError?.message?.toLowerCase().includes('content too large') ||
        apiError?.message?.toLowerCase().includes('payload too large') ||
        (apiError?.message === 'Network Error' && file.size > 1024 * 1024)
      ) {
        return { error: tErrorMessages('sizeLimit') };
      }

      if (apiError?.message?.includes('File size exceeds')) {
        return { error: tErrorMessages('sizeLimit') };
      }

      return { error: tFileUpload('uploadError') };
    }
  };

  const handleUploadResults = (
    uploadResults: Array<{ id: string; name: string } | { error: string } | null>,
    validFiles: File[],
    uploadToastId: string,
  ) => {
    const errorMessages: string[] = [];
    uploadResults.forEach((result) => {
      if (result && 'error' in result) {
        errorMessages.push(result.error);
      }
    });

    if (errorMessages.length > 0) {
      toast.error(errorMessages.join('. '), { id: uploadToastId });
    }

    const successfulUploads = uploadResults.filter(
      (result): result is { id: string; name: string } => result !== null && 'id' in result,
    );

    if (successfulUploads.length > 0) {
      const newUploadedFiles: UploadedFile[] = successfulUploads.map((result) => ({
        id: result.id,
        name: result.name,
        size: validFiles.find((f) => f.name === result.name)?.size || 0,
        type: validFiles.find((f) => f.name === result.name)?.type || '',
      }));

      setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);

      const currentAttachments = watch('attachments') || [];
      const updatedAttachments = [...currentAttachments, ...successfulUploads];
      setValue('attachments', updatedAttachments);

      if (errorMessages.length === 0) {
        let successMessage =
          successfulUploads.length === validFiles.length
            ? tFileUpload('uploadSuccess')
            : tFileUpload('partialUploadSuccess');
        toast.success(successMessage, { id: uploadToastId });
      }
    } else if (errorMessages.length === 0) {
      toast.error(tFileUpload('uploadError'), { id: uploadToastId });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const files = event.target.files;
    if (!files || files.length === 0) {
      event.target.value = '';

      return;
    }

    let filesArray = Array.from(files);
    const allowedCount = getAllowedCount(filesArray, uploadedFiles, maxFiles);

    if (allowedCount <= 0) {
      toast.error(tErrorMessages('attachmentLimit'), {
        id: 'toast-attachment-limit-error',
      });
      event.target.value = '';

      return;
    }

    if (filesArray.length > allowedCount) {
      toast.error(tErrorMessages('attachmentLimit'), {
        id: 'toast-attachment-limit-error',
      });
      filesArray = filesArray.slice(0, allowedCount);
    }

    const { validFiles, fileErrors } = getValidFilesAndErrors(
      filesArray,
      uploadedFiles,
      maxFileSizeMB,
      allowedFileTypes,
      {
        sizeLimit: tErrorMessages('sizeLimit'),
        wrongFormat: tErrorMessages('wrongFormat'),
        missingData: tErrorMessages('noData'),
        similarName: tErrorMessages('nameSimilarity'),
      },
    );

    if (fileErrors.length > 0) {
      toast.error(fileErrors.join('. '), {
        id: 'toast-file-validation-error',
      });
    }

    if (validFiles.length === 0) {
      event.target.value = '';

      return;
    }

    setIsUploading(true);
    const uploadPromises = validFiles.map(uploadFileToServer);
    const uploadToastId = 'toast-uploading-files';

    try {
      const uploadResults = await Promise.all(uploadPromises);
      handleUploadResults(uploadResults, validFiles, uploadToastId);
    } catch (error: unknown) {
      const apiError = isApiError(error) ? error : { message: String(error) };
      handleUploadError(apiError, validFiles, {
        size: tErrorMessages('sizeLimit'),
        error: tFileUpload('uploadError'),
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (maxFiles !== Infinity && uploadedFiles.length >= maxFiles) {
      toast.error(tErrorMessages('attachmentLimit'), {
        id: 'toast-update-item-error',
      });

      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <>
      {uploadedFiles.length > 0 && (
        <div className={styles.uploadedFilesScrollContainer}>
          {uploadedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileItemWide}>
              <div className={styles.fileInfo}>
                <IDraft height={24} width={24} id={'icon-file-upolad-field-draft-' + index} />

                <div className={styles.fileDetails}>
                  <Typography variant="Subtitle/Default/Link-inline" className={styles.fileName}>
                    {file.name}
                  </Typography>
                </div>
              </div>
              <Button
                variant="unstyled"
                onClick={() =>
                  handleRemoveFile(
                    index,
                    uploadedFiles,
                    setUploadedFiles,
                    watch('attachments') || [],
                    setValue,
                  )
                }
                id={`button-modal-remove-file-${index}`}
                disabled={readonly}
                aria-label={`${tFileUpload('removeFile')} ${file.name}`}
              >
                {isUploading ? (
                  <Spinner width={24} height={24} />
                ) : (
                  <IDelete id={'icon-file-upolad-field-delete-' + index} height={24} width={24} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.fileUploadDropzone} data-testid="file-upload-dropzone">
        <Button
          id="button-modal-upload-file"
          variant="secondary"
          onClick={handleUploadButtonClick}
          type="button"
          className={styles.fileUploadButton}
          disabled={readonly}
          aria-label={tFileUpload('button')}
        >
          {tFileUpload('button')}
        </Button>
        {helpText && (
          <div className={styles.fileUploadHelpText} id="file-upload-help-text">
            <Text variant="subtitle" color="tertiary" regular>
              {helpText}
            </Text>
          </div>
        )}
        <input
          ref={fileInputRef}
          id="input-modal-file-upload"
          type="file"
          name="attachments"
          onChange={handleFileUpload}
          className={styles.hiddenInput}
          accept={allowedFileTypes?.join(',')}
          multiple
          disabled={readonly || (maxFiles !== Infinity && uploadedFiles.length >= maxFiles)}
          aria-label={tFileUpload('selectFiles')}
          aria-describedby={helpText ? 'file-upload-help-text' : undefined}
        />
      </div>
    </>
  );
};
