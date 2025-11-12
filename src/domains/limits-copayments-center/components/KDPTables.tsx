import { useTranslations } from 'next-intl';

import ICached from '@/core/assets/icons/icon-cached.svg';
import ISuccess from '@/core/assets/icons/icon-success.svg';
import Iinfo from '@/core/assets/icons/info.svg';
import { formatDateWithTime, formatNumber } from '@/core/auth/utils';
import { Text, Tooltip } from '@/design-system/atoms';
import {
  InlineMessage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/design-system/molecules';
import { useSyncScroll } from '@/domains/limits-copayments-center/services/useSyncScroll';

import { DISPLAY_COLUMNS, TGroupedData, TMonthData } from '../services/utils';
import styles from './../index.module.css';
import { EPrescriptionHeader } from './EPrescriptionHeader';
import { MonthHeader } from './MonthHeader';

interface KDPTablesProps {
  suklDataRows: TGroupedData;
  year: number;
  isPrinting?: boolean;
  showDetails?: boolean;
}

const KDPTables = ({
  suklDataRows,
  year,
  isPrinting = false,
  showDetails = false,
}: KDPTablesProps) => {
  const t = useTranslations('KDPPage');
  const tTable = useTranslations('KDPTable');

  const isLimitReached = (monthData: TMonthData) => {
    return monthData.monthTables.some((table) => table.rows?.some((row) => Number(row[7]) <= 0));
  };

  const renderCell = (
    row: string[],
    columnIndex: number,
    index: number,
    month: string,
    tableIndex: number,
  ) => {
    if (columnIndex === 2) {
      // ID_DOKLADU_VYDEJ
      const pharmacyName = row[18];
      const streetName = row[17];
      const streetNumber = row[14];
      const streetNumberOrient = row[13];
      const city = row[15];
      const postalCode = row[16];

      if (!pharmacyName || pharmacyName.trim() === '') {
        return (
          <Text variant="subtitle" regular className={styles.bodyText}>
            {row[2]}
          </Text>
        );
      }

      const tooltipContent = (
        <Text variant="subtitle" regular>
          {`${streetName} ${streetNumber}${streetNumberOrient ? `/${streetNumberOrient}` : ''}`}
          <br />
          {`${city}`}
          <br />
          {postalCode}
          {row[18].length >= 24 ? (
            <>
              <br />
              {pharmacyName}
            </>
          ) : null}
        </Text>
      );

      return (
        <div className={styles.cellContent}>
          <Text variant="subtitle" regular className={styles.bodyText}>
            {row[2]}
          </Text>
          {showDetails && pharmacyName && (
            <div className={`${styles.textRight} ${styles.tooltipText}`}>
              {row[18].length >= 24 ? (
                <Tooltip
                  variant="inverse"
                  placement="tooltipTop"
                  content={tooltipContent}
                  id={`tooltip-kdp-table-pharmacy-details-${month}-${tableIndex}-${index}`}
                >
                  <Text variant="caption" className={`${styles.subText} ${styles.dotted}`}>
                    {pharmacyName}
                  </Text>
                </Tooltip>
              ) : (
                <Tooltip
                  variant="inverse"
                  placement="tooltipTop"
                  content={tooltipContent}
                  id={`tooltip-kdp-table-pharmacy-details-${month}-${tableIndex}-${index}`}
                >
                  <Text variant="subtitle" className={`${styles.subText} ${styles.dotted}`}>
                    {pharmacyName}
                  </Text>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      );
    }

    if (columnIndex === 3) {
      // ID_VLP
      return (
        <div className={styles.drugContent}>
          <Text variant="subtitle" className={styles.bodyText}>
            {row[3] || '-'}
          </Text>
          {showDetails && row[3] && (
            <div className={`${styles.textRight} ${styles.tooltipText}`}>
              {row[19].length >= 24 ? (
                <Tooltip
                  variant="inverse"
                  placement="tooltipTop"
                  content={row[19]}
                  id={`tooltip-kdp-table-drug-details-${month}-${tableIndex}-${index}`}
                >
                  <Text variant="caption" className={`${styles.subText} ${styles.dotted}`}>
                    {row[19]}
                  </Text>
                </Tooltip>
              ) : (
                <Text variant="subtitle" className={`${styles.subText}`}>
                  {row[19]}
                </Text>
              )}
            </div>
          )}
        </div>
      );
    }

    if (columnIndex > 3) {
      return (
        <Text
          variant="subtitle"
          regular
          className={
            columnIndex === 7 && +row[columnIndex] === 0
              ? styles.greenAmount
              : +row[columnIndex] < 0
                ? styles.redAmount
                : styles.bodyText
          }
        >
          {`${formatNumber(+row[columnIndex])}`}
        </Text>
      );
    }

    return (
      <Text variant="subtitle" className={styles.bodyText}>
        {row[columnIndex]}
      </Text>
    );
  };

  useSyncScroll(suklDataRows);

  return (
    <>
      {suklDataRows &&
        Object.keys(suklDataRows)
          ?.sort((a, b) => +b - +a)
          ?.map((month, index) => {
            const monthData: TMonthData = suklDataRows[month];
            const limitReached = isLimitReached(monthData);

            return (
              <div key={month}>
                <MonthHeader
                  month={month}
                  year={year.toString()}
                  limit={limitReached ? 0 : monthData.monthLimit}
                  limitTotal={monthData.monthLimit}
                  isPrinting={isPrinting}
                  isLimitReached={limitReached}
                />
                {limitReached && (
                  <InlineMessage
                    id={'inline-message-cld-tables-limit-reached-' + month}
                    icon={
                      <ISuccess
                        id={'icon-cld-tables-success' + index}
                        width={20}
                        height={20}
                        className="icon_green-500"
                      />
                    }
                    message={t('limitReachedMessage', {
                      amount: formatNumber(monthData.monthLimit) ?? '0',
                    })}
                    variant="success"
                    className={styles.inlineMessage}
                  />
                )}

                <div id={'month-' + month} className={styles.tableContainerKdp}>
                  {monthData.monthLimit &&
                    monthData.beforeMonthLimit &&
                    monthData.beforeMonthLimit !== monthData.monthLimit && (
                      <InlineMessage
                        id={'inline-message-cld-tables-limit-changed-' + month}
                        icon={<ICached id={'icon-cld-tables-cached' + index} />}
                        message={t('changeLimit', {
                          from: formatNumber(monthData.beforeMonthLimit) ?? '0',
                          to: formatNumber(monthData.monthLimit) ?? '0',
                        })}
                        variant="info"
                        className={styles.inlineMessage}
                      />
                    )}

                  {monthData.monthTables.map((table, tableIndex) => {
                    const date = new Date(table.date);
                    const formattedDate = formatDateWithTime(date);
                    const isLimitOverPaid = table.rows?.some((row) => +row[7] < 0);

                    return (
                      <div key={table.date}>
                        <div className={styles.ereceptHeader}>
                          <EPrescriptionHeader
                            date={formattedDate}
                            prescriptionCode={table.eRecept}
                            isLimitOverPaid={isLimitOverPaid}
                          />
                        </div>
                        <div
                          id={`scroll-table-${month}-${tableIndex}`}
                          className={styles.scrollContainer}
                          style={{ overflowX: 'auto' }}
                        >
                          <Table className={styles.tableKdp}>
                            <TableHead className={styles.tableHead}>
                              {isLimitOverPaid && (
                                <div className={styles.overPaid}>
                                  <Iinfo
                                    id="icon-kdp-tables-overpaid"
                                    width={24}
                                    height={24}
                                    className={'icon_red-400'}
                                  />
                                  <Text variant="subtitle" className={styles.overPaidText}>
                                    {t('overPaid')}
                                  </Text>
                                </div>
                              )}
                              <TableRow className={styles.tableHeadRow}>
                                <TableCell isHeader align="right">
                                  <Text variant="subtitle" regular>
                                    {tTable('VYD')}
                                  </Text>
                                </TableCell>
                                <TableCell isHeader align="right">
                                  <Text variant="subtitle" regular>
                                    {tTable('LP')}
                                  </Text>
                                </TableCell>
                                <TableCell isHeader align="right">
                                  <Tooltip
                                    variant="inverse"
                                    placement="tooltipTop"
                                    content={tTable('ZapocitatelnyDoplatekTT')}
                                    id={`tooltip-kdp-table-header-tooltip-zapocitatelny-doplatek-${month}-${tableIndex}`}
                                  >
                                    <Text variant="subtitle" regular className={styles.dashed}>
                                      {tTable('ZapocitatelnyDoplatek')}
                                    </Text>
                                  </Tooltip>
                                </TableCell>
                                <TableCell isHeader align="right">
                                  <Tooltip
                                    variant="inverse"
                                    placement="tooltipTop"
                                    content={tTable('ZapocitatelnyDoplatekPacientTT')}
                                    id={`tooltip-kdp-table-header-tooltip-zapocitatelny-doplatek-pacient-${month}-${tableIndex}`}
                                  >
                                    <Text variant="subtitle" regular className={styles.dashed}>
                                      {tTable('ZapocitatelnyDoplatekPacient')}
                                    </Text>
                                  </Tooltip>
                                </TableCell>
                                <TableCell isHeader align="right">
                                  <Tooltip
                                    variant="inverse"
                                    placement="tooltipTop"
                                    content={tTable('ZapocitatelnyDoplatekZPTT')}
                                    id={`tooltip-kdp-table-header-tooltip-zapocitatelny-doplatek-zp-${month}-${tableIndex}`}
                                  >
                                    <Text variant="subtitle" regular className={styles.dashed}>
                                      {tTable('ZapocitatelnyDoplatekZP')}
                                    </Text>
                                  </Tooltip>
                                </TableCell>
                                <TableCell isHeader align="right">
                                  <Text variant="subtitle" regular>
                                    {tTable('ZbytekDoLimitu')}
                                  </Text>
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody className={styles.tableBody}>
                              {table.total?.length && (
                                <TableRow className={styles.totalRow}>
                                  {table.total.map((item, index) => (
                                    <TableCell key={`total-${item}-${index}`} align="right">
                                      {index === 0 && (
                                        <Text variant="subtitle">
                                          {table.rows?.length > 0 &&
                                            renderCell(table.rows[0], 2, 0, month, tableIndex)}
                                        </Text>
                                      )}
                                      {index === 1 && (
                                        <Text variant="subtitle">{`${item} ${tTable('rows')}`}</Text>
                                      )}
                                      {index > 1 && (
                                        <Text
                                          variant="subtitle"
                                          className={
                                            index === 5 && +item === 0
                                              ? styles.greenAmount
                                              : +item < 0
                                                ? styles.redAmount
                                                : undefined
                                          }
                                        >
                                          {`${formatNumber(+item)}`}
                                        </Text>
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                              {table.rows?.length &&
                                table.rows.map((row, indexRow) => (
                                  <TableRow
                                    key={`${table.date}-row-${indexRow}`}
                                    className={styles.dataRow}
                                  >
                                    {Object.values(DISPLAY_COLUMNS).map((columnIndex) => (
                                      <TableCell
                                        key={`${table.date}-item-${columnIndex}-${indexRow}`}
                                        align="right"
                                      >
                                        {table.total?.length && columnIndex === 2
                                          ? null
                                          : renderCell(
                                              row,
                                              columnIndex,
                                              indexRow,
                                              month,
                                              tableIndex,
                                            )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                          <div
                            id={`custom-scrollbar-${month}-${tableIndex}`}
                            className={styles.scrollBar}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
    </>
  );
};

export default KDPTables;
