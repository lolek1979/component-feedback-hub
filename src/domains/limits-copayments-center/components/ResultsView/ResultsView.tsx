'use client';

import React, { ReactElement, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import IError from '@/core/assets/icons/block.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { Button, Divider, Skeleton, Spinner, Tab, Text } from '@/design-system/atoms';
import { InlineMessage } from '@/design-system/molecules';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';

import { SuklDataResponse } from '../../api/services/getSuklData';
import { TGroupedData } from '../../services/utils';
import { KdpResultHeader } from '../KdpResultHeader';
import {
  AssessmentTab,
  ComplaintsTab,
  InsuredPersonsTab,
  JudgmentTab,
  OverviewTab,
  StatementTab,
} from '../tabs';
import { FeesPageProps } from '../tabs/types';
import styles from './ResultsView.module.css';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
];

interface ResultsViewProps {
  // Header props
  insuranceNum: string;
  name?: string;
  surchargeReverseBalance?: number;
  surchargeLimit?: number;
  dayLimitReached: string;
  onBreadcrumbClick: () => void;

  // Tab props
  activeTab: 'overview' | 'complaints' | 'assessment' | 'insuredPersons' | 'statement' | 'judgment';
  onTabChange: (
    tab: 'overview' | 'complaints' | 'assessment' | 'insuredPersons' | 'statement' | 'judgment',
  ) => void;

  // Error handling
  isSuklDataError: boolean;
  suklDataError?: {
    status: number | string;
    message: string;
  };
  isFetchingSuklData: boolean;
  showVZPError: boolean;
  vzpErrorMessage: string | null;
  limitsErrorMessage: string | null;
  displayedErrorMessage: string;
  showRetryButton: boolean;
  onRetry: () => void;

  // Loading states
  isHeaderLoading: boolean;
  isContentLoading: boolean;
  isInsInitialized: boolean;
  withPrevData: boolean;

  // Overview tab props
  suklDataRows: TGroupedData | null;
  suklData: SuklDataResponse | null | undefined;
  period: string;
  year: number;
  sumInsuer: number;
  sumVZP: number;
  searchData: TGroupedData | null;
  identifier: string;
  totalCount: number;
  feesPageProps: FeesPageProps;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;

  // Pagination props
  pageSize: number;
  currentPage: number;
  paginationCount: number;
  onPageSizeChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
  showLoadMoreButton: boolean;
}

/**
 * ResultsView component for displaying insurance limits and copayments data
 *
 * This component renders the results view for the limits and copayments center.
 * It includes:
 * - A header with insurance information and breadcrumb navigation
 * - Tab navigation between Overview and Complaints tabs
 * - Error handling and display with retry functionality
 * - Loading states with skeletons
 * - Data tables with pagination
 * - Load more functionality for incremental data loading
 *
 * @component
 * @param {ResultsViewProps} props - The component props
 * @returns {ReactElement} The rendered ResultsView component
 *
 * @example
 * ```tsx
 * <ResultsView
 *   insuranceNum="1234567890"
 *   name="John Doe"
 *   activeTab="overview"
 *   onTabChange={(tab) => setActiveTab(tab)}
 *   onBreadcrumbClick={() => navigate('/')}
 *   // ... other props
 * />
 * ```
 */
export const ResultsView = (props: ResultsViewProps): ReactElement => {
  const {
    insuranceNum,
    name,
    surchargeReverseBalance,
    surchargeLimit,
    dayLimitReached,
    onBreadcrumbClick,
    activeTab,
    onTabChange,
    isSuklDataError,
    suklDataError,
    isFetchingSuklData,
    showVZPError,
    vzpErrorMessage,
    limitsErrorMessage,
    displayedErrorMessage,
    showRetryButton,
    onRetry,
    isHeaderLoading,
    isContentLoading,
    isInsInitialized,
    withPrevData,
    suklDataRows,
    suklData,
    period,
    year,
    sumInsuer,
    sumVZP,
    searchData,
    identifier,
    totalCount,
    feesPageProps,
    showDetails,
    onShowDetailsChange,
    pageSize,
    currentPage,
    paginationCount,
    onPageSizeChange,
    onPageChange,
    onLoadMore,
    showLoadMoreButton,
  } = props;
  const t = useTranslations('KDPPage');
  const tErrors = useTranslations('KDPPage.errors');
  const { suklReader, CLDComplAppr } = useRoles();
  const searchParams = useSearchParams();
  const isCLDDebugMode = useMemo(() => searchParams.get('cld') === 'true', [searchParams]);

  return (
    <>
      {/* VZP Error at the top */}
      {showVZPError && vzpErrorMessage && (
        <div className={styles.errorContainer}>
          <div className={styles.errorContainerInner}>
            <InlineMessage
              id="inline-message-cld-error-not-insured-by-vzp"
              icon={
                <IError
                  id="icon-cld-error-not-insured-by-vzp"
                  className="icon_red-400"
                  width={24}
                  height={24}
                />
              }
              message={vzpErrorMessage}
              variant="error"
              className={styles.errorMessage}
            />
          </div>
        </div>
      )}

      {/* Result Header */}
      <div className={styles.resultHeaderContainer}>
        <KdpResultHeader
          insuranceNum={insuranceNum}
          isLoading={isHeaderLoading}
          name={name}
          hasToPayTotal={surchargeReverseBalance}
          limit={surchargeLimit}
          dayLimitReached={dayLimitReached}
          error={!!(isSuklDataError || suklDataError)}
          showBreadcrumbs={true}
          breadcrumbTitle={t('title')}
          onBreadcrumbClick={onBreadcrumbClick}
          showActions={true}
        />
      </div>
      <Divider />

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div role="tablist" className={styles.tabList}>
          {(CLDComplAppr && !suklReader) || isCLDDebugMode ? (
            <>
              <Tab
                id="tab-for-assessment"
                selected={activeTab === 'assessment'}
                onChange={() => onTabChange('assessment')}
              >
                {t('tabs.assessment')}
              </Tab>
              <Tab
                id="tab-insured-persons"
                selected={activeTab === 'insuredPersons'}
                onChange={() => onTabChange('insuredPersons')}
              >
                {t('tabs.insuredPersons')}
              </Tab>
              <Tab
                id="tab-statement"
                selected={activeTab === 'statement'}
                onChange={() => onTabChange('statement')}
              >
                {t('tabs.statement')}
              </Tab>
              <Tab
                id="tab-judgment"
                selected={activeTab === 'judgment'}
                onChange={() => onTabChange('judgment')}
              >
                {t('tabs.judgment')}
              </Tab>
            </>
          ) : (
            <>
              <Tab
                id="tab-overview"
                selected={activeTab === 'overview'}
                onChange={() => onTabChange('overview')}
              >
                {t('tabs.overview')}
              </Tab>
              <Tab
                id="tab-complaints"
                selected={activeTab === 'complaints'}
                onChange={() => onTabChange('complaints')}
              >
                {t('tabs.complaints')}
              </Tab>
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {(CLDComplAppr && !suklReader) || isCLDDebugMode ? (
        <>
          {/* CLDComplAppr specific tabs */}
          {activeTab === 'assessment' ? (
            <AssessmentTab />
          ) : activeTab === 'insuredPersons' ? (
            <InsuredPersonsTab />
          ) : activeTab === 'statement' ? (
            <StatementTab />
          ) : (
            <JudgmentTab />
          )}
        </>
      ) : activeTab === 'overview' ? (
        <>
          {/* Loading skeleton */}
          {isContentLoading && (
            <div className={styles.loadingContainer}>
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="366px" />
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="366px" />
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="717px" />
              <Skeleton maxWidth="366px" />
            </div>
          )}

          {/* Display error message */}
          {displayedErrorMessage && (
            <div className={styles.errorContainer}>
              <div className={styles.errorContainerInner}>
                <InlineMessage
                  id="inline-message-cld-error-retry-button"
                  icon={
                    <IError
                      id="icon-cld-error-retry-button"
                      className={styles.iconError}
                      width={24}
                      height={24}
                    />
                  }
                  message={displayedErrorMessage}
                  variant="error"
                  className={styles.errorMessage}
                />
                {showRetryButton && (
                  <Button
                    id="button-cld-page-try-again"
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

          {/* Limits error message */}
          {limitsErrorMessage && (
            <div className={styles.errorContainer}>
              <div className={styles.errorContainerInner}>
                <InlineMessage
                  id="inline-message-cld-error-limits"
                  icon={
                    <IError
                      id="icon-cld-error-limits"
                      className={styles.iconError}
                      width={24}
                      height={24}
                    />
                  }
                  message={limitsErrorMessage}
                  variant="error"
                  className={styles.errorMessage}
                />
              </div>
            </div>
          )}

          {/* Main content using OverviewTab component */}
          <OverviewTab
            suklDataRows={suklDataRows}
            suklData={suklData}
            period={period}
            year={year}
            sumInsuer={sumInsuer}
            sumVZP={sumVZP}
            isSuklDataLoading={false}
            isFetchingSuklData={isFetchingSuklData}
            isInsInitialized={isInsInitialized}
            withPrevData={withPrevData}
            isSuklDataError={isSuklDataError}
            searchData={searchData}
            identifier={identifier}
            totalCount={totalCount}
            feesPageProps={feesPageProps}
            showDetails={showDetails}
            onShowDetailsChange={onShowDetailsChange}
            translations={{ t, tErrors }}
          />

          {/* Table footer and pagination */}
          {totalCount > 0 && isInsInitialized && (
            <div>
              <TableFooter
                selectItems={PAGE_SIZE_OPTIONS}
                onSelectChange={onPageSizeChange}
                onPageChange={onPageChange}
                pageCount={Math.ceil(paginationCount / pageSize)}
                totalCount={paginationCount}
                value={pageSize.toString()}
                currPage={currentPage}
              />
              {showLoadMoreButton && (
                <div className={styles.nextBtnWrapper}>
                  <Button
                    id="button-cld-page-load-more"
                    onClick={onLoadMore}
                    disabled={isFetchingSuklData}
                    icon={isFetchingSuklData && <Spinner width={24} height={24} />}
                  >
                    {t('loadMore')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <ComplaintsTab
          isError={isSuklDataError || !!suklDataError}
          error={suklDataError}
          onRetry={onRetry}
        />
      )}
    </>
  );
};
