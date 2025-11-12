import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { IInfo } from '@/core/assets/icons';
import { SortDirection } from '@/core/utils/types';
import { RequestDetailModel, WFState } from '@/domains/electronic-requests/api/services/types';
import { sortRequestRecords } from '@/domains/electronic-requests/utils';

import { PAGE_SIZE_OPTIONS, RequestsDataTable } from '../../RequestsDataTable/RequestsDataTable';
import RequestFilters from '../../RequestsFilter/RequestFilters';
import styles from '../RequestApproverTabs.module.css';

import { InlineMessage } from '@/design-system';

type TabKey = 'approver-tab-my-requests' | 'approver-tab-pending-approvals';
interface BaseRequestTabProps {
  requestsRecord: RequestDetailModel[];
  isLoading: boolean;
  tabKey: TabKey;
  inReview?: boolean;
}

function getEmptyStateMessage(t: (key: string) => string, tabKey: TabKey) {
  if (tabKey === 'approver-tab-my-requests') {
    return t('myRequests.noMyRequests');
  }

  return t('pendingApproval.noPendingRequests');
}

export const BaseRequestTab = ({
  requestsRecord,
  isLoading,
  tabKey,
  inReview = false,
}: BaseRequestTabProps) => {
  const t = useTranslations('requests.approver.tabs');
  const tRequestFilters = useTranslations('requests.filters');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [pageSize, setPageSize] = useState(Number(PAGE_SIZE_OPTIONS[0].value));
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showClosedRequests, setShowClosedRequests] = useQueryState('showClosedRequests', {
    history: 'replace',
    parse: (v) => v === 'true',
    serialize: (v) => (v ? 'true' : 'false'),
    defaultValue: false,
  });

  const [fullText] = useQueryState('fullText');
  const [responsibleUserId] = useQueryState('responsibleUserId');
  const [stateFilter] = useQueryState('stateFilter', {
    parse: (value) => value as WFState,
    serialize: (value) => value,
  });
  const [recipient] = useQueryState('recipient');

  const filteredData = useMemo(() => {
    return requestsRecord.filter((row: RequestDetailModel) => {
      if (!showClosedRequests && row.wfState.toLowerCase() === 'closed') {
        return false;
      }

      if (fullText) {
        const searchText = fullText.toLowerCase();
        const matchesId = row.id.toLowerCase().includes(searchText);
        const matchesDescription = row.description?.toLowerCase().includes(searchText);
        const matchesNumber = row.requestNumber
          ? row.requestNumber.toLowerCase().includes(searchText)
          : false;
        const matchesCreatedBy = `${row.createdBy.givenName} ${row.createdBy.surname}`
          .toLowerCase()
          .includes(searchText);
        const matchesRecipient = `${row.recipient.givenName} ${row.recipient.surname}`
          .toLowerCase()
          .includes(searchText);

        if (
          !(
            matchesId ||
            matchesDescription ||
            matchesNumber ||
            matchesCreatedBy ||
            matchesRecipient
          )
        ) {
          return false;
        }
      }

      if (responsibleUserId) {
        if (row.createdBy?.id !== responsibleUserId) {
          return false;
        }
      }

      if (recipient) {
        if (row.recipient?.id !== recipient) {
          return false;
        }
      }

      if (stateFilter) {
        if (row.wfState !== stateFilter) {
          return false;
        }
      }

      return true;
    });
  }, [requestsRecord, fullText, responsibleUserId, recipient, stateFilter, showClosedRequests]);

  const paginatedRecords = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const sortedData = sortRequestRecords(filteredData, sortColumn, sortDirection);

    const start = currentPage * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [filteredData, sortColumn, sortDirection, currentPage, pageSize]);

  const handleSort = useCallback((column: string, newDirection: SortDirection) => {
    setCurrentPage(0);
    setSortDirection(newDirection);
    setSortColumn(column);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setTotalCount(filteredData.length);
    } else {
      setTotalCount(0);
    }
  }, [filteredData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [showClosedRequests, responsibleUserId, recipient, stateFilter, fullText]);

  return (
    <div key={tabKey} className={styles.tabContent}>
      {tabKey === 'approver-tab-my-requests' && (
        <RequestFilters
          showClosedRequests={!!showClosedRequests}
          onShowClosedRequestsChange={setShowClosedRequests}
          t={tRequestFilters}
        />
      )}

      {!isLoading && paginatedRecords.length === 0 ? (
        <InlineMessage
          id="inline-message-empty-approval-requests"
          icon={<IInfo id="icon-table-inline-empty-approval-requests" width={20} height={20} />}
          centeredText
          message={getEmptyStateMessage(t, tabKey)}
        />
      ) : (
        <RequestsDataTable
          displayedRecords={paginatedRecords}
          isLoading={isLoading}
          sortDirection={sortDirection}
          handleSort={handleSort}
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          inReview={inReview}
        />
      )}
    </div>
  );
};
