'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';

import IRemove from '@/core/assets/icons/delete_forever.svg';
import IFile from '@/core/assets/icons/icon-file.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { truncateFileName } from '@/core/utils/file';
import { Button, Text } from '@/design-system/atoms';
import { Toast, toast } from '@/design-system/molecules/Toast/Toast';
import { handlePdfComparisonError } from '@/domain-pdf-comparison/utils/pdfComparisonErrorHandler';

import { useGetComparison } from './api';
import { SingleFileUpload } from './components';
import styles from './index.module.css';

import { ROUTES } from '@/core';

const PdfComparisonPage = () => {
  const t = useTranslations('PdfComparison');
  const tFile = useTranslations('FileUpload');
  const router = useRouter();

  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const { pdfComparisonReader, isLoadingRoles } = useRoles();

  const { mutate: createComparison, isPending } = useGetComparison();

  useEffect(() => {
    if (isLoadingRoles) return;
    if (!pdfComparisonReader) {
      router.push(ROUTES.HOME);
    }
  }, [isLoadingRoles, router, pdfComparisonReader]);

  const validatePdfFile = (file: File): boolean => {
    return file.type === 'application/pdf';
  };

  const handleLeftFileSelected = (file: File | null) => {
    if (!file) {
      setLeftFile(null);

      return;
    }

    if (!validatePdfFile(file)) {
      toast.error(t('error.invalidFileType'), {
        id: 'pdf-comparison-error-1',
      });

      return;
    }

    toast.success(tFile('uploadSuccess'), {
      id: 'pdf-comparison-success-1',
    });
    setLeftFile(file);
  };

  const handleRightFileSelected = (file: File | null) => {
    if (!file) {
      setRightFile(null);

      return;
    }

    if (!validatePdfFile(file)) {
      toast.error(t('error.invalidFileType'), {
        id: 'pdf-comparison-error-2',
      });

      return;
    }

    toast.success(tFile('uploadSuccess'), {
      id: 'pdf-comparison-success-2',
    });
    setRightFile(file);
  };

  const handleRemoveLeftFile = () => {
    setLeftFile(null);
  };

  const handleRemoveRightFile = () => {
    setRightFile(null);
  };

  const handleCompareFiles = () => {
    if (!leftFile || !rightFile) return;

    if (!validatePdfFile(leftFile) || !validatePdfFile(rightFile)) {
      toast.error(t('error.invalidFileType'), {
        id: 'pdf-comparison-error-3',
      });

      return;
    }

    createComparison(
      { pdfFile1: leftFile, pdfFile2: rightFile },
      {
        onSuccess: (response) => {
          const isError = 'state' in response && response.state === 'Error';
          if (!isError) {
            const dataToStore = {
              ...response,
              fileNames: {
                file1: leftFile.name,
                file2: rightFile.name,
              },
            };
            localStorage.setItem('pdfComparisonData', JSON.stringify(dataToStore));
            router.push('/porovnanipdf/vysledky');
          } else {
            console.error('Comparison failed:', response);
            toast.error(t('error.uploadFailed'), {
              id: 'pdf-comparison-error-4',
            });
          }
        },
        onError: (error: Error | AxiosError) => {
          handlePdfComparisonError(error, {
            t: t as unknown as (key: string, values?: Record<string, unknown>) => string,
            showErrorToast: (message: string, id: string) => toast.error(message, { id }),
            onRedirectToResults: ({ code, message }) => {
              const errorData = {
                state: 'Error' as const,
                error: { code, message },
                fileNames: {
                  file1: leftFile.name,
                  file2: rightFile.name,
                },
              };
              localStorage.setItem('pdfComparisonData', JSON.stringify(errorData));
              router.push('/porovnanipdf/vysledky');
            },
          });
        },
      },
    );
  };

  const renderFileDisplay = (file: File, onRemove: () => void) => (
    <div className={styles.fileDisplayBox}>
      <div className={styles.fileInfo}>
        <IFile id={'icon-file-' + file.name} width={24} height={24} />
        <Text variant="body" className={styles.fileInfoText}>
          {truncateFileName(file.name)}
        </Text>
        <IRemove
          id={'icon-file-' + file.name + '-remove'}
          className={styles.removeButton}
          width={24}
          height={24}
          onClick={onRemove}
          role="button"
          aria-label="Odstranit soubor"
        />
      </div>
    </div>
  );

  return (
    <div className={styles.pdfComparisonPage}>
      <div className={styles.header}>
        <Text variant="h4" selectable={false} id="text-pdf-comparison-title">
          {t('title')}
        </Text>
      </div>
      <div className={styles.uploadContainer}>
        <div className={styles.uploadGrid}>
          <div className={styles.uploadBox}>
            <Text
              variant="headline"
              className={styles.uploadTitle}
              id="text-pdf-comparison-left-title"
            >
              {t('leftDocument')}
            </Text>
            {leftFile ? (
              renderFileDisplay(leftFile, handleRemoveLeftFile)
            ) : (
              <SingleFileUpload
                onFileSelected={handleLeftFileSelected}
                dropLabel={t('dropLabel')}
                width="100%"
                height="160px"
                limitLabel={''}
                id="upload-pdf-comparison-left"
              />
            )}
          </div>

          <div className={styles.uploadBox}>
            <Text
              variant="headline"
              className={styles.uploadTitle}
              id="text-pdf-comparison-right-title"
            >
              {t('rightDocument')}
            </Text>
            {rightFile ? (
              renderFileDisplay(rightFile, handleRemoveRightFile)
            ) : (
              <SingleFileUpload
                onFileSelected={handleRightFileSelected}
                dropLabel={t('dropLabel')}
                width="100%"
                height="160px"
                limitLabel={''}
                id="upload-pdf-comparison-right"
              />
            )}
          </div>
        </div>

        {leftFile && rightFile && (
          <div className={styles.compareButtonContainer}>
            <Button
              variant="primary"
              size="large"
              onClick={handleCompareFiles}
              id="button-pdf-comparison-compare"
              disabled={isPending}
            >
              {t('compareFiles')}
            </Button>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
};

export default PdfComparisonPage;
