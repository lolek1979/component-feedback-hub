'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { SortDirection } from '@/core/utils/types';
import { Input } from '@/design-system/atoms';

import { getStatusLabel, getStatusVariant } from '../../services/utils';
import { ComplaintRecord, LimitsCopaymentsTable } from '../LimitsCopaymentsTable';
import styles from './AssessmentTab.module.css';

const mockBORecords: ComplaintRecord[] = [
  {
    id: '1',
    name: '1234567890-2024',
    firstName: 'Michal',
    lastName: 'Novák',
    status: 'registered',
    result: '-',
    assignedGroup: 'OSK_BO',
    assignee: '-',
    regionalOffice: 'Benešov',
    created: '18.2.2025',
    period: '18.2.2025',
  },
  {
    id: '2',
    name: '1614182356-2024',
    firstName: 'Petr',
    lastName: 'Lopenz',
    status: 'in-progress',
    result: 'Schváleno',
    assignedGroup: 'OSK_BO',
    assignee: 'František Omáčka',
    regionalOffice: 'Benešov',
    created: '18.2.2025',
    period: '18.2.2025',
  },
];

interface AssessmentTabProps {
  isError?: boolean;
  isLoading?: boolean;
  error?: {
    status: string | number;
    message?: string;
  };
  onRetry?: () => void;
}

export const AssessmentTab = ({ isLoading = false }: AssessmentTabProps) => {
  const t = useTranslations('KDPPage');
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [sortColumn, setSortColumn] = useState<keyof ComplaintRecord | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    name: true,
    firstName: true,
    status: true,
    result: true,
    assignedGroup: true,
    assignee: true,
    regionalOffice: true,
    created: true,
    period: true,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredRecords = mockBORecords.filter((record) =>
    record.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSort = (column: keyof ComplaintRecord, newDirection: SortDirection) => {
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortColumn || sortDirection === 'none') return 0;

    const aValue = a[sortColumn] ?? '';
    const bValue = b[sortColumn] ?? '';

    const compareResult = aValue
      .toString()
      .localeCompare(bValue.toString(), 'cs', { sensitivity: 'base' });

    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrentPage(0);
  };

  const paginatedRecords = sortedRecords.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <Input
          type="text"
          id="input-bo-search"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={t('assessmentTab.searchPlaceholder')}
          secondaryIcon={
            <SearchIcon
              id="icon-bo-search"
              width={17}
              height={17}
              role="button"
              aria-label={t('assessmentTab.searchAriaLabel')}
            />
          }
        />
      </div>

      <LimitsCopaymentsTable
        displayedRecords={paginatedRecords}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        sortDirection={sortDirection}
        handleSort={handleSort}
        totalCount={sortedRecords.length}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        getStatusVariant={getStatusVariant}
        getStatusLabel={getStatusLabel}
        isLoading={isLoading}
        isCLDComplAppr={true}
        footer={true}
      />
    </div>
  );
};
