'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { IExport } from '@/core/assets/icons';
import { useRoles } from '@/core/providers/RolesProvider';
import { Text, Tooltip } from '@/design-system/atoms';
import { Button } from '@/design-system/atoms';
import { Spinner } from '@/design-system/atoms';
import { AuditListParams } from '@/domains/audit-log/api/query/useAuditList';

import { FilterChange } from './components/AuditListFilter/types/FilterChange';
import {
  getDateFromUrlGetParam,
  getPageIndexFromUrlGetParam,
  getPageSizeFromUrlGetParam,
  getSuccessFromUrlGetParam,
} from './utils/auditTableUtils';
import { downloadAuditCSV } from './utils/downloadAuditCSV';
import { downloadAuditJSON } from './utils/downloadAuditJSON';
import { AuditListFilter, AuditTable } from './components';
import styles from './index.module.css';

const MAX_CSV_EXPORT_SIZE = 1000; // Maximum number of records allowed for CSV export

// This component is recipient for displaying the audit list and handling CSV downloads
export const AuditListPage = () => {
  const router = useRouter();
  const { auditReader, isLoadingRoles } = useRoles();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const t = useTranslations('AuditPage');
  const searchParams = useSearchParams();
  const [disableCsvExport, setDisableCsvExport] = useState(true);

  const initialPageSize = getPageSizeFromUrlGetParam(searchParams); // searchParams.get('pageSize') ?? '10';
  const initialPage = getPageIndexFromUrlGetParam(searchParams);
  const initialFromDate = getDateFromUrlGetParam('timestampFrom', searchParams);
  const initialToDate = getDateFromUrlGetParam('timestampTo', searchParams);
  const initialSuccess = getSuccessFromUrlGetParam(searchParams);
  const initialIdOrEntityIdOrSessionId = searchParams.get('idOrEntityIdOrSessionId');
  const initialIdentityId = searchParams.get('identityId');

  const [params, setParams] = useState<AuditListParams>({
    page: initialPage,
    size: initialPageSize,
    timestampFrom: initialFromDate,
    timestampTo: initialToDate,
    success: initialSuccess,
    idOrEntityIdOrSessionId: initialIdOrEntityIdOrSessionId,
    identityId: initialIdentityId,
    sort: 'timestamp,desc',
  });

  useEffect(() => {
    if (!isLoadingRoles && !auditReader) {
      router.push('/'); // Redirect to home if user does not have auditReader role
    }
  }, [auditReader, isLoadingRoles, router]);

  const shouldFetch = auditReader && !isLoadingRoles;

  // Function to handle CSV download
  const handleCsvDownload = async () => {
    setIsDataLoading(true);
    try {
      await downloadAuditCSV(params);
    } catch (error) {
      console.error('Error by CSV downloading', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Function to handle JSON download
  const handleJsonDownload = async () => {
    setIsDataLoading(true);
    try {
      await downloadAuditJSON(params, MAX_CSV_EXPORT_SIZE.toString());
    } catch (error) {
      console.error('Error by CSV downloading', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Handle filter changes and update the parameters accordingly
  function handleFilterChange(newFilter: FilterChange) {
    setParams((prev) => ({
      ...prev,
      page: newFilter.resetPage ? 0 : prev.page, // Reset to the first page when filter changes
      timestampFrom: newFilter.fromDate,
      timestampTo: newFilter.toDate,
      idOrEntityIdOrSessionId: newFilter.idOrEntityIdOrSessionId || null,
      identityId: newFilter.identityId || null,
      success: newFilter.success || null,
    }));
  }

  function handleNumberOfRecordsChange(numberOfRecords: number): void {
    // Enable CSV export only if the number of records is within the limit
    setDisableCsvExport(numberOfRecords > MAX_CSV_EXPORT_SIZE);
  }

  // Render the AuditListPage component
  return (
    <div className={styles.auditListPage}>
      <div className={styles.headerRow}>
        <Text variant="h4">{t('title')}</Text>
        <Tooltip
          content={t('exportButtonTooltip')}
          id="audit-page-export-tooltip-id"
          disabled={!disableCsvExport}
          placement="tooltipTopEnd"
        >
          <div className={styles.actions}>
            <Button
              disabled={disableCsvExport}
              variant="primary"
              id="csv-export-button-id"
              icon={
                <IExport id="csv-export-icon-id" className="icon_white" width={24} height={24} />
              }
              onClick={handleCsvDownload}
            >
              {t('CSVExport')}
            </Button>
            <Button
              disabled={disableCsvExport}
              variant="secondary"
              id="json-export-button-id"
              icon={<IExport id="json-export-icon-id" width={24} height={24} />}
              onClick={handleJsonDownload}
            >
              {t('jsonExport')}
            </Button>
          </div>
        </Tooltip>
      </div>

      <AuditListFilter
        onFilterChange={handleFilterChange}
        initialFromDate={initialFromDate}
        initialToDate={initialToDate}
        initialSuccess={initialSuccess}
        idOrEntityIdOrSessionId={initialIdOrEntityIdOrSessionId}
        initialIdentityId={initialIdentityId}
      />

      <AuditTable
        onNumberOfRecordsChange={handleNumberOfRecordsChange}
        shouldFetch={shouldFetch}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        identityId={params.identityId || null}
        idOrEntityIdOrSessionId={params.idOrEntityIdOrSessionId || null}
        timestampFrom={params.timestampFrom || null}
        timestampTo={params.timestampTo || null}
        success={params.success || null}
        sort={params.sort}
      ></AuditTable>

      {isDataLoading && (
        <div className={styles.spinnerOverlay}>
          <Spinner fullScreen={false} />
        </div>
      )}
    </div>
  );
};
