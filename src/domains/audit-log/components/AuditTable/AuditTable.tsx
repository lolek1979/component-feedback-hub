'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AuditLog } from 'src/domains/audit-log/types/AuditLog';

import { AppLink, Badge, Spinner, Text } from '@/design-system/atoms';
import {
  AvatarWithName,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/design-system/molecules';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';
import useAuditList from '@/domains/audit-log/api/query/useAuditList';

import { AuditTableProps } from './types/AuditTableProps';
import { isEqualDates } from './utils/AuditTableUtils';
import styles from './AuditTable.module.css';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

/**
 * The AuditTable component displays a paginated and sortable audit log table with customizable filters.
 * It fetches audit records based on given filter parameters such as timestamp range, success status, entity and identity IDs, and sorting preferences.
 *
 * @param auditTableProps - The properties for the AuditTable component.
 * @returns
 */
export const AuditTable = (auditTableProps: AuditTableProps) => {
  const t = useTranslations('AuditPage');
  const th = useTranslations('AuditPage.headers');

  const [page, setPage] = useState(auditTableProps.initialPage);
  const [pageSize, setPageSize] = useState(auditTableProps.initialPageSize);

  const [dataToDisplay, setDataToDisplay] = useState<AuditLog[]>([]);

  // Prepare parameters for the hook
  const params = useMemo(
    () => ({
      page: page,
      size: pageSize,
      timestampFrom: auditTableProps.timestampFrom,
      timestampTo: auditTableProps.timestampTo,
      success: auditTableProps.success,
      idOrEntityIdOrSessionId: auditTableProps.idOrEntityIdOrSessionId,
      identityId: auditTableProps.identityId,
      sort: auditTableProps.sort,
    }),
    [
      page,
      pageSize,
      auditTableProps.timestampFrom,
      auditTableProps.timestampTo,
      auditTableProps.success,
      auditTableProps.idOrEntityIdOrSessionId,
      auditTableProps.identityId,
      auditTableProps.sort,
    ],
  );

  // Define the table header keys for the settings popover
  const tableHeaderKeys = [
    { label: th('id'), value: 'id' },
    { label: th('authentication'), value: 'authentication' },
    { label: th('success'), value: 'success' },
    { label: th('timestamp'), value: 'timestamp' },
    { label: th('entityId'), value: 'entityId' },
    { label: th('domain'), value: 'domain' },
    { label: th('application'), value: 'application' },
    { label: th('component'), value: 'component' },
    { label: th('identityId'), value: 'identityId' },
    { label: th('sessionId'), value: 'sessionId' },
    { label: th('rbac'), value: 'rbac' },
    { label: th('abac'), value: 'abac' },
    { label: th('operation'), value: 'operation' },
  ];

  // Function to handle column visibility changes
  const visibleColumns: { [key: string]: boolean } = {
    id: true,
    timestamp: true,
    application: false,
    domain: false,
    component: false,
    identityId: false,
    entityId: true,
    sessionId: true,
    success: true,
    authentication: true,
    rbac: false,
    abac: false,
    operation: false,
  };

  // Custom hook to track previous values of timestampFrom and timestampTo
  function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined);
    useEffect(() => {
      ref.current = value;
    }, [value]);

    // Return the previous value (current value will be set on next render)
    return ref.current;
  }

  const prevFromDate = usePrevious(auditTableProps.timestampFrom);
  const prevToDate = usePrevious(auditTableProps.timestampTo);
  const prevPageSize = usePrevious(pageSize);
  const prevSuccess = usePrevious(auditTableProps.success);
  const prevEntityId = usePrevious(auditTableProps.idOrEntityIdOrSessionId);
  const prevIdentityId = usePrevious(auditTableProps.identityId);

  //handle filter changes and reset page if necessary
  useEffect(() => {
    const fromDateChanged =
      prevFromDate !== undefined && !isEqualDates(prevFromDate, auditTableProps.timestampFrom);
    const toDateChanged =
      prevToDate !== undefined && !isEqualDates(prevToDate, auditTableProps.timestampTo);
    const successChanged = prevSuccess !== undefined && auditTableProps.success !== prevSuccess;
    const entityIdChanged =
      prevEntityId !== undefined && auditTableProps.idOrEntityIdOrSessionId !== prevEntityId;
    const identityIdChanged =
      prevIdentityId !== undefined && auditTableProps.identityId !== prevIdentityId;

    if (
      fromDateChanged ||
      toDateChanged ||
      successChanged ||
      entityIdChanged ||
      identityIdChanged
    ) {
      setPage(0); // reset page only if filters changed (not initially)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auditTableProps.timestampFrom,
    auditTableProps.timestampTo,
    auditTableProps.success,
    auditTableProps.idOrEntityIdOrSessionId,
    auditTableProps.identityId,
  ]);

  // Update the page size in the parameters
  function handlePageSizeChange(newSize: string): void {
    const sizeChanged = prevPageSize !== undefined && newSize !== prevPageSize;
    if (sizeChanged) {
      setPageSize(newSize);
      setPage(0);
    }
  }

  // Update the current page in the parameters
  function handlePageChange(newPage: number): void {
    setPage(newPage - 1);
  }

  // Fetch audit logs with default parameters
  const {
    data: auditPageData,
    isFetching,
    isError,
  } = useAuditList(params, auditTableProps.shouldFetch);

  // If there's an error or the audit data is not found, render the Not Found page
  if (isError) notFound();

  useEffect(() => {
    let numberOfRecords = 0;
    if (auditPageData?.content) {
      setDataToDisplay(auditPageData.content);
      numberOfRecords = auditPageData.page.totalElements;
    }
    if (auditTableProps.onNumberOfRecordsChange) {
      auditTableProps.onNumberOfRecordsChange(numberOfRecords);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditPageData]);

  function composeCallBackQuery(auditTableProps: AuditTableProps): string {
    const params: string[] = [];
    if (auditTableProps.timestampFrom) {
      params.push(
        `timestampFrom=${encodeURIComponent(auditTableProps.timestampFrom.toISOString())}`,
      );
    }
    if (auditTableProps.timestampTo) {
      params.push(`timestampTo=${encodeURIComponent(auditTableProps.timestampTo.toISOString())}`);
    }
    if (auditTableProps.success === 'true' || auditTableProps.success === 'false') {
      params.push(`success=${encodeURIComponent(auditTableProps.success)}`);
    }
    if (auditTableProps.idOrEntityIdOrSessionId) {
      params.push(
        `idOrEntityIdOrSessionId=${encodeURIComponent(auditTableProps.idOrEntityIdOrSessionId)}`,
      );
    }
    if (auditTableProps.identityId) {
      params.push(`identityId=${encodeURIComponent(auditTableProps.identityId)}`);
    }

    if (params.length > 0) {
      return '&' + params.join('&');
    }

    return '';
  }

  return (
    <div className={styles.auditTableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Render table header cells based on visibility settings */}
            {tableHeaderKeys.map(
              (key) =>
                visibleColumns[key.value] && (
                  <TableCell
                    key={key.value}
                    isHeader
                    className={`${key.value === 'id' ? styles.cellId : ''} 
                    ${key.value === 'entityId' || key.value === 'sessionId' ? styles.cellEntity : ''}`}
                  >
                    <Text variant="body">{key.label}</Text>
                  </TableCell>
                ),
            )}
          </TableRow>
        </TableHead>

        <TableBody className={styles.tableBody}>
          {dataToDisplay.map((record: AuditLog, index: number) => (
            <TableRow key={`${record.id}-${index}`}>
              {tableHeaderKeys.map((key) => {
                if (!visibleColumns[key.value]) return null;
                let cellContent: React.ReactNode;
                switch (key.value) {
                  case 'id':
                    cellContent = (
                      <AppLink
                        link={`/audit-detail/${record.id}?page=${page}&pageSize=${pageSize}${composeCallBackQuery(auditTableProps)}`}
                        target="_self"
                        variant="primary"
                        id={`link-audit-id-${record.id}`}
                      >
                        <Text variant="subtitle">{record.id}</Text>
                      </AppLink>
                    );
                    break;

                  case 'timestamp':
                    cellContent = (
                      <Text regular>{new Date(record.timestamp).toLocaleString()}</Text>
                    );
                    break;

                  case 'success':
                    cellContent = record.success ? (
                      <Badge
                        color="lightGreen"
                        children={t('success')}
                        className={styles.badge}
                      ></Badge>
                    ) : (
                      <Badge color="red" children={t('failure')} className={styles.badge}></Badge>
                    );
                    break;

                  case 'authentication':
                    cellContent = (
                      <AvatarWithName
                        name={record.messageBody.authentication}
                        displayNameOnly={true}
                      />
                    );
                    break;

                  case 'rbac':
                    cellContent = record.messageBody.rbac || '-';
                    break;

                  case 'abac':
                    cellContent = record.messageBody.abac || '-';
                    break;

                  case 'operation':
                    cellContent = record.messageBody.operation || '-';
                    break;

                  default:
                    cellContent = (
                      <Text regular>{record[key.value as keyof AuditLog] as string}</Text>
                    );
                }

                return <TableCell key={key.value}>{cellContent}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TableFooter
        selectItems={PAGE_SIZE_OPTIONS}
        onSelectChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        pageCount={auditPageData?.page.totalPages ? auditPageData?.page.totalPages : 0}
        totalCount={auditPageData?.page.totalElements ?? 0}
        value={pageSize}
        currPage={page + 1} // current page is 0-based, so we add 1 for display
      />

      {isFetching && (
        <div className={styles.spinnerOverlay}>
          <Spinner fullScreen={false} />
        </div>
      )}
    </div>
  );
};
