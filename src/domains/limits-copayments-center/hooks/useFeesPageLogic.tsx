import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pdf } from '@react-pdf/renderer';
import { useDebounce } from 'use-debounce';

import { useRoles } from '@/core/providers/RolesProvider';
import { toast } from '@/design-system/molecules/Toast/Toast';

import useInsuredDetail from '../api/query/useInsuredDetail';
import useSuklData from '../api/query/useSuklData';
import useSuklLimits from '../api/query/useSuklLimits';
import { FeesPagePDF } from '../components';
import { useFeesPageContext } from '../providers/FeesPageContext';
import {
  createLoadingIndicator,
  getErrorMessage,
  getPeriod,
  mergeKDPObjects,
  parseKDPresults,
  showRetryButton,
  TGroupedData,
} from '../services/utils';
import { useComplaintStore, useUserInfoStore } from '../stores';

const DEFAULT_PAGE_SIZE = 10;
const VZP_ERROR_CODES = ['SUK-10001', 'SUK-10002'];

export type FeesPageTab =
  | 'overview'
  | 'complaints'
  | 'assessment'
  | 'insuredPersons'
  | 'statement'
  | 'judgment';

export const useFeesPageLogic = () => {
  const t = useTranslations('KDPPage');
  const tErrors = useTranslations('KDPPage.errors');
  const tKDPResultHeader = useTranslations('KDPResultHeader');
  const tTable = useTranslations('KDPTable');
  const tCommon = useTranslations('common');
  const { suklReader, CLDComplAppr } = useRoles();
  const searchParams = useSearchParams();
  const isCLDDebugMode = useMemo(() => searchParams.get('cld') === 'true', [searchParams]);
  const { state } = useFeesPageContext();
  const { feesPageResetTrigger } = state;

  const [insuranceNum, setInsuranceNum] = useState<string>('');
  const [activeTab, setActiveTab] = useState<FeesPageTab>(
    (CLDComplAppr && !suklReader) || isCLDDebugMode ? 'assessment' : 'overview',
  );
  const [showResults, setShowResults] = useState(false);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number | null>(null);

  const [identifierValue, setIdentifier] = useState<string>('');
  const [identifier] = useDebounce(identifierValue, 1000);

  const [isInsInitialized, setIsInsInitialized] = useState(false);

  const previousDataRef = useRef<TGroupedData | null>(null);
  const [withPrevData, setWithPrevData] = useState(false);

  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [sumVZP, setSumVZP] = useState<number>(0);
  const [sumInsuer, setSumInsuer] = useState<number>(0);
  const [searchData, setSearchData] = useState<TGroupedData | null>(null);
  const [searchDataRaw, setSearchDataRaw] = useState<any[] | null>(null);

  const [downloadDate, setDownloadDate] = useState<string>(new Date().toLocaleDateString('cs-CZ'));
  const [showDetails, setShowDetails] = useState(true);

  const period = getPeriod(year, month);
  const isInitialMount = useRef(true);
  const prevResetTriggerRef = useRef(feesPageResetTrigger);

  const resetUserInfo = useUserInfoStore((state) => state.resetStates);
  const resetComplaint = useComplaintStore((state) => state.resetStates);
  // API queries
  const {
    data: suklData,
    isLoading: isSuklDataLoading,
    isError: isSuklDataError,
    refetch: refetchSuklData,
    isFetching: isFetchingSuklData,
  } = useSuklData(
    insuranceNum
      ? {
          insuranceNum,
          year,
          month,
          limit: pageSize,
          skip,
        }
      : null,
  );

  const {
    data: allSuklData,
    isLoading: isAllSuklDataLoading,
    isError: isAllSuklDataError,
  } = useSuklData(
    insuranceNum
      ? {
          insuranceNum,
          year,
          month,
          limit: totalCount,
          skip: 0,
        }
      : null,
  );

  const {
    data: allSumData,
    isLoading: isallSumDataLoading,
    isError: isallSumDataError,
  } = useSuklData(insuranceNum ? { insuranceNum, year } : null);

  const {
    data: suklLimits,
    isLoading: isSuklLimitsLoading,
    refetch: refetchSuklLimits,
  } = useSuklLimits(insuranceNum ? { insuranceNum } : null);

  const { data: insuredDetail, isLoading: isInsuredDetailLoading } = useInsuredDetail(
    insuranceNum || null,
  );

  const surchargeLimit = suklLimits?.payload?.surchargeLimit;
  const surchargeReverseBalance = suklLimits?.payload?.surchargeReverseBalance;

  // Parsed data
  const parsedSuklData = useMemo(() => {
    if (isAllSuklDataLoading) return null;

    const rawData = allSuklData?.payload?.data?.data;
    if (!rawData || isAllSuklDataError) return null;

    return parseKDPresults(rawData);
  }, [isAllSuklDataLoading, isAllSuklDataError, allSuklData]);

  // Data filtering
  const dataFilter = useCallback(
    (userSearchQuery: string) => {
      if (userSearchQuery && allSuklData) {
        const filter = userSearchQuery.toLowerCase().trim();

        if (filter) {
          const filteredData = allSuklData.payload.data.data.filter((row) => {
            return row.some((cell) =>
              String(cell || '')
                .toLowerCase()
                .includes(filter),
            );
          });
          setSearchDataRaw(filteredData);
          setSearchData(parseKDPresults(filteredData));
        }
      } else {
        setSearchData(null);
        setSearchDataRaw(null);
      }
    },
    [allSuklData],
  );

  const resetFilters = useCallback(() => {
    setIdentifier('');
    setMonth(null);
    setYear(currentYear);
    setSkip(0);
    setShowDetails(true);
    setCurrentPage(1);
    setSearchData(null);
  }, [currentYear]);

  const resetStates = useCallback(() => {
    previousDataRef.current = null;
    setIsInsInitialized(false);
    setWithPrevData(false);
    setCurrentPage(1);
  }, []);

  const getSums = useCallback(() => {
    if (!isallSumDataError && !isallSumDataLoading) {
      setSumInsuer(
        allSumData?.payload?.data?.data?.reduce(
          (sum: number, item: any[]) => sum + Number(item[5]),
          0,
        ) || 0,
      );
      setSumVZP(
        allSumData?.payload?.data?.data?.reduce(
          (sum: number, item: any[]) => sum + Number(item[6]),
          0,
        ) || 0,
      );
    }
  }, [isallSumDataError, isallSumDataLoading, allSumData]);

  useEffect(() => {
    getSums();
  }, [getSums]);

  const suklDataRows = useMemo(() => {
    const prevValue: TGroupedData | null = previousDataRef.current;

    if (isSuklDataLoading || isFetchingSuklData) return prevValue;
    const nextData: TGroupedData | null = identifier
      ? (searchDataRaw && parseKDPresults(searchDataRaw.slice(skip, skip + pageSize))) || null
      : !isSuklDataError && suklData?.payload?.data?.data
        ? parseKDPresults(suklData.payload.data.data)
        : null;

    if (typeof suklData?.payload?.totalCount === 'number' && !withPrevData)
      setTotalCount(suklData?.payload?.totalCount);

    if (identifier) {
      previousDataRef.current = nextData;

      return nextData;
    }

    if (withPrevData) {
      if (!prevValue) return nextData;
      if (!nextData) return prevValue;
      const nextDataWithPrev = prevValue ? mergeKDPObjects(prevValue, nextData) : nextData;
      previousDataRef.current = nextDataWithPrev;

      return nextDataWithPrev;
    }

    previousDataRef.current = nextData;

    return nextData;
  }, [
    isSuklDataLoading,
    isFetchingSuklData,
    identifier,
    searchDataRaw,
    isSuklDataError,
    suklData,
    withPrevData,
    skip,
    pageSize,
  ]);

  useEffect(() => {
    if (isInsInitialized) return;

    const isDataReady = (data: typeof suklData) => {
      return data && !data.error && data.payload?.data?.data?.length > 0;
    };

    const isLoadingComplete = () => {
      return !isSuklDataLoading && !isFetchingSuklData && !isSuklDataError;
    };

    if (isLoadingComplete() && isDataReady(suklData)) {
      setIsInsInitialized(true);
    }
  }, [isSuklDataError, isSuklDataLoading, suklData, isInsInitialized, isFetchingSuklData]);

  useEffect(() => {
    setWithPrevData(false);
  }, [pageSize, insuranceNum, year, month, identifier]);

  useEffect(() => {
    if (identifier && allSuklData && !isAllSuklDataLoading && !isAllSuklDataError) {
      dataFilter(identifier);
    }
  }, [allSuklData, isAllSuklDataLoading, isAllSuklDataError, identifier, dataFilter]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevResetTriggerRef.current = feesPageResetTrigger;

      return;
    }

    const hasTriggered = feesPageResetTrigger !== prevResetTriggerRef.current;

    if (hasTriggered && showResults) {
      setShowResults(false);
      setInsuranceNum('');
      resetStates();
    }

    prevResetTriggerRef.current = feesPageResetTrigger;
  }, [feesPageResetTrigger, showResults, resetStates]);

  // Handlers
  const searchInsurance = useCallback(
    (CP: string) => {
      resetUserInfo();
      resetComplaint();
      if (!CP || CP.trim() === '') {
        setInsuranceNum('');
        setShowResults(false);
        resetStates();

        return;
      }

      setPageSize(DEFAULT_PAGE_SIZE);
      resetFilters();
      resetStates();
      setActiveTab('overview');

      if (CP === insuranceNum) {
        setInsuranceNum('');

        Promise.resolve().then(() => {
          setInsuranceNum(CP);
          setShowResults(true);
          refetchSuklData({
            throwOnError: false,
            cancelRefetch: true,
          });
          refetchSuklLimits({
            throwOnError: false,
            cancelRefetch: true,
          });
        });
      } else {
        setInsuranceNum(CP);
        setShowResults(true);
      }
    },
    [
      insuranceNum,
      refetchSuklData,
      refetchSuklLimits,
      resetComplaint,
      resetFilters,
      resetStates,
      resetUserInfo,
    ],
  );

  const handleBackToSearch = useCallback(() => {
    setShowResults(false);
    setInsuranceNum('');
    resetStates();
  }, [resetStates]);

  const handleRetry = useCallback(() => {
    setIsInsInitialized(false);
    refetchSuklData();
    refetchSuklLimits();
  }, [refetchSuklData, refetchSuklLimits]);

  const handleLoadMore = useCallback(() => {
    setWithPrevData(true);

    const PAGE_SIZE_OPTIONS = [10, 20, 50];
    const nextPageSize = PAGE_SIZE_OPTIONS.find((option) => option > pageSize);
    if (nextPageSize) {
      setPageSize(nextPageSize);
      setSkip(0);
      setCurrentPage(1);
    } else {
      setPageSize(pageSize);
    }
  }, [pageSize]);

  const getLastDispensingDate = useCallback((): string => {
    if (!isallSumDataError && !isallSumDataLoading) {
      const data = allSumData?.payload?.data?.data;

      if (!Array.isArray(data) || data.length === 0) return '';

      const itemWithMaxDate = data.reduce((maxItem, currentItem) => {
        const currentDate = new Date(currentItem[9]);
        const maxDate = new Date(maxItem[9]);

        return currentDate > maxDate ? currentItem : maxItem;
      });

      return itemWithMaxDate?.[9] ? new Date(itemWithMaxDate[9]).toLocaleDateString('cs-CZ') : '';
    }

    return '';
  }, [isallSumDataError, isallSumDataLoading, allSumData]);

  const dayLimitReached = useCallback(
    (latest = false) => {
      if (!isallSumDataError && !isallSumDataLoading) {
        const data = allSumData?.payload?.data?.data;

        if (!Array.isArray(data)) return undefined;

        const filtered = data.filter((item) => Number(item[7]) === 0);

        if (filtered.length === 0) return undefined;

        if (latest) {
          const itemWithMaxDate = filtered.reduce((maxItem, currentItem) => {
            const currentDate = new Date(currentItem[9]);
            const maxDate = new Date(maxItem[9]);

            return currentDate > maxDate ? currentItem : maxItem;
          });

          return itemWithMaxDate?.[9];
        } else {
          const itemWithMinDate = filtered.reduce((minItem, currentItem) => {
            const currentDate = new Date(currentItem[9]);
            const minDate = new Date(minItem[9]);

            return currentDate < minDate ? currentItem : minItem;
          });

          return itemWithMinDate?.[9];
        }
      }
    },
    [isallSumDataError, isallSumDataLoading, allSumData],
  );

  const getDayLimitReached = useCallback(
    (latest = false): string => {
      const date = dayLimitReached(latest);

      return date ? new Date(date).toLocaleDateString('cs-CZ') : '';
    },
    [dayLimitReached],
  );

  const handleOnPrint = useCallback(
    async (isDownloadPdf = false, orientation: 'portrait' | 'landscape' = 'landscape') => {
      if (!insuranceNum) return null;

      setDownloadDate(new Date().toLocaleDateString('cs-CZ'));

      try {
        const loadingIndicator = createLoadingIndicator(tCommon);
        document.body.appendChild(loadingIndicator);

        const dataForPrint = identifier && searchData ? searchData : parsedSuklData;

        const isFormerVZPClient = VZP_ERROR_CODES.includes(String(suklLimits?.messages?.[0]?.code));
        const formerVZPMessage = isFormerVZPClient
          ? tErrors('noVZPAnyMoreError') + getLastDispensingDate() + '.'
          : null;

        const pdfProps = {
          suklLimits: suklLimits,
          period: getPeriod(year, month),
          translations: {
            t,
            tKDPResultHeader,
            tTable,
            tErrors,
          },
          insuranceNum,
          hasToPayTotal: surchargeReverseBalance,
          suklData: dataForPrint as TGroupedData,
          downloadDate,
          year,
          sumInsuer,
          sumVZP,
          dayLimitReached: getDayLimitReached(),
          noDataMessage: suklData?.payload?.totalCount === 0,
          orientation,
          isFormerVZPClient,
          formerVZPMessage,
        };

        const blob = await pdf(<FeesPagePDF {...pdfProps} />).toBlob();
        const url = URL.createObjectURL(blob);

        if (document.body.contains(loadingIndicator)) {
          document.body.removeChild(loadingIndicator);
        }

        if (isDownloadPdf) {
          // Download PDF
          const fileName = insuranceNum ? `${insuranceNum}-vypisleku.pdf` : 'vypisleku.pdf';
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          // Print PDF
          const printWindow = window.open(url, '_blank');

          if (printWindow) {
            printWindow.addEventListener('afterprint', () => {
              printWindow.close();
              URL.revokeObjectURL(url);
            });

            printWindow.addEventListener('load', () => {
              setTimeout(() => {
                printWindow.print();
              }, 1000);
            });
          } else {
            toast.error(tCommon('printingError'), {
              id: 'toast-feesPage-printingError',
            });
            URL.revokeObjectURL(url);
          }
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(tCommon('error'), { id: 'toast-feesPage-error' });
      }

      return;
    },
    [
      insuranceNum,
      identifier,
      searchData,
      parsedSuklData,
      suklLimits,
      year,
      month,
      surchargeReverseBalance,
      downloadDate,
      sumInsuer,
      sumVZP,
      suklData,
      t,
      tKDPResultHeader,
      tTable,
      tErrors,
      tCommon,
      getLastDispensingDate,
      getDayLimitReached,
    ],
  );

  const handleYearChange = useCallback(
    (newYear: string) => {
      resetStates();
      setYear(Number(newYear));
      getSums();
    },
    [resetStates, getSums],
  );

  const handleMonthChange = useCallback(
    (newMonth: string) => {
      resetStates();
      setMonth(newMonth === 'all' ? null : Number(newMonth));
    },
    [resetStates],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      resetStates();
      setIdentifier(query);
      dataFilter(query);
    },
    [resetStates, dataFilter],
  );

  const handlePageSizeChange = useCallback((value: string) => {
    setWithPrevData(false);
    setSkip(0);
    setCurrentPage(1);
    setPageSize(+value);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setWithPrevData(false);
      // Inline výpočet pagination count místo volání funkce
      const count = identifier && searchDataRaw ? searchDataRaw.length : totalCount;
      const maxPage = Math.max(1, Math.ceil(count / pageSize));
      const safePage = Math.min(Math.max(newPage, 1), maxPage);
      setCurrentPage(safePage);
      setSkip((safePage - 1) * pageSize);
    },
    [pageSize, identifier, searchDataRaw, totalCount],
  );

  const getPaginationCount = useCallback((): number => {
    if (identifier && searchDataRaw) {
      return searchDataRaw.length;
    }

    return totalCount;
  }, [identifier, searchDataRaw, totalCount]);

  const getDisplayedErrorMessage = useCallback(() => {
    if (suklData?.error?.status === 404 && suklLimits?.error) {
      return getErrorMessage(suklLimits?.error, tErrors);
    }

    return getErrorMessage(suklData?.error, tErrors) || '';
  }, [suklData, suklLimits, tErrors]);

  const getErrorCode = useCallback(
    (response?: { messages?: Array<{ code: string }> } | null): string | undefined => {
      return response?.messages?.[0]?.code;
    },
    [],
  );

  const getLimitsErrorMessage = useCallback(
    (code?: string) => {
      if (!code) return tErrors('errorData');
      if (code === 'SUK-10001') return tErrors('noVZPError');
      if (code === 'SUK-10002') return tErrors('errorNotFound');
      if (code === 'SUK-10003' || code === 'SUK-10004') return tErrors('serverError');

      return tErrors('errorData');
    },
    [tErrors],
  );

  const paginationCount = getPaginationCount();

  return {
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
    searchDataRaw,
    downloadDate,
    showDetails,
    period,
    paginationCount,

    // API data
    suklData,
    isSuklDataLoading,
    isSuklDataError,
    isFetchingSuklData,
    allSuklData,
    isAllSuklDataLoading,
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
    showRetryButton: (error: any) => showRetryButton(error),

    // Translations
    t,
    tErrors,
    tKDPResultHeader,
    tTable,
  };
};
