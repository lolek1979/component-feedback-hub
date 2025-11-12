import React from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { PDFCached, PDFError, PDFInfo, PDFSuccess } from '@/core/assets/icons/IconsPDF';
import { formatDateWithTime, formatNumber } from '@/core/auth/utils';

import { SuklLimitsResponse } from '../api/services/getSuklLimits';
import { DISPLAY_COLUMNS, TGroupedData, TMonthData } from '../services/utils';

const isLimitReached = (monthData: TMonthData) => {
  return monthData.monthTables.some((table) => table.rows?.some((row) => Number(row[7]) <= 0));
};

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
    fontFamily: 'Roboto',
    paddingBottom: 50,
    minHeight: '100%',
  },

  pagePortrait: {
    padding: 24,
    fontSize: 9,
    fontFamily: 'Roboto',
    paddingBottom: 50,
    minHeight: '100%',
  },

  pageLandscape: {
    padding: 24,
    fontSize: 9,
    fontFamily: 'Roboto',
    paddingBottom: 50,
    minHeight: '100%',
  },

  header: {
    marginBottom: 10,
  },

  pageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  insuranceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  insuranceId: {
    fontSize: 9,
    color: '#505058',
  },

  limitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },

  limitReachedSuccess: {
    color: '#24a148',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    gap: 4,
  },

  limitValue: {
    textAlign: 'right',
    fontSize: 9,
    color: '#505058',
    display: 'flex',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  messageBox: {
    backgroundColor: '#f1f1f3',
    padding: 7,
    marginBottom: 10,
    borderRadius: 4,
  },

  infoIcon: {
    marginRight: 6,
  },

  infoMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  infoMessageText: {
    fontSize: 8,
    textOverflow: 'ellipsis',
    marginRight: 10,
  },

  generatedDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 8,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 500,
    gap: 6,
  },

  section: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9fb',
    borderRadius: 4,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
  },

  periodTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  dataSource: {
    fontSize: 7,
    color: '#505058',
    marginTop: 2,
  },

  summaryValues: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 2,
  },

  summaryLabel: {
    marginRight: 10,
    color: '#505058',
    fontSize: 7,
  },

  summaryValue: {
    fontWeight: 'bold',
    width: 70,
    fontSize: 7,
    textAlign: 'right',
  },

  statusBox: {
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#e6f7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },

  limitChangeBox: {
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#e6eefb',
    flexDirection: 'row',
    alignItems: 'center',
  },

  monthSection: {
    marginBottom: 12,
    breakInside: 'avoid',
  },

  monthHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
    borderRadius: 3,
  },

  monthHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  monthTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  monthLimit: {
    fontSize: 7,
    textAlign: 'right',
    color: '#000000',
    fontWeight: 'bold',
  },

  monthLimitInfo: {
    fontSize: 8,
    color: '#505058',
    textAlign: 'right',
    marginBottom: 4,
  },

  table: {
    marginBottom: 12,
    breakInside: 'avoid',
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f1f1f3',
    borderRadius: 4,
    fontSize: 6,
    marginBottom: 1,
    paddingVertical: 0,
  },

  tableHeaderCell: {
    padding: 3,
    fontSize: 6,
    textAlign: 'left',
  },

  tableHeaderCellRight: {
    padding: 3,
    fontSize: 6,
    textAlign: 'right',
    whiteSpace: 'pre-wrap',
  },

  tableRow: {
    flexDirection: 'row',
    fontSize: 7,
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    breakInside: 'avoid',
    alignItems: 'center',
  },

  dateColumn: {
    flex: 0.7,
    padding: 3,
    fontSize: 7,
    textAlign: 'left',
    fontWeight: 'bold',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
  },

  eReceiptColumn: {
    flex: 0.7,
    padding: 3,
    fontSize: 7,
    textAlign: 'left',
    fontWeight: 'bold',

    alignItems: 'flex-start',
  },

  dispensaryColumn: {
    flex: 1.2,
    padding: 3,
    fontSize: 7,
    textAlign: 'left',
    display: 'flex',
    fontWeight: 'bold',

    flexDirection: 'column',
    breakInside: 'avoid',
  },

  itemColumn: {
    flex: 0.8,
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',

    textAlign: 'left',
  },

  amountColumn: {
    flex: 0.6,
    padding: 3,
    fontWeight: 'bold',

    textAlign: 'right',
    fontSize: 7,
  },

  tableCell: {
    flex: 0.95,
    padding: 3,
    textAlign: 'left',
    fontSize: 7,
    fontWeight: 'bold',
  },
  tableCellCenter: {
    flex: 1,
    padding: 3,
    textAlign: 'center',
    fontSize: 7,
  },

  tableCellRight: {
    flex: 0.6, // 0.7 origo
    padding: 3,
    textAlign: 'right',
    fontWeight: 'bold',

    fontSize: 7,
  },
  tableCellRightGreen: {
    flex: 0.6, // 0.7 origo
    padding: 3,
    textAlign: 'right',
    fontSize: 7,
    color: '#24a148',
    fontWeight: 'bold',
  },
  tableCellRightRed: {
    flex: 0.6, // 0.7 origo
    padding: 3,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#f04829',
    fontSize: 7,
  },

  tableCellWide: {
    flex: 2,
    padding: 3,
    textAlign: 'left',
    fontSize: 7,
  },

  tableCellMid: {
    flex: 1,
    padding: 3,
    textAlign: 'left',
    fontSize: 7,
  },

  tableCellNarrow: {
    flex: 0.7,
    padding: 3,
    textAlign: 'right',
    fontSize: 7,
  },

  tableCellLastColumn: {
    flex: 0.7,
    padding: 3,
    textAlign: 'right',
    fontSize: 7,
    wordBreak: 'break-word',
    hyphens: 'auto',
  },

  tableRowFirst: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    breakInside: 'avoid',
  },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 8,
    color: '#505058',
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 3,
  },

  inlineMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  greenText: {
    color: '#24a148',
  },
  InlineMessageItems: {
    display: 'flex',
    alignItems: 'center',
    padding: 7,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: '8px',
    justifyContent: 'center',
    width: '100%',
    gap: '8px',
  },
  month: {
    fontWeight: '600',
    fontSize: 14,
    color: '#0f0f10',
  },
  limit: {
    fontSize: 12,
    gap: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitReached: {
    fontSize: 12,
    color: '#24a148',
    gap: 8,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  limitContainer: {
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    flexDirection: 'column',
    gap: 2,
  },

  limitText: {
    textAlign: 'right',
    fontSize: 9,
    color: '#505058',
  },
  insuranceText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  cellContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  pharnacyName: {
    fontSize: 7,
    textAlign: 'left',
    alignItems: 'flex-start',
  },

  subText: {
    fontSize: 7,
    color: '#505058',
    textOverflow: 'ellipsis',
  },
  timePart: {
    color: '#505058',
    fontSize: 7,
    fontWeight: 'light',
  },

  errorMessageBox: {
    backgroundColor: '#fde6e2',
    padding: 7,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fde6e2',
  },

  errorMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  errorMessageText: {
    fontSize: 8,
    color: '#d22d0f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export interface FeesPagePDFProps {
  suklLimits?: SuklLimitsResponse;
  suklLimitsName?: string;
  hasToPayTotal?: number;
  limit?: number;
  period?: string;
  insuranceNum?: string;
  translations: {
    t: (key: string) => string;
    tKDPResultHeader: (key: string) => string;
    tTable: (key: string) => string;
    tErrors: (key: string) => string;
  };
  suklData: TGroupedData;
  downloadDate: string;
  year: number;
  sumInsuer: number;
  sumVZP: number;
  dayLimitReached?: string;
  noDataMessage?: boolean;
  orientation?: 'portrait' | 'landscape';
  isFormerVZPClient?: boolean;
  formerVZPMessage?: string | null;
}

const getMonthName = (monthNum: string): string => {
  const months = [
    'Leden',
    'Únor',
    'Březen',
    'Duben',
    'Květen',
    'Červen',
    'Červenec',
    'Srpen',
    'Září',
    'Říjen',
    'Listopad',
    'Prosinec',
  ];

  return months[parseInt(monthNum) - 1] || monthNum;
};

export const FeesPagePDF = ({
  suklLimits,
  period,
  translations,
  insuranceNum,
  hasToPayTotal,
  suklData,
  downloadDate,
  year,
  sumVZP,
  sumInsuer,
  dayLimitReached,
  noDataMessage,
  orientation = 'portrait',
  isFormerVZPClient,
  formerVZPMessage,
}: FeesPagePDFProps) => {
  const { t, tKDPResultHeader, tTable } = translations;
  const isLandscape = orientation === 'landscape';

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation={orientation}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>{tKDPResultHeader('kdpResultInfo')}</Text>

        {/* Info Message */}
        <View style={styles.messageBox}>
          <View style={styles.infoMessage}>
            <PDFInfo />
            <Text style={styles.infoMessageText}>{t('printMessage')}</Text>
          </View>
        </View>

        {/* Generated Date */}
        <View style={styles.messageBox}>
          <View style={styles.generatedDate}>
            <PDFInfo />
            <Text>
              {t('generatedAt')} {downloadDate}
            </Text>
          </View>
        </View>

        {/* Former VZP Client Alert Message */}
        {isFormerVZPClient && formerVZPMessage && (
          <View style={styles.errorMessageBox}>
            <View style={styles.errorMessage}>
              <PDFError />
              <Text style={styles.errorMessageText}>{formerVZPMessage}</Text>
            </View>
          </View>
        )}

        {/* Insurance Information */}
        <View style={styles.insuranceInfo}>
          <View>
            {suklLimits?.payload?.name ? (
              <>
                <Text style={styles.userName}>{suklLimits.payload.name}</Text>
                <Text style={styles.insuranceId}>
                  {tKDPResultHeader('socialNum')}: {insuranceNum}
                </Text>
              </>
            ) : (
              <Text style={styles.insuranceText}>
                {tKDPResultHeader('socialNum')}: {insuranceNum}
              </Text>
            )}
          </View>

          <View>
            {hasToPayTotal ? (
              <View style={styles.limitContainer}>
                <Text style={styles.limitText}>
                  {tKDPResultHeader('limit')}: {formatNumber(hasToPayTotal ?? 0)}
                </Text>
                <Text style={styles.limitValue}>
                  {tKDPResultHeader('hasToPay')}:{' '}
                  {formatNumber(suklLimits?.payload?.surchargeLimit ?? 0)}
                </Text>
              </View>
            ) : (
              suklLimits !== undefined && (
                <View style={styles.limitContainer}>
                  <View style={styles.limitReachedSuccess}>
                    <PDFSuccess />
                    <Text>
                      {dayLimitReached
                        ? tKDPResultHeader('limitAcomplishedDay')
                        : tKDPResultHeader('limitAcomplished')}
                      {dayLimitReached}
                    </Text>
                  </View>
                  {suklLimits?.payload?.surchargeLimit && (
                    <Text style={styles.limitValue}>
                      {tKDPResultHeader('hasToPay')}:{' '}
                      {formatNumber(suklLimits?.payload?.surchargeLimit ?? 0)}
                    </Text>
                  )}
                </View>
              )
            )}
          </View>
        </View>

        {/* Period Summary */}
        <View style={styles.periodHeader}>
          <View>
            <Text style={styles.periodTitle}>{period}</Text>
            <Text style={styles.dataSource}>{t('bodyTitle')}</Text>
          </View>
          <View style={styles.summaryValues}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('sumInsuer')} {year.toString()}:
              </Text>
              <Text style={styles.summaryValue}>{formatNumber(sumInsuer)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('sumVZP')} {year.toString()}:
              </Text>
              <Text style={styles.summaryValue}>{formatNumber(sumVZP)}</Text>
            </View>
          </View>
        </View>

        {noDataMessage && (
          <View style={styles.messageBox}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={styles.infoMessageText}>{t('errors.notFound')}</Text>
            </View>
          </View>
        )}

        {/* Tables by Month with a single header per month */}
        {suklData &&
          Object.keys(suklData)
            .sort((a, b) => +b - +a)
            .map((month) => {
              const monthData: TMonthData = suklData[month];
              const limitReached = isLimitReached(monthData);

              return (
                <View key={`month-wrapper-${month}`} style={styles.monthSection}>
                  {limitReached && (
                    <View
                      style={[
                        styles.InlineMessageItems,
                        {
                          backgroundColor: '#e2f3e6',
                        },
                      ]}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          justifyContent: 'center',
                        }}
                      >
                        <PDFSuccess />
                        <Text style={{ color: '#1f8a3d', fontSize: 7 }}>
                          {t('limitReachedMessagePDF')} {formatNumber(monthData.monthLimit) ?? '0'}
                          {t('limitReachedMessagePDF2')}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.monthHeaderContainer}>
                    <Text style={styles.monthTitle}>
                      {getMonthName(month)} {year}
                    </Text>
                    {limitReached ? (
                      <Text style={[styles.monthLimit, styles.greenText]}>
                        {tKDPResultHeader('LimReached')}:{' '}
                        {formatNumber(monthData.monthLimit) ?? '0'}
                      </Text>
                    ) : (
                      <Text style={styles.monthLimit}>
                        {tKDPResultHeader('hasToPay')}: {formatNumber(monthData.monthLimit) ?? '0'}
                      </Text>
                    )}
                  </View>

                  {monthData.monthLimit &&
                    monthData.beforeMonthLimit &&
                    monthData.beforeMonthLimit !== monthData.monthLimit && (
                      <View
                        style={[
                          styles.InlineMessageItems,
                          {
                            backgroundColor: '#e5eeff',
                          },
                        ]}
                      >
                        <PDFCached />
                        <Text style={{ color: '#024bd5', fontSize: 7 }}>
                          {t('changeLimitPDF')}
                          {formatNumber(monthData.beforeMonthLimit) ?? '0'}
                          {t('changeLimitPDF2')}
                          {formatNumber(monthData.monthLimit) ?? '0'}
                        </Text>
                      </View>
                    )}

                  {/* Single table per month with one header */}
                  <View style={styles.table}>
                    {/* Table Header - Just once per month */}
                    <View fixed style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableHeaderCell, { flex: styles.dateColumn.flex }]}>
                        Datum
                      </Text>
                      <Text style={[styles.tableHeaderCell, { flex: styles.eReceiptColumn.flex }]}>
                        eRecept
                      </Text>
                      <Text
                        style={[styles.tableHeaderCell, { flex: styles.dispensaryColumn.flex }]}
                      >
                        Výdej
                      </Text>
                      <Text style={[styles.tableHeaderCell, { flex: styles.itemColumn.flex }]}>
                        Položky výdeje
                      </Text>
                      <Text style={[styles.tableHeaderCellRight, { flex: 0.5 }]}>
                        {tTable('ZapocitatelnyDoplatek')}
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderCellRight,
                          { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                        ]}
                      >
                        {tTable('ZapocitatelnyDoplatekPacient')}
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderCellRight,
                          { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                        ]}
                      >
                        {tTable('ZapocitatelnyDoplatekZP')}
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderCellRight,
                          { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                        ]}
                      >
                        {tTable('ZbytekDoLimitu')}
                      </Text>
                    </View>

                    {/* All data rows */}
                    {monthData.monthTables.map((table, tableIndex) => {
                      const date = new Date(table.date);
                      const formattedDateWithTime = formatDateWithTime(date);
                      // Split after the year (e.g., "12. 5. 2025 14:45" => ["12. 5. 2025", "14:45"])
                      const [datePart = '', timePart = ''] =
                        formattedDateWithTime.split(/(?<=\d{4})\s+/);

                      return (
                        <View key={`table-${table.date}-${tableIndex}`}>
                          {/* First row: Summary row with total count */}
                          {table.total && table.total.length > 0 ? (
                            <View style={[styles.tableRow, styles.tableRowFirst]} wrap={false}>
                              {/* Date column */}

                              <Text style={styles.dateColumn}>
                                <Text>{datePart}</Text>
                                {'\n'}
                                <Text style={styles.timePart}>{timePart}</Text>
                              </Text>

                              {/* eRecept column */}
                              <Text style={styles.eReceiptColumn}>{table.eRecept}</Text>

                              {/* Výdej column - ID_DOKLADU_VYDEJ */}
                              <Text style={styles.dispensaryColumn}>
                                {table.total[0] ? (
                                  <>
                                    {table.rows?.[0]?.[18] && (
                                      <>
                                        <Text style={styles.pharnacyName}>{table.rows[0][18]}</Text>
                                        <Text style={[styles.subText, { fontWeight: 'light' }]}>
                                          {'\n'}
                                          {table.rows[0][17]} {table.rows[0][14]}
                                          {table.rows[0][13] ? '/' : ''}
                                          {table.rows[0][13]} {', '}
                                          {table.rows[0][15]} {', '} {table.rows[0][16]}
                                        </Text>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  ''
                                )}
                              </Text>

                              {/* Položky výdeje - Count of items */}
                              <Text
                                style={[
                                  styles.itemColumn,
                                  { flex: (!isLandscape && 0.7) || undefined },
                                ]}
                              >
                                {table.total[1] ? `${+table.total[1]} položky` : ''}
                              </Text>

                              {/* ZapocitatelnyDoplatek */}
                              <Text
                                style={[
                                  styles.tableCellRight,
                                  { flex: isLandscape ? 0.5 : styles.amountColumn.flex },
                                ]}
                              >
                                {table.total[2] !== undefined
                                  ? `${formatNumber(+table.total[2])}`
                                  : ''}
                              </Text>

                              {/* ZapocitatelnyDoplatekPacient */}
                              <Text
                                style={[
                                  styles.tableCellRight,
                                  { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                                ]}
                              >
                                {table.total[3] !== undefined
                                  ? `${formatNumber(+table.total[3])}`
                                  : ''}
                              </Text>

                              {/* ZapocitatelnyDoplatekZP */}
                              <Text
                                style={[
                                  styles.tableCellRight,
                                  { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                                ]}
                              >
                                {table.total[4] !== undefined
                                  ? `${formatNumber(+table.total[4])}`
                                  : ''}
                              </Text>

                              {/* ZbytekDoLimitu */}
                              {+table.total[5] === 0 ? (
                                <Text
                                  style={[
                                    styles.tableCellRightGreen,
                                    { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                  ]}
                                >
                                  {table.total && table.total[5] !== undefined
                                    ? `${formatNumber(+table.total[5])}`
                                    : ''}
                                </Text>
                              ) : +table.total[5] < 0 ? (
                                <Text
                                  style={[
                                    styles.tableCellRightRed,
                                    { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                  ]}
                                >
                                  {table.total && table.total[5] !== undefined
                                    ? `${formatNumber(+table.total[5])}`
                                    : ''}
                                </Text>
                              ) : (
                                <Text
                                  style={[
                                    styles.tableCellRight,
                                    { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                  ]}
                                >
                                  {table.total && table.total[5] !== undefined
                                    ? `${formatNumber(+table.total[5])}`
                                    : ''}
                                </Text>
                              )}
                            </View>
                          ) : (
                            table.rows?.length > 0 && (
                              <View style={styles.tableRow} wrap={false}>
                                {/* Date column */}
                                <Text style={styles.dateColumn}>
                                  <Text>{datePart}</Text>
                                  {'\n'}
                                  <Text style={styles.timePart}>{timePart}</Text>
                                </Text>

                                {/* eRecept column */}
                                <Text style={styles.eReceiptColumn}>{table.eRecept}</Text>

                                {/* Výdej column - ID_DOKLADU_VYDEJ */}
                                <Text style={styles.dispensaryColumn}>
                                  {table.rows[0][DISPLAY_COLUMNS.ID_DOKLADU_VYDEJ] ? (
                                    <>
                                      {table.rows[0][18] && (
                                        <>
                                          <Text style={styles.pharnacyName}>
                                            {table.rows[0][18]}
                                          </Text>
                                          <Text style={[styles.subText, { fontWeight: 'light' }]}>
                                            {'\n'}
                                            {table.rows[0][17]} {table.rows[0][14]}
                                            {table.rows[0][13] ? '/' : ''}
                                            {table.rows[0][13]}
                                            {', '}
                                            {table.rows[0][15]}
                                            {', '}
                                            {table.rows[0][16]}
                                          </Text>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </Text>

                                {/* Položky výdeje */}
                                <Text style={styles.itemColumn}>
                                  {table.rows[0][DISPLAY_COLUMNS.ID_DOKLADU_VYDEJ] ? (
                                    <>
                                      {table.rows[0][3] && (
                                        <>
                                          {table.rows[0][19] && table.rows[0][19].includes('/') ? (
                                            <>
                                              <Text>{table.rows[0][19].split('/')[0]}</Text>
                                              {'\n'}
                                              <Text>
                                                {table.rows[0][19].split('/').slice(1).join('/')}
                                              </Text>
                                            </>
                                          ) : (
                                            <Text>{table.rows[0][19]}</Text>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </Text>

                                <Text style={[styles.tableCellRight, { flex: 0.5 }]}>
                                  {formatNumber(
                                    +table.rows[0][DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK],
                                  )}
                                </Text>
                                <Text
                                  style={[
                                    styles.tableCellRight,
                                    { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                                  ]}
                                >
                                  {formatNumber(
                                    +table.rows[0][DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_PACIENT],
                                  )}
                                </Text>
                                <Text
                                  style={[
                                    styles.tableCellRight,
                                    { flex: isLandscape ? 0.7 : styles.amountColumn.flex },
                                  ]}
                                >
                                  {formatNumber(
                                    +table.rows[0][DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_ZP],
                                  )}
                                </Text>
                                {+table.rows[0][DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU] === 0 ? (
                                  <Text
                                    style={[
                                      styles.tableCellRightGreen,
                                      { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                    ]}
                                  >
                                    {formatNumber(+table.rows[0][DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                  </Text>
                                ) : +table.rows[0][DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU] < 0 ? (
                                  <Text
                                    style={[
                                      styles.tableCellRightRed,
                                      { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                    ]}
                                  >
                                    {formatNumber(+table.rows[0][DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                  </Text>
                                ) : (
                                  <Text
                                    style={[
                                      styles.tableCellRight,
                                      { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                    ]}
                                  >
                                    {formatNumber(+table.rows[0][DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                  </Text>
                                )}
                              </View>
                            )
                          )}

                          {/* Individual item rows (skip first row if it was displayed with the date) */}
                          {table.rows?.length > 1 &&
                            table.rows
                              .slice(table.total && table.total.length > 0 ? 0 : 1)
                              .map((row, indexRow) => (
                                <View
                                  style={[styles.tableRow]}
                                  key={`row-${tableIndex}-${indexRow}`}
                                  wrap={false}
                                >
                                  {/* Empty Date column for non-first rows */}
                                  <Text style={styles.dateColumn}></Text>
                                  <View style={styles.eReceiptColumn}></View>
                                  {/* Empty eRecept column for non-first rows */}
                                  <Text style={styles.dispensaryColumn}></Text>
                                  {/* Výdej column - ID_DOKLADU_VYDEJ */}

                                  <View style={styles.itemColumn}>
                                    {row[2] && (
                                      <>
                                        {row[19] && row[19].includes('/') ? (
                                          <>
                                            <Text>{row[19].split('/')[0]}</Text>
                                            {'\n'}
                                            <Text>{row[19].split('/').slice(1).join('/')}</Text>
                                          </>
                                        ) : (
                                          <Text>{row[19]}</Text>
                                        )}
                                      </>
                                    )}
                                  </View>

                                  <Text
                                    style={[
                                      styles.tableCellRight,
                                      { fontWeight: 'light', flex: 0.5 },
                                    ]}
                                  >
                                    {row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK] !== undefined
                                      ? formatNumber(+row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK])
                                      : ''}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.tableCellRight,
                                      {
                                        flex: isLandscape ? 0.7 : styles.amountColumn.flex,
                                        fontWeight: 'light',
                                      },
                                    ]}
                                  >
                                    {row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_PACIENT] !==
                                    undefined
                                      ? formatNumber(
                                          +row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_PACIENT],
                                        )
                                      : ''}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.tableCellRight,
                                      {
                                        flex: isLandscape ? 0.7 : styles.amountColumn.flex,
                                        fontWeight: 'light',
                                      },
                                    ]}
                                  >
                                    {row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_ZP] !== undefined
                                      ? formatNumber(
                                          +row[DISPLAY_COLUMNS.ZAPOCITATELNY_DOPLATEK_ZP],
                                        )
                                      : ''}
                                  </Text>
                                  {+row[DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU] === 0 ? (
                                    <Text
                                      style={[
                                        styles.tableCellRightGreen,
                                        { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                      ]}
                                    >
                                      {formatNumber(+row[DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                    </Text>
                                  ) : +row[DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU] < 0 ? (
                                    <Text
                                      style={[
                                        styles.tableCellRightRed,
                                        { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                      ]}
                                    >
                                      {formatNumber(+row[DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                    </Text>
                                  ) : (
                                    <Text
                                      style={[
                                        styles.tableCellRight,
                                        { flex: isLandscape ? 0.4 : styles.amountColumn.flex },
                                      ]}
                                    >
                                      {formatNumber(+row[DISPLAY_COLUMNS.ZBYTEK_DO_LIMITU])}
                                    </Text>
                                  )}
                                </View>
                              ))}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}

        {/* Footer with page numbers */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
