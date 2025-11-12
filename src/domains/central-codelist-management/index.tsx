'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useRoles } from '@/core/providers/RolesProvider';
import { SortDirection } from '@/core/utils/types';
import {
  filterRecords,
  processTableData,
  sortRecords,
} from '@/domains/central-codelist-management/utils';

import { useCodeLists } from './api/query';
import { Codelist } from './api/services';
import { FilterState } from './components/CSCFilter';
import { CSCDataTable, CSCFilter, CscHeaderButtons } from './components';
import styles from './index.module.css';
import { TableRecord } from './types';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const types = [
  { value: 'Internal', label: 'Interní' },
  { value: 'InternalPaid', label: 'Interní - Placený' },
  { value: 'InternalPublic', label: 'Interní - Veřejný' },
  { value: 'External', label: 'Externí' },
].map((type) => ({
  value: type.label,
  label: type.label,
}));

const CSCPage = () => {
  const [pageSize, setPageSize] = useState(Number(PAGE_SIZE_OPTIONS[0].value));
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();
  const tContainer = useTranslations('CSCTabsContainer');

  const tStates = useTranslations('statuses');

  const [displayedRecords, setDisplayedRecords] = useState<TableRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    types: [],
    states: [],
    showSubconcepts: false,
  });
  const {
    data: codeData,
    isLoading: isCSCDataLoading,
    isError: isCSCDataError,
    isFetching: isFetchingCSCData,
  } = useCodeLists({ time: 'all' });
  const { cscReader, isLoadingRoles } = useRoles();
  const [sortColumn, setSortColumn] = useState<keyof TableRecord>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    name: true,
    type: true,
    status: true,
    validFrom: true,
  });

  const states = [
    { value: 'Aktivní', label: tStates('active') },
    { value: 'Plánovaný', label: tStates('planned') },
    { value: 'Koncept', label: tStates('concept') },
    { value: 'WaitingApproval', label: tStates('waitingforapproval') },
  ].map((state) => ({
    value: state.value,
    label: state.label,
  }));

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return tStates('active');
      case 'planned':
        return tStates('planned');
      case 'concept':
        return tStates('concept');
      case 'waitingforapproval':
        return tStates('waitingforapproval');
      case 'expired':
        return tStates('expired');
      case 'draft':
        return tStates('draft');
      default:
        return status;
    }
  };

  useEffect(() => {
    if (isLoadingRoles) return;
    if (!cscReader) {
      router.push('/');
    }
  }, [cscReader, isLoadingRoles, router]);

  useEffect(() => {
    let processedRecords: TableRecord[] = [];
    if (!isCSCDataError && !isCSCDataLoading && !isFetchingCSCData && codeData) {
      const tableItems = codeData.map((item: Codelist) => ({
        id: item.id,
        versions: item.versions && item.versions.length > 0 ? item.versions : [],
        drafts: item.drafts && item.drafts.length > 0 ? item.drafts : [],
      }));

      processedRecords = processTableData(tableItems, filters.showSubconcepts);
    }
    const filteredRecords = filterRecords(processedRecords, {
      search: filters.search,
      type: filters.types || '',
      state: filters.states || '',
      showSubconcepts: filters.showSubconcepts,
    });
    const sortedRecords = sortRecords(filteredRecords, sortColumn, sortDirection);

    setTotalCount(sortedRecords.length);

    const totalPages = Math.ceil(sortedRecords.length / pageSize);
    const validCurrentPage = Math.max(0, Math.min(currentPage, totalPages - 1));
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);

      return;
    }

    const startIndex = validCurrentPage * pageSize;
    const endIndex = startIndex + pageSize;

    setDisplayedRecords(sortedRecords.slice(startIndex, endIndex));
  }, [
    currentPage,
    pageSize,
    filters,
    sortDirection,
    sortColumn,
    visibleColumns,
    codeData,
    isCSCDataError,
    isCSCDataLoading,
    isFetchingCSCData,
    visibleColumns,
  ]);

  const handleSort = useCallback((column: keyof TableRecord, newDirection: SortDirection) => {
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

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(0);
  }, []);

  const getVersionType = (versionType: string) => {
    switch (versionType) {
      case 'Internal':
        return tContainer('filter.types.internal');
      case 'InternalPaid':
        return tContainer('filter.types.internalPaid');
      case 'InternalPublic':
        return tContainer('filter.types.internalPublic');
      case 'External':
        return tContainer('filter.types.external');
      default:
        return '';
    }
  };

  return (
    <div className={styles.cscPage}>
      <CscHeaderButtons />
      <CSCFilter
        showSubconceptsFilter={true}
        onFilterChange={handleFilterChange}
        types={types}
        states={states}
      />
      <CSCDataTable
        displayedRecords={displayedRecords}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        sortDirection={sortDirection}
        handleSort={handleSort}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        filters={filters}
        getVersionType={getVersionType}
        translateStatus={translateStatus}
        isLoading={isCSCDataLoading || isFetchingCSCData}
      />
    </div>
  );
};

export default CSCPage;
