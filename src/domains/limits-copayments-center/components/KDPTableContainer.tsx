import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ICached from '@/core/assets/icons/icon-cached.svg';
import { formatNumber } from '@/core/auth/utils';
import { InlineMessage } from '@/design-system/molecules';

import useSuklData from '../api/query/useSuklData';
import useSuklLimits from '../api/query/useSuklLimits';
import styles from '../index.module.css';
import { parseKDPresults, TGroupedData, TMonthData } from '../services/utils';
import { KDPTable } from './KDPTable';
import { MonthHeader } from './MonthHeader';

export const KDPTableContainer = () => {
  const t = useTranslations('KDPPage');

  const searchParams = useSearchParams();
  const insuranceNum = searchParams?.get('insuranceNum');
  const year = Number(searchParams?.get('year')) || 2024;
  const month = Number(searchParams?.get('month')) || null;
  const limit = Number(searchParams?.get('limit')) || 10;
  const skip = Number(searchParams?.get('skip')) || 0;

  const {
    data: suklDataResponse,
    isLoading: isSuklDataLoading,
    isError: isSuklDataError,
  } = useSuklData(insuranceNum ? { insuranceNum, year, month, limit, skip } : null);

  const { isLoading: isSuklLimitsLoading, isError: isSuklLimitsError } = useSuklLimits(
    insuranceNum ? { insuranceNum } : null,
  );

  const suklData = useMemo(() => {
    if (isSuklDataLoading) return null;
    const nextData: TGroupedData | null =
      !isSuklDataError && suklDataResponse?.payload?.data?.data
        ? parseKDPresults(suklDataResponse.payload.data.data)
        : null;

    return nextData;
  }, [isSuklDataLoading, isSuklDataError, suklDataResponse]);

  useEffect(() => {
    const handleAfterPrint = () => {
      window.close();
    };

    window.addEventListener('afterprint', handleAfterPrint);

    if (
      suklData &&
      !isSuklDataLoading &&
      !isSuklLimitsLoading &&
      !isSuklLimitsError &&
      !isSuklDataError &&
      window.opener
    )
      if (
        (isSuklLimitsError || isSuklDataError) &&
        !isSuklDataLoading &&
        !isSuklLimitsLoading &&
        window.opener
      ) {
        window.opener.postMessage('print-error', '*');
      }

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [suklData, isSuklDataLoading, isSuklLimitsLoading, isSuklLimitsError, isSuklDataError]);

  if (isSuklDataLoading || isSuklLimitsLoading) {
    return <div className={styles.feesPage}>Printing...</div>;
  }

  return (
    <div className={styles.printTablesContainer}>
      {suklData &&
        Object.keys(suklData)
          ?.sort((a, b) => +b - +a)
          ?.map((month, index) => {
            const monthData: TMonthData = suklData[month];

            return (
              <div key={month}>
                <MonthHeader
                  isPrinting
                  month={month}
                  year={year.toString()}
                  limit={monthData.monthLimit}
                />
                {monthData.monthLimit &&
                  monthData.beforeMonthLimit &&
                  monthData.beforeMonthLimit !== monthData.monthLimit && (
                    <InlineMessage
                      id={'inline-message-cld-container-limit-changed-' + month}
                      icon={<ICached id={'icon-cld-table-container-cached-' + index} />}
                      message={t('changeLimit', {
                        from: formatNumber(monthData.beforeMonthLimit) ?? '0',
                        to: formatNumber(monthData.monthLimit) ?? '0',
                      })}
                      variant="info"
                    />
                  )}
                <KDPTable monthData={monthData} />
              </div>
            );
          })}
    </div>
  );
};
