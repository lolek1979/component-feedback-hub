import { useTranslations } from 'next-intl';

import { formatDateWithTime, formatNumber } from '@/core/auth/utils';
import { Text } from '@/design-system/atoms';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/design-system/molecules';

import styles from '../index.module.css';
import { DISPLAY_COLUMNS, TMonthData } from '../services/utils';
import { EPrescriptionHeader } from './EPrescriptionHeader';

export const KDPTable = ({ monthData }: { monthData: TMonthData }) => {
  const tTable = useTranslations('KDPTable');

  return (
    <>
      {monthData.monthTables.map((table) => {
        const date = new Date(table.date);
        const formattedDate = formatDateWithTime(date);
        const isLimitOverPaid = table.rows?.some((row) => +row[7] < 0);

        return (
          <div className={styles.ereceptWrapper} key={table.date}>
            <div className={styles.ereceptHeader}>
              <EPrescriptionHeader
                date={formattedDate}
                prescriptionCode={`eRecept ${table.eRecept}`}
                isLimitOverPaid={isLimitOverPaid}
              />
            </div>
            <Table className={styles.printTableWrapper}>
              <TableHead>
                <TableRow>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('VYD')}</Text>
                  </TableCell>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('LP')}</Text>
                  </TableCell>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('ZapocitatelnyDoplatek')}</Text>
                  </TableCell>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('ZapocitatelnyDoplatekPacient')}</Text>
                  </TableCell>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('ZapocitatelnyDoplatekZP')}</Text>
                  </TableCell>
                  <TableCell isHeader align="left">
                    <Text variant="body">{tTable('ZbytekDoLimitu')}</Text>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {table.total?.length && (
                  <TableRow>
                    {table.total.map((item, index) => (
                      <TableCell key={`total-${item}-${index}`}>
                        {index === 0 && <Text variant="subtitle">{item}</Text>}
                        {index === 1 && (
                          <Text variant="subtitle">{`${item} ${tTable('rows')}`}</Text>
                        )}
                        {index > 1 && <Text variant="subtitle">{`${formatNumber(+item)}`}</Text>}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
                {table.rows?.length &&
                  table.rows.map((row, indexRow) => (
                    <TableRow key={`${table.date}-row-${indexRow}`}>
                      {Object.values(DISPLAY_COLUMNS).map((columnIndex) => (
                        <TableCell key={`${table.date}-item-${columnIndex}-${indexRow}`}>
                          <Text variant="body">
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
    </>
  );
};
