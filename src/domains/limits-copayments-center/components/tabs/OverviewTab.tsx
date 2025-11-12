'use client';

import React from 'react';

import Iinfo from '@/core/assets/icons/info.svg';
import { formatNumber } from '@/core/auth/utils';
import { InlineMessage, Typography } from '@/design-system/molecules';

import { SuklDataResponse } from '../../api/services/getSuklData';
import styles from '../../index.module.css';
import { TGroupedData } from '../../services/utils';
import KDPTables from '../KDPTables';
import { DateRangeHeader, SearchPrescriptionContainer } from '../';
import { FeesPageProps } from './types';

type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;

interface OverviewTabProps {
  // Data props
  suklDataRows: TGroupedData | null;
  suklData: SuklDataResponse | null | undefined;
  period: string;
  year: number;
  sumInsuer: number;
  sumVZP: number;

  // Loading states
  isSuklDataLoading: boolean;
  isFetchingSuklData: boolean;
  isInsInitialized: boolean;
  withPrevData: boolean;

  // Error states
  isSuklDataError: boolean;

  // Search states
  searchData: TGroupedData | null;
  identifier: string;
  totalCount: number;

  // Props for other components
  feesPageProps: FeesPageProps;
  showDetails: boolean;

  // Event handlers
  onShowDetailsChange: (value: boolean) => void;

  // Translations
  translations: {
    t: TranslationFunction;
    tErrors: TranslationFunction;
  };
}

export const OverviewTab = ({
  suklDataRows,
  suklData,
  period,
  year,
  sumInsuer,
  sumVZP,
  isSuklDataLoading,
  isFetchingSuklData,
  withPrevData,
  isSuklDataError,
  searchData,
  identifier,
  feesPageProps,
  showDetails,
  onShowDetailsChange,
  translations: { t, tErrors },
}: OverviewTabProps) => {
  return (
    <div className={styles.resultContainer}>
      {!(isSuklDataError || suklData?.error) && (
        <SearchPrescriptionContainer
          feesPageProps={feesPageProps}
          isLoading={isSuklDataLoading}
          onDownload={feesPageProps.onDownload}
          onPrint={feesPageProps.onPrint}
          selectedYear={feesPageProps.selectedYear}
          selectedMonth={feesPageProps.selectedMonth}
          searchQuery={feesPageProps.searchQuery}
          onYearChange={feesPageProps.onYearChange}
          onMonthChange={feesPageProps.onMonthChange}
          onSearchChange={feesPageProps.onSearchChange}
          showDetails={showDetails}
          onShowDetailsChange={onShowDetailsChange}
        />
      )}

      {!(isSuklDataError || suklData?.error) && (
        <div className={styles.resultHeader}>
          <DateRangeHeader dateRange={period} dataSource={t('bodyTitle')} />
          <div className={styles.sumContainer}>
            <div className={styles.sumItem}>
              <Typography variant="Subtitle/Default/Regular" className={styles.itemText}>
                {t('sumInsuer')} {year.toString()}:
              </Typography>
              <Typography variant="Subtitle/Default/Bold">{formatNumber(sumInsuer)}</Typography>
            </div>
            <div className={styles.sumItem}>
              <Typography variant="Subtitle/Default/Regular" className={styles.itemText}>
                {t('sumVZP')} {year.toString()}:
              </Typography>
              <Typography variant="Subtitle/Default/Bold">{formatNumber(sumVZP)}</Typography>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        {suklDataRows && ((!isSuklDataLoading && !isFetchingSuklData) || withPrevData) && (
          <KDPTables suklDataRows={suklDataRows} year={year} showDetails={showDetails} />
        )}
      </div>

      {/* Show "no data found" message only when there's actually no data */}
      {((suklData?.payload?.totalCount === 0 && !identifier) ||
        (identifier &&
          searchData &&
          typeof searchData === 'object' &&
          Object.keys(searchData).length === 0) ||
        (identifier && !searchData)) && (
        <div className={`${styles.errorContainer} ${styles.inDataSection}`}>
          <InlineMessage
            id="inline-message-cld-info-not-data-found"
            icon={
              <Iinfo
                id="icon-cld-info-no-data-found"
                width={20}
                height={20}
                className="icon_blue-700"
              />
            }
            message={tErrors('notFound')}
            variant="info"
            className={styles.inlineMessage}
          />
        </div>
      )}
    </div>
  );
};
