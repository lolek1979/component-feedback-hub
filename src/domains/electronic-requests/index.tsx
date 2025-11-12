'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import Iinfo from '@/core/assets/icons/info.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { SortDirection } from '@/core/utils/types';
import { InlineMessage, Typography } from '@/design-system/molecules';

import { useRequests, useRequestsUsers } from './api/query';
import { OrderBy, RequestDetailModel, RequestRole, WFState } from './api/services/types';
import { useRequestsUserRoles } from './hooks/useRequestsUserRoles';
import { RequestApproverTabs } from './partials/RequestApproverTabs/RequestApproverTabs';
import { RequestsDataTable } from './partials/RequestsDataTable/RequestsDataTable';
import styles from './partials/RequestsDataTable/RequestsDataTable.module.css';
import RequestFilters from './partials/RequestsFilter/RequestFilters';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const columnToOrderByMap: Record<string, OrderBy> = {
  createdAt: 'Created',
  id: 'RequestNumber',
};

const RequestPage = () => {
  const t = useTranslations('requests');
  const tRequestFilters = useTranslations('requests.filters');

  const router = useRouter();
  const { requestsReader, isLoadingRoles } = useRoles();
  const queryClient = useQueryClient();

  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [pageSize, setPageSize] = useState(Number(PAGE_SIZE_OPTIONS[0].value));
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { roles } = useRequestsUserRoles();
  const isApprover = roles.isApprover;

  const { data: userData, isLoading: isLoadingUser } = useRequestsUsers();

  const userRole = useMemo<RequestRole>(() => {
    if (!userData?.payload) return 'requester';

    return 'requester';
  }, [userData]);

  useEffect(() => {
    if (!isLoadingRoles && !requestsReader) {
      router.push('/');
    }
  }, [requestsReader, isLoadingRoles, router]);

  const [fullText] = useQueryState('fullText');
  const [responsibleUserId] = useQueryState('responsibleUserId');
  const [stateFilter] = useQueryState('stateFilter', {
    parse: (value) => value as WFState,
    serialize: (value) => value,
  });
  const [requester] = useQueryState('requester');
  const [recipient] = useQueryState('recipient');
  const [approverFilter] = useQueryState('approver');
  const [costCenterFilter] = useQueryState('costCenter');
  const [selectedTab, setSelectedTab] = useState<string>('tab-approver-pending-approvals');

  const [showClosedRequests, setShowClosedRequests] = useQueryState('showClosedRequests', {
    history: 'replace',
    parse: (v) => v === 'true',
    serialize: (v) => (v ? 'true' : 'false'),
    defaultValue: false,
  });

  const skip = currentPage * pageSize;

  const apiOrderBy = columnToOrderByMap[sortColumn] || 'Created';
  const apiAscending = sortDirection === 'asc';

  const getStateFilterForAPI = useMemo(() => {
    if (!stateFilter) return undefined;

    const stateGroups: Record<string, WFState[]> = {
      PendingApprove1: ['PendingApprove1', 'PendingApprove2'],
    };

    if (stateFilter === 'Withdrawn' && !showClosedRequests) {
      return [stateFilter];
    }

    return stateGroups[stateFilter] || [stateFilter];
  }, [stateFilter, showClosedRequests]);

  const { data: requestsResponse, isLoading: isLoadingRequests } = useRequests({
    role: userRole,
    enabled: !isLoadingUser,
    take: pageSize,
    skip,
    order: apiOrderBy,
    ascending: apiAscending,
    includeClosed: true,
    createdById: responsibleUserId || undefined,
    recipientId: recipient || undefined,
    approverId: approverFilter || undefined,
    costCenterId: costCenterFilter || undefined,
    stateFilter: getStateFilterForAPI,
    requestNumber: fullText || undefined,
  });

  const { data: allRequestsForFilters } = useRequests({
    role: userRole,
    enabled: !isLoadingUser,
    take: 1000,
    skip: 0,
    order: 'Created',
    ascending: false,
    includeClosed: true,
  });

  useEffect(() => {
    if (requestsResponse?.payload) {
      setTotalCount(requestsResponse.payload.total);
    }
  }, [requestsResponse]);

  const isLoading = isLoadingUser || isLoadingRequests;

  const requestsRecord = useMemo(() => requestsResponse?.payload?.items ?? [], [requestsResponse]);

  const approverOptions = useMemo(() => {
    const approverMap: { [key: string]: string } = {};

    const sourceData = allRequestsForFilters?.payload?.items ?? requestsRecord;

    sourceData.forEach((item) => {
      if (item.approver?.id != null && item.approver?.givenName) {
        const fullName = `${item.approver.givenName} ${item.approver.surname}`.trim();
        if (fullName) {
          approverMap[item.approver.id] = fullName;
        }
      }
    });

    return Object.entries(approverMap).map(([id, name]) => ({ id, name }));
  }, [allRequestsForFilters, requestsRecord]);

  const userOptions = useMemo(() => {
    const usersMap: { [key: string]: string } = {};
    const sourceData = allRequestsForFilters?.payload?.items ?? requestsRecord;

    sourceData.forEach((item) => {
      if (item.createdBy?.id != null && item.createdBy?.givenName) {
        const fullName = `${item.createdBy.givenName} ${item.createdBy.surname}`.trim();
        if (fullName) {
          usersMap[item.createdBy.id] = fullName;
        }
      }
    });

    return Object.entries(usersMap).map(([id, name]) => ({ id, name }));
  }, [allRequestsForFilters, requestsRecord]);

  const recipientOptions = useMemo(() => {
    const forMap: { [key: string]: string } = {};
    const sourceData = allRequestsForFilters?.payload?.items ?? requestsRecord;

    sourceData.forEach((item) => {
      if (item.recipient?.id != null && item.recipient?.givenName) {
        const fullName = `${item.recipient.givenName} ${item.recipient.surname}`.trim();
        if (fullName) {
          forMap[item.recipient.id] = fullName;
        }
      }
    });

    return Object.entries(forMap).map(([id, name]) => ({ id, name }));
  }, [allRequestsForFilters, requestsRecord]);

  const costCenterOptions = useMemo(() => {
    const costCenterMap: { [key: string]: string } = {};
    const sourceData = allRequestsForFilters?.payload?.items ?? requestsRecord;

    sourceData.forEach((item) => {
      if (item.costCenter?.id != null && item.costCenter?.description) {
        costCenterMap[item.costCenter.id] = item.costCenter.description;
      }
    });

    return Object.entries(costCenterMap).map(([id, name]) => ({ id, name }));
  }, [allRequestsForFilters, requestsRecord]);

  const filteredData = useMemo(() => {
    return requestsRecord.filter((row: RequestDetailModel) => {
      if (requester) {
        const fullName = `${row.createdBy.givenName} ${row.createdBy.surname}`.toLowerCase();
        if (!fullName.includes(requester.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [requestsRecord, requester]);

  useEffect(() => {
    setCurrentPage(0);
  }, [
    showClosedRequests,
    responsibleUserId,
    recipient,
    approverFilter,
    costCenterFilter,
    stateFilter,
    fullText,
  ]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['requests'],
    });
  }, [
    showClosedRequests,
    responsibleUserId,
    recipient,
    approverFilter,
    costCenterFilter,
    stateFilter,
    fullText,
    queryClient,
  ]);

  const handleSort = useCallback((column: string, newDirection: SortDirection) => {
    setSortDirection(newDirection);
    setSortColumn(column);
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    setCurrentPage(0);
  }, []);

  return (
    <div className={`${isApprover ? '' : styles.requestsPage}`}>
      {isApprover ? (
        <RequestApproverTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      ) : (
        <>
          <RequestFilters
            showClosedRequests={!!showClosedRequests}
            onShowClosedRequestsChange={setShowClosedRequests}
            t={tRequestFilters}
            userOptions={userOptions}
            recipientOptions={recipientOptions}
            approverOptions={approverOptions}
            costCenterOptions={costCenterOptions}
          />

          {!isLoading && requestsRecord.length === 0 ? (
            <InlineMessage
              id="inline-message-empty-requests"
              icon={<Iinfo id="icon-table-inline-empty-requests" width={20} height={20} />}
              variant="default"
              centeredText
            >
              <Typography variant="Subtitle/Default/Bold"> {t('emptyRequestsMessage')}</Typography>
            </InlineMessage>
          ) : (
            <RequestsDataTable
              displayedRecords={filteredData}
              isLoading={isLoading}
              sortDirection={sortDirection}
              handleSort={handleSort}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RequestPage;
