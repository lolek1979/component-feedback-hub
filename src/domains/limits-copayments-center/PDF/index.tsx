'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ICached from '@/core/assets/icons/icon-cached.svg';
import Iinfo from '@/core/assets/icons/info.svg';
import { formatDateWithTime, formatDecimal, formatNumber } from '@/core/auth/utils';
import { Spinner, Text } from '@/design-system/atoms';
import {
  InlineMessage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/design-system/molecules';

import useSuklData from '../api/query/useSuklData';
import useSuklLimits from '../api/query/useSuklLimits';
import { EPrescriptionHeader, KdpResultHeader } from '../components';
import { DISPLAY_COLUMNS, getPeriod, parseKDPresults, TMonthData } from '../services/utils';
import styles from './index.module.css';

const PrintFeesPage = () => {
  const t = useTranslations('KDPPage');
  const tErrors = useTranslations('KDPPage.errors');
  const tTable = useTranslations('KDPTable');
  const searchParams = useSearchParams();
  const insuranceNum = searchParams?.get('insuranceNum');
  const year = Number(searchParams?.get('year')) || 2024;
  const month = Number(searchParams?.get('month')) || null;
  const identifier = searchParams?.get('identifier') || '';
  const limit = Number(searchParams?.get('limit')) || 10;
  const skip = Number(searchParams?.get('skip')) || 0;

  const [sumVZP, setSumVZP] = useState<number>(0);
  const [sumInsuer, setSumInsuer] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);

  const [printTime, setPrintTime] = useState<string | null>(null);

  // Load all data without searchFilter for filtering client-side
  const {
    data: suklDataResponse,
    isLoading: isSuklDataLoading,
    isError: isSuklDataError,
  } = useSuklData(insuranceNum ? { insuranceNum, year, month, limit, skip } : null);

  // Load all data for the year/month to enable client-side filtering
  const {
    data: allSuklDataResponse,
    isLoading: isAllSuklDataLoading,
    isError: isAllSuklDataError,
  } = useSuklData(insuranceNum ? { insuranceNum, year, month } : null);
  const {
    data: allSumData,
    isLoading: isallSumDataLoading,
    isError: isallSumDataError,
  } = useSuklData(insuranceNum ? { insuranceNum, year } : null);
  const {
    data: suklLimits,
    isLoading: isSuklLimitsLoading,
    isError: isSuklLimitsError,
  } = useSuklLimits(insuranceNum ? { insuranceNum } : null);

  // Client-side filtering logic similar to main FeesPage
  const dataFilter = useCallback((userSearchQuery: string, rawData: any[]) => {
    if (userSearchQuery && rawData) {
      const filter = userSearchQuery.toLowerCase().trim();

      if (filter) {
        return rawData.filter((row) => {
          return row.some((cell: any) =>
            String(cell || '')
              .toLowerCase()
              .includes(filter),
          );
        });
      }
    }

    return rawData;
  }, []);

  // Apply filtering when data or identifier changes
  useEffect(() => {
    if (allSuklDataResponse?.payload?.data?.data) {
      const rawData = allSuklDataResponse.payload.data.data;
      if (identifier && identifier.trim()) {
        const filtered = dataFilter(identifier, rawData);
        setFilteredData(filtered);
      } else {
        setFilteredData(rawData);
      }
    }
  }, [allSuklDataResponse, identifier, dataFilter]);

  const suklData = useMemo(() => {
    if (isAllSuklDataLoading) return null;

    // Use filtered data if available, otherwise fall back to original response
    const dataToUse = filteredData || suklDataResponse?.payload?.data?.data;

    return !isAllSuklDataError && dataToUse ? parseKDPresults(dataToUse) : null;
  }, [isAllSuklDataLoading, isAllSuklDataError, filteredData, suklDataResponse]);

  document.body.classList.toggle('dark', false);

  useEffect(() => {
    const handleAfterPrint = () => {
      if (window.opener) {
        window.opener.postMessage('print-complete', '*');
      }
      if (window.parent !== window) {
        window.parent.postMessage('print-complete', '*');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (window.opener) {
          window.opener.postMessage('print-cancelled', '*');
        }
        if (window.parent !== window) {
          window.parent.postMessage('print-cancelled', '*');
        }
      }
    };

    const handleBeforePrint = () => {
      window.localStorage.setItem('print-started', 'true');
    };

    window.addEventListener('afterprint', handleAfterPrint);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('beforeprint', handleBeforePrint);

    if (window.opener) {
      window.opener.postMessage('print-ready', '*');
    }
    if (window.parent !== window) {
      window.parent.postMessage('print-ready', '*');
    }

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  useEffect(() => {
    if (
      suklData &&
      !isSuklDataLoading &&
      !isSuklLimitsLoading &&
      !isSuklLimitsError &&
      !isSuklDataError &&
      !isallSumDataError &&
      !isallSumDataLoading &&
      !isAllSuklDataLoading &&
      !isAllSuklDataError
    ) {
      setSumInsuer(
        allSumData?.payload.data.data?.reduce(
          (sum: number, item: any[]) => sum + Number(item[5]),
          0,
        ) || 0,
      );
      setSumVZP(
        allSumData?.payload.data.data?.reduce(
          (sum: number, item: any[]) => sum + Number(item[6]),
          0,
        ) || 0,
      );
      const currentDate = new Date().toLocaleDateString();
      setPrintTime(currentDate);

      const printFeesElement = document.getElementById('print-fees');
      if (printFeesElement) {
        printFeesElement.setAttribute('data-loaded', 'loaded');
      }

      const searchParams = new URLSearchParams(window.location.search);
      const isDownload = searchParams.get('isDownload') === 'true';

      if (!isDownload) {
        if (!window.localStorage.getItem('print-started')) {
          setTimeout(() => {
            try {
              window.print();
            } catch (error) {
              console.error('Error printing:', error);
              if (window.opener) {
                window.opener.postMessage('print-error', '*');
              }
              if (window.parent !== window) {
                window.parent.postMessage('print-error', '*');
              }
            }
          }, 500);
        }
      }
    }

    if (
      (isSuklLimitsError || isSuklDataError || isallSumDataError || isAllSuklDataError) &&
      !isSuklDataLoading &&
      !isSuklLimitsLoading &&
      !isAllSuklDataLoading
    ) {
      if (window.opener) {
        window.opener.postMessage('print-error', '*');
      }
      if (window.parent !== window) {
        window.parent.postMessage('print-error', '*');
      }
    }
  }, [
    suklData,
    isSuklDataLoading,
    isSuklLimitsLoading,
    isSuklLimitsError,
    isSuklDataError,
    isallSumDataError,
    isallSumDataLoading,
    isAllSuklDataLoading,
    isAllSuklDataError,
    allSumData?.payload.data.data,
  ]);

  if (isSuklDataLoading || isSuklLimitsLoading || isallSumDataLoading || isAllSuklDataLoading) {
    return (
      <div className={styles.feesPage} data-state="loading">
        <Spinner width={24} height={24} />
        <div style={{ textAlign: 'center', margin: '20px 0' }}>{t('preparingDocument')}</div>
      </div>
    );
  }

  if (isSuklDataError || isSuklLimitsError || isallSumDataError || isAllSuklDataError) {
    return (
      <div className={styles.feesPage} data-state="error">
        <div
          className="error-message"
          style={{ color: 'red', textAlign: 'center', margin: '20px auto' }}
        >
          {tErrors('errorPreparingDocument')}
        </div>
      </div>
    );
  }

  if (!suklData) {
    return (
      <div className={styles.feesPage} data-state="no-data">
        <div className="error-message" style={{ textAlign: 'center', margin: '20px auto' }}>
          {tErrors('errorNotFound')}
        </div>
      </div>
    );
  }

  const dayLimitReached = () => {
    if (!isallSumDataError && !isallSumDataLoading)
      return allSumData?.payload.data.data.find((item: any[]) => Number(item[7]) === 0)?.[9];
  };
  const getDayLimitReached = (): string => {
    const date = dayLimitReached();

    return date ? new Date(date).toLocaleDateString('cs-CZ') : '';
  };

  const inlineMessage = `${t('generatedAt')} ${printTime ? ` ${printTime}` : ''}`;

  return (
    <div className={styles.feesPage} data-loaded="loaded" id="print-fees" data-state="ready">
      <style>
        {`
          @page {
            margin-bottom: 0;
            margin-top: 10px;
          }
        `}
      </style>
      <div className={styles.resultHeaderContainer}>
        <KdpResultHeader
          insuranceNum={insuranceNum || ''}
          name={suklLimits?.payload?.name}
          hasToPayTotal={
            suklLimits?.payload?.surchargeReverseBalance
              ? suklLimits?.payload.surchargeReverseBalance
              : undefined
          }
          limit={suklLimits?.payload?.surchargeLimit}
          dayLimitReached={getDayLimitReached()}
        />

        <InlineMessage
          id="inline-message-print-info"
          icon={<Iinfo width={20} height={20} id="icon-cld-print-info-1" />}
          message={t('printMessage')}
          variant="info"
          className={styles.inlineMessage}
        />

        <InlineMessage
          id="inline-message-print-generated-at"
          icon={<Iinfo id="icon-cld-print-info-2" width={20} height={20} />}
          message={inlineMessage}
          variant="info"
          className={styles.inlineMessage}
        />
      </div>

      <div className={styles.resultHeader}>
        <div className={styles.infoContainer}>
          <Text variant="body" className={styles.headerText}>
            {getPeriod(year, month)}
          </Text>
          <Text variant="body" className={`${styles.headerText} ${styles.headerTextColor}`}>
            {t('bodyTitle')}
          </Text>
        </div>
        <div className={styles.sumContainer}>
          <div className={styles.sumItem}>
            <Text className={styles.sumItemText}>
              {t('sumInsuer')} {year.toString()}:
            </Text>
            <Text className={styles.sumItemTextSum} variant="subtitle">
              {formatNumber(sumInsuer)}
            </Text>
          </div>
          <div className={styles.sumItem}>
            <Text className={styles.sumItemText}>
              {t('sumVZP')} {year.toString()}:
            </Text>
            <Text className={styles.sumItemTextSum} variant="subtitle">
              {formatNumber(sumVZP)}
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.printTablesContainer}>
        {suklData &&
          Object.keys(suklData)
            ?.sort((a, b) => +b - +a)
            ?.map((month, index) => {
              const monthData: TMonthData = suklData[month];

              return (
                <div key={month} className={styles.monthContainer}>
                  <div>
                    {monthData.monthLimit &&
                      monthData.beforeMonthLimit &&
                      monthData.beforeMonthLimit !== monthData.monthLimit && (
                        <InlineMessage
                          id={'inline-message-print-limit-changed-' + month}
                          icon={<ICached id={'icon-cld-print-cached-' + index} />}
                          message={t('changeLimit', {
                            from: formatNumber(monthData.beforeMonthLimit) ?? '0',
                            to: formatNumber(monthData.monthLimit) ?? '0',
                          })}
                          variant="info"
                          className={styles.inlineMessage}
                        />
                      )}
                  </div>
                  {monthData.monthTables.map((table, tableIndex) => {
                    const date = new Date(table.date);
                    const formattedDate = formatDateWithTime(date);
                    const isLimitOverPaid = table.rows?.some((row) => +row[7] < 0);

                    return (
                      <div
                        key={table.date}
                        className={`${styles.ereceptWrapper} ${index === 0 && tableIndex === 0 ? styles.noPageBreak : ''}`}
                      >
                        <EPrescriptionHeader
                          date={formattedDate}
                          prescriptionCode={`${table.eRecept}`}
                          isLimitOverPaid={isLimitOverPaid}
                        />
                        <Table className={styles.printTableWrapper}>
                          <TableHead className={styles.tableHead}>
                            <TableRow className={styles.tableRow}>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>{tTable('VYD')}</Text>
                              </TableCell>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>{tTable('LP')}</Text>
                              </TableCell>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>
                                  {tTable('ZapocitatelnyDoplatek')}
                                </Text>
                              </TableCell>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>
                                  {tTable('ZapocitatelnyDoplatekPacient')}
                                </Text>
                              </TableCell>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>
                                  {tTable('ZapocitatelnyDoplatekZP')}
                                </Text>
                              </TableCell>
                              <TableCell isHeader align="left">
                                <Text className={styles.tableCell}>{tTable('ZbytekDoLimitu')}</Text>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className={styles.tableBody}>
                            {table.total?.length && (
                              <TableRow>
                                {table.total.map((item, index) => (
                                  <TableCell
                                    key={`total-${item}-${index}`}
                                    className={styles.ereceptFirstRow}
                                  >
                                    {index === 0 && (
                                      <Text variant="subtitle" className={styles.tableCell}>
                                        {item}
                                      </Text>
                                    )}
                                    {index === 1 && (
                                      <Text
                                        variant="subtitle"
                                        className={styles.tableCell}
                                      >{`${item} ${tTable('rows')}`}</Text>
                                    )}
                                    {index > 1 && (
                                      <Text
                                        variant="subtitle"
                                        className={styles.tableCell}
                                      >{`${formatDecimal(+item)} Kč`}</Text>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )}
                            {table.rows?.length &&
                              table.rows.map((row, indexRow) => (
                                <TableRow key={`${table.date}-row-${indexRow}`}>
                                  {Object.values(DISPLAY_COLUMNS).map((columnIndex) => (
                                    <TableCell
                                      key={`${table.date}-item-${columnIndex}-${indexRow}`}
                                    >
                                      <Text className={styles.tableCell}>
                                        {columnIndex > 3
                                          ? `${formatNumber(+row[columnIndex])}`
                                          : table.total?.length && columnIndex === 2
                                            ? null
                                            : row[columnIndex]}
                                      </Text>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        {((filteredData && filteredData.length === 0) ||
          (!filteredData && suklDataResponse?.payload.data.data.length === 0)) && (
          <div className={`${styles.errorContainer} ${styles.inDataSection}`}>
            <InlineMessage
              id="inline-message-print-not-found"
              message={tErrors('notFound')}
              variant="info"
              className={styles.inlineMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintFeesPage;
