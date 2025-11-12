'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/core/config';
import { useRoles } from '@/core/providers/RolesProvider';

import { ResultsView } from './components/ResultsView';
import { SearchView } from './components/SearchView';
import { useFeesPageLogic } from './hooks/useFeesPageLogic';
import styles from './index.module.css';
import { useUserInfoStore } from './stores';

const VZP_ERROR_CODES = ['SUK-10001', 'SUK-10002'];

const FeesPage = () => {
  const { suklReader, isLoadingRoles } = useRoles();
  const router = useRouter();

  const {
    // State
    insuranceNum,
    activeTab,
    showResults,
    year,
    month,
    identifierValue,
    identifier,
    isInsInitialized,
    withPrevData,
    pageSize,
    currentPage,
    skip,
    totalCount,
    sumVZP,
    sumInsuer,
    searchData,
    downloadDate,
    showDetails,
    period,
    paginationCount,

    // API data
    suklData,
    isSuklDataLoading,
    isSuklDataError,
    isFetchingSuklData,
    suklLimits,
    isSuklLimitsLoading,
    insuredDetail,
    isInsuredDetailLoading,
    surchargeLimit,
    surchargeReverseBalance,

    // Computed data
    parsedSuklData,
    suklDataRows,

    // Handlers
    searchInsurance,
    handleBackToSearch,
    handleRetry,
    handleLoadMore,
    handleOnPrint,
    handleYearChange,
    handleMonthChange,
    handleSearchChange,
    handlePageSizeChange,
    handlePageChange,
    setActiveTab,
    setShowDetails,
    refetchSuklLimits,

    // Utility functions
    getDisplayedErrorMessage,
    getErrorCode,
    getLimitsErrorMessage,
    getDayLimitReached,
    getLastDispensingDate,
    showRetryButton,

    // Translations
    t,
    tErrors,
    tKDPResultHeader,
    tTable,
  } = useFeesPageLogic();

  useEffect(() => {
    if (isLoadingRoles) return;
    if (!suklReader) {
      router.push(ROUTES.HOME);
    }
  }, [isLoadingRoles, router, suklReader]);
  const { setUserInfo } = useUserInfoStore();
  useEffect(() => {
    if (!isInsuredDetailLoading && insuredDetail && insuredDetail.payload) {
      setUserInfo({
        userData: insuredDetail.payload,
        limit: surchargeLimit,
        hasToPayTotal: surchargeReverseBalance,
        dayLimitReached: getDayLimitReached(),
      });
    }
  }, [
    getDayLimitReached,
    insuranceNum,
    insuredDetail,
    isInsuredDetailLoading,
    setUserInfo,
    surchargeLimit,
    surchargeReverseBalance,
  ]);
  // Build feesPageProps for OverviewTab
  const feesPageProps = {
    suklData: (identifier && searchData ? searchData : parsedSuklData)!,
    period: period,
    translations: {
      t,
      tKDPResultHeader,
      tTable,
      tErrors,
    },
    suklLimits: suklLimits || undefined,
    insuranceNum,
    hasToPayTotal: surchargeReverseBalance ? surchargeReverseBalance : undefined,
    downloadDate: downloadDate,
    sumInsuer: sumInsuer,
    sumVZP: sumVZP,
    year: year,
    dayLimitReached: getDayLimitReached(),
    noDataMessage: suklData?.payload?.totalCount === 0,
    isFormerVZPClient: VZP_ERROR_CODES.includes(String(suklLimits?.messages?.[0]?.code)),
    formerVZPMessage: VZP_ERROR_CODES.includes(String(suklLimits?.messages?.[0]?.code))
      ? tErrors('noVZPAnyMoreError') + getLastDispensingDate() + '.'
      : null,
    onDownload: () => handleOnPrint(true),
    onPrint: (orientation: 'portrait' | 'landscape') => handleOnPrint(false, orientation),
    selectedYear: year.toString(),
    selectedMonth: month ? month.toString() : 'all',
    searchQuery: identifierValue,
    onYearChange: handleYearChange,
    onMonthChange: handleMonthChange,
    onSearchChange: handleSearchChange,
  };

  // Calculate error messages and flags
  const showVZPError = !!(
    insuranceNum && VZP_ERROR_CODES.includes(String(suklLimits?.messages?.[0]?.code))
  );
  const vzpErrorMessage = showVZPError
    ? tErrors('noVZPAnyMoreError') + getLastDispensingDate() + '.'
    : null;

  const displayedErrorMessage =
    (isSuklDataError || suklData?.error) &&
    !isFetchingSuklData &&
    !VZP_ERROR_CODES.includes(String(suklData?.error?.status)) &&
    ((suklData?.error?.status !== 404 && getDisplayedErrorMessage()) ||
      (suklData?.error?.status === 404 && suklLimits?.error && getDisplayedErrorMessage()))
      ? getDisplayedErrorMessage()
      : '';

  const shouldShowRetryButton =
    suklData?.error?.status === 404 && suklLimits?.error
      ? showRetryButton(suklLimits?.error)
      : showRetryButton(suklData?.error);

  const limitsErrorCode = getErrorCode(suklLimits);
  const suklDataErrorCode = getErrorCode(suklData);

  const limitsErrorMessage =
    insuranceNum &&
    suklLimits &&
    !VZP_ERROR_CODES.includes(String(suklLimits?.messages?.[0]?.code)) &&
    limitsErrorCode
      ? getLimitsErrorMessage(limitsErrorCode)
      : VZP_ERROR_CODES.includes(suklDataErrorCode ?? '')
        ? getLimitsErrorMessage(suklDataErrorCode) || ''
        : null;

  const isContentLoading =
    ((isSuklDataLoading || isFetchingSuklData) && !isInsInitialized) ||
    ((isSuklDataLoading || isFetchingSuklData) && !withPrevData && isInsInitialized);

  const showLoadMoreButton =
    isFetchingSuklData && !withPrevData
      ? false
      : (!paginationCount && withPrevData) || paginationCount > skip + pageSize;

  if (!showResults || (!isInsInitialized && isSuklDataLoading && isInsuredDetailLoading)) {
    return (
      <div className={styles.feesPage} id="fees">
        <SearchView
          onSubmit={searchInsurance}
          isSubmitting={!isInsInitialized && isSuklDataLoading && isInsuredDetailLoading}
        />
      </div>
    );
  }

  // Results page view
  return (
    <div className={styles.feesPage} id="fees">
      {insuranceNum && suklLimits && (
        <ResultsView
          // Header props
          insuranceNum={insuranceNum}
          name={
            insuredDetail?.payload?.firstName && insuredDetail?.payload?.lastName
              ? `${insuredDetail.payload.firstName} ${insuredDetail.payload.lastName}`
              : suklLimits?.payload?.name
          }
          surchargeReverseBalance={surchargeReverseBalance}
          surchargeLimit={surchargeLimit}
          dayLimitReached={getDayLimitReached()}
          onBreadcrumbClick={handleBackToSearch}
          // Tab props
          activeTab={activeTab}
          onTabChange={setActiveTab}
          // Error handling
          isSuklDataError={isSuklDataError}
          suklDataError={suklData?.error}
          isFetchingSuklData={isFetchingSuklData}
          showVZPError={showVZPError}
          vzpErrorMessage={vzpErrorMessage}
          limitsErrorMessage={limitsErrorMessage}
          displayedErrorMessage={displayedErrorMessage}
          showRetryButton={shouldShowRetryButton}
          onRetry={
            suklData?.error?.status === 404 && suklLimits?.error
              ? () => refetchSuklLimits()
              : handleRetry
          }
          // Loading states
          isHeaderLoading={!isInsInitialized && (isSuklLimitsLoading || isInsuredDetailLoading)}
          isContentLoading={isContentLoading}
          isInsInitialized={isInsInitialized}
          withPrevData={withPrevData}
          // Overview tab props
          suklDataRows={suklDataRows}
          suklData={suklData}
          period={period}
          year={year}
          sumInsuer={sumInsuer}
          sumVZP={sumVZP}
          searchData={searchData}
          identifier={identifier}
          totalCount={totalCount}
          feesPageProps={feesPageProps}
          showDetails={showDetails}
          onShowDetailsChange={setShowDetails}
          // Pagination props
          pageSize={pageSize}
          currentPage={currentPage}
          paginationCount={paginationCount}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          onLoadMore={handleLoadMore}
          showLoadMoreButton={showLoadMoreButton}
        />
      )}
    </div>
  );
};

export default FeesPage;
