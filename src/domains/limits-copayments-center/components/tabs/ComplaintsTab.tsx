'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import IError from '@/core/assets/icons/block.svg';
import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { SortDirection } from '@/core/utils/types';
import { Button, Input, Text } from '@/design-system/atoms';
import { InlineMessage, Typography } from '@/design-system/molecules';

import styles from '../../index.module.css';
import {
  getErrorMessage,
  getStatusLabel,
  getStatusVariant,
  showRetryButton,
} from '../../services/utils';
import { useUserInfo } from '../../stores';
import { ComplaintRecord, LimitsCopaymentsTable } from '../LimitsCopaymentsTable';
import { ComplaintsModal } from './ComplaintsModal';
import complaintsStyles from './ComplaintsTab.module.css';

const mockComplaints: ComplaintRecord[] = [
  { id: '1', name: '1234567890-2024', status: 'registered', created: '18.2.2025', period: '2024' },
  { id: '2', name: '1234567890-2023', status: 'cancelled', created: '12.1.2025', period: '2024' },
  { id: '3', name: '9876543210-2024', status: 'resolved', created: '5.3.2025', period: '2024' },
  {
    id: '4',
    name: '5555555555-2023',
    status: 'in-progress',
    created: '20.12.2024',
    period: '2023',
  },
  { id: '5', name: '3333333333-2024', status: 'registered', created: '15.2.2025', period: '2024' },
];

interface ComplaintsTabProps {
  isError?: boolean;
  isLoading?: boolean;
  error?: {
    status: string | number;
    message?: string;
  };
  onRetry?: () => void;
}

export const ComplaintsTab = ({
  isError = false,
  isLoading = false,
  error,
  onRetry,
}: ComplaintsTabProps) => {
  const t = useTranslations('KDPPage');
  const tErrors = useTranslations('KDPPage.errors');
  const { hasUserInfo } = useUserInfo();
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [sortColumn, setSortColumn] = useState<keyof ComplaintRecord | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    name: true,
    status: true,
    created: true,
    period: true,
  });

  if (!hasUserInfo) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.errorContainer}>
          <Typography variant="Body/Regular">{t('complaintsTab.noInsuredInfo')}</Typography>
        </div>
      </div>
    );
  }

  const handleClearSearchValue = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setSearchValue('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const filteredComplaints = mockComplaints.filter((complaint) =>
    complaint.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSort = (column: keyof ComplaintRecord, newDirection: SortDirection) => {
    setSortDirection(newDirection);
    setSortColumn(column);
  };

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
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

  const paginatedComplaints = sortedComplaints.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  const handleComplaintSubmit = (data: any) => {
    // TODO: Implement actual submission logic
  };

  return (
    <div className={styles.resultContainer}>
      <ComplaintsModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onSubmit={handleComplaintSubmit}
      />

      {/* Display error message */}
      {isError && error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorContainerInner}>
            <InlineMessage
              id="inline-message-complaints-error"
              icon={
                <IError
                  id="icon-complaints-error"
                  className={styles.iconError}
                  width={24}
                  height={24}
                />
              }
              message={getErrorMessage(error, tErrors)}
              variant="error"
              className={styles.errorMessage}
            />
            {showRetryButton(error) && onRetry && (
              <Button
                id="button-complaints-try-again"
                variant="oncolor"
                size="small"
                onClick={onRetry}
                style={{ border: 'none' }}
              >
                <Text variant="subtitle">{t('tryAgain')}</Text>
              </Button>
            )}
          </div>
        </div>
      )}

      {!isError && (
        <>
          <div className={complaintsStyles.container}>
            <div className={complaintsStyles.searchWrapper}>
              <Input
                type="text"
                id="input-complaints-search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t('complaintsTab.searchPlaceholder')}
                icon={
                  searchValue.length > 0 && (
                    <CloseIcon
                      id="icon-search-complain-close"
                      role="button"
                      aria-label={t('clear')}
                      onClick={handleClearSearchValue}
                      style={{ cursor: 'pointer' }}
                    />
                  )
                }
                secondaryIcon={
                  <SearchIcon
                    id="icon-complaints-search"
                    width={17}
                    height={17}
                    role="button"
                    aria-label={t('complaintsTab.searchAriaLabel')}
                  />
                }
              />
            </div>
            <div className={complaintsStyles.buttonWrapper}>
              <Button id="button-complaints-new" variant="primary" onClick={handleButtonClick}>
                {t('complaintsTab.newComplaint')}
              </Button>
            </div>
          </div>

          <LimitsCopaymentsTable
            displayedRecords={paginatedComplaints}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            sortDirection={sortDirection}
            handleSort={handleSort}
            totalCount={sortedComplaints.length}
            pageSize={pageSize}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            getStatusVariant={getStatusVariant}
            getStatusLabel={getStatusLabel}
            isLoading={isLoading}
            footer={false}
          />
        </>
      )}
    </div>
  );
};
