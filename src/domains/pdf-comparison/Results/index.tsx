'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { useRoles } from '@/core/providers/RolesProvider';
import { Button, Divider, Text } from '@/design-system/atoms';
import { Toast, toast } from '@/design-system/molecules/Toast/Toast';
import { DocumentComparisonSection } from '@/domains/pdf-comparison/components/DocumentComparisonSection';

import { ComparisonErrorResponse, ComparisonSuccessResponse, TextDifference } from '../api';
import { ComparisonResult, PdfComparisonHeader, PDFProviderInfo } from '../components';
import styles from './index.module.css';

import { ROUTES } from '@/core';
import { Breadcrumbs } from '@/design-system';

interface FileNames {
  file1: string;
  file2: string;
}

type ExtendedComparisonResponse = (ComparisonSuccessResponse | ComparisonErrorResponse) & {
  fileNames?: FileNames;
  error?: {
    code: number;
    message: string;
  };
};

const PdfComparisonResultsPage = () => {
  const t = useTranslations('PdfComparison');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [comparison, setComparison] = useState<ExtendedComparisonResponse | null>(null);
  const { pdfComparisonReader, isLoadingRoles } = useRoles();

  useEffect(() => {
    if (isLoadingRoles) return;
    if (!pdfComparisonReader) {
      router.push(ROUTES.HOME);
    }
  }, [isLoadingRoles, router, pdfComparisonReader]);

  useEffect(() => {
    const storedData = localStorage.getItem('pdfComparisonData');

    if (!storedData) {
      router.push('/porovnanipdf');

      return;
    }

    try {
      const parsed = JSON.parse(storedData) as
        | ExtendedComparisonResponse
        | { data: ExtendedComparisonResponse };
      const unwrapped =
        parsed && typeof parsed === 'object' && 'data' in parsed
          ? (parsed as { data: ExtendedComparisonResponse }).data
          : (parsed as ExtendedComparisonResponse);
      setComparison(unwrapped);
    } catch (error) {
      console.error('Failed to parse comparison data:', error);
      toast.error(t('error.comparisonFailed'), {
        id: 'pdf-comparison-parse-error',
      });
      router.push('/porovnanipdf');
    }
  }, [router, t]);

  const handleRetry = () => {
    router.push('/porovnanipdf');
  };

  const breadcrumbs = [
    { value: t('title', { default: 'Porovnání PDF' }), link: '/porovnanipdf' },
    {
      value: t('results.title', { default: 'Výsledky porovnání' }),
      link: '/porovnanipdf/vysledky',
    },
  ];

  if (!comparison) {
    return (
      <div className={styles.resultsPage}>
        <header className={styles.header}>
          <div className={styles.navigation}>
            <Breadcrumbs breadcrumbs={breadcrumbs} id="breadcrumbs-pdf-comparison-results" />
          </div>
          <div className={styles.mainContent}>
            <div className={styles.titleContainer}>
              <Text variant="h2" selectable={false} id="text-pdf-comparison-results-title">
                {t('results.title')}
              </Text>
            </div>
          </div>
        </header>
        <Divider className={styles.divider} id="divider-pdf-comparison-results" />
        <div className={styles.loadingContainer}>
          <Text variant="body">{tCommon('loading')}</Text>
        </div>
      </div>
    );
  }

  const isError = 'state' in comparison && comparison.state === 'Error';
  const successResponse = !isError
    ? (comparison as ComparisonSuccessResponse & { fileNames?: { file1: string; file2: string } })
    : null;
  const matchRate =
    typeof successResponse?.text?.match_rate === 'number'
      ? Number(successResponse.text.match_rate.toFixed(2))
      : 0;
  const hasDifferences = Array.isArray(successResponse?.text?.differences)
    ? successResponse!.text!.differences!.length > 0
    : false;

  return (
    <div className={styles.resultsPage}>
      <header className={clsx(styles.header, isError && styles.headerError)}>
        {!isError && (
          <div className={styles.navigation}>
            <Breadcrumbs breadcrumbs={breadcrumbs} id="breadcrumbs-pdf-comparison-results" />
          </div>
        )}
        <div className={styles.mainContent}>
          <div className={styles.titleContainer}>
            <Text variant="h4" selectable={false} id="text-pdf-comparison-results-title">
              {isError ? t('title') : t('results.title')}
            </Text>
          </div>
        </div>
        {successResponse && !isError && (
          <PDFProviderInfo
            serviceProviderInfo={{
              poskytovatelSluzeb: successResponse.header?.sent?.name || '',
              adresa: [
                successResponse.header?.sent?.street,
                `${successResponse.header?.sent?.city || ''} ${successResponse.header?.sent?.zip || ''}`.trim(),
              ]
                .filter(Boolean)
                .join(', '),
              zastoupeny: successResponse.header?.sent?.represented || '',
              ic: successResponse.header?.sent?.ic || '',
              icz: successResponse.header?.sent?.icz || '',
              podepsany:
                successResponse.signature?.name && successResponse.signature?.date
                  ? `${successResponse.signature.name} ${successResponse.signature.date.split(' ')[0]}`
                  : '',
            }}
            id="provider-info-pdf-comparison-results"
          />
        )}
      </header>
      <Divider className={styles.divider} id="divider-pdf-comparison-results" />

      <div className={styles.contentContainer}>
        {isError ? (
          <div className={styles.resultContainer}>
            <ComparisonResult
              variant="error"
              title={t('results.error.title')}
              description={t('results.error.description')}
              onRetry={handleRetry}
              retryLabel={t('results.error.retryButton')}
              id="comparison-result-error"
            />
          </div>
        ) : (
          !hasDifferences && (
            <div className={styles.resultContainer}>
              <ComparisonResult
                variant="success"
                title={t('results.success.title')}
                description={t('results.success.description')}
                id="comparison-result-success"
              />

              <Button
                variant="primary"
                size="large"
                onClick={handleRetry}
                id="button-pdf-comparison-results-retry"
              >
                {t('retry')}
              </Button>
            </div>
          )
        )}

        {successResponse && hasDifferences && (
          <div className={styles.differencesContainer}>
            <PdfComparisonHeader
              matchPercentage={matchRate}
              leftFileName={successResponse.fileNames!.file1}
              rightFileName={successResponse.fileNames!.file2}
              id="header-pdf-comparison-results"
            />

            {successResponse.text.differences.map((diff: TextDifference, index: number) => (
              <DocumentComparisonSection
                key={`diff-${index}`}
                id={`section-pdf-comparison-diff-${index + 1}`}
                leftTitle={successResponse.fileNames!.file1}
                rightTitle={successResponse.fileNames!.file2}
                leftContent={diff.added.join('\n')}
                rightContent={diff.removed.join('\n')}
                pageInfo={diff.where}
              />
            ))}
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                size="large"
                onClick={handleRetry}
                id="button-pdf-comparison-results-retry"
              >
                {t('retry')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Toast />
    </div>
  );
};

export default PdfComparisonResultsPage;
