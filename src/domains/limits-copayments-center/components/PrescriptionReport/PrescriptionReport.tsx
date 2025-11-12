import React from 'react';

import SuccessMark from '@/core/assets/icons/icon-success.svg';
import { formatNumber } from '@/core/auth/utils';
import { InlineMessage, Table } from '@/design-system/molecules';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/design-system/molecules/Table/partials';

import { DateRangeHeader } from '../DateRangeHeader';
import { EPrescriptionHeader } from '../EPrescriptionHeader';
import { KdpResultHeader } from '../KdpResultHeader';
import { MonthHeader } from '../MonthHeader';
import styles from './PrescriptionReport.module.css';

export interface PrescriptionReportProps {
  patientName: string;
  patientId: string;
  dateRange: string;
  dataSource: string;
  transactions: Transaction[];
  limitAmount: number;
}

export interface Transaction {
  date: string;
  receiptId: string;
  expenditureId: string;
  itemCode: string;
  copayment: number;
  paidByPatient: number;
  paidByInsurance: number;
  remainingLimit: number | null;
  items?: TransactionItem[];
}

export interface TransactionItem {
  itemCode: string;
  copayment: number;
  paidByPatient: number;
  paidByInsurance: number;
}

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('cs-CZ')} Kč`;
};

export const PrescriptionReport = ({
  patientName,
  patientId,
  dateRange,
  dataSource,
  limitAmount,
  transactions,
}: PrescriptionReportProps) => {
  return (
    <div className={styles.report} role="region" aria-label="Prescription Report">
      <KdpResultHeader
        insuranceNum={patientId}
        name={patientName}
        hasToPayTotal={limitAmount}
        limit={limitAmount}
      />

      <DateRangeHeader dateRange={dateRange} dataSource={dataSource} />

      {transactions.map((transaction, index) => {
        const date = new Date(transaction.date);
        const currentMonth = (date.getMonth() + 1).toString();
        const currentYear = date.getFullYear().toString();

        return (
          <div
            key={`${transaction.expenditureId}-${index}`}
            role="group"
            aria-label={`Transaction ${index + 1}`}
          >
            <MonthHeader month={currentMonth} year={currentYear} limit={0} limitTotal={5000} />
            {limitAmount > 0 && (
              <div className={styles.limitMessage}>
                <InlineMessage
                  id="inline-message-report-limit-accomplished"
                  message={`Byl dosažen limit doplatků hrazených pacientem ${formatNumber(limitAmount)}. Odteď jsou výdeje hrazeny pouze z pojištění.`}
                  icon={
                    <SuccessMark
                      id={'icon-prescription-report-success-' + index}
                      className="icon_green-500"
                    />
                  }
                  variant="success"
                />
              </div>
            )}
            <section
              className={styles.monthSection}
              role="region"
              aria-label={`Month Section ${currentMonth}/${currentYear}`}
            >
              <EPrescriptionHeader
                date={date.toLocaleString('cs-CZ', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                prescriptionCode={transaction.receiptId}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Výdej</TableCell>
                    <TableCell align="right">Položky výdeje</TableCell>
                    <TableCell align="right">Započitatelné doplatky</TableCell>
                    <TableCell align="right">Doplatky hrazené pacientem</TableCell>
                    <TableCell align="right">Doplatky hrazené pojištěním</TableCell>
                    <TableCell align="right">Do limitu zbývá pacientovi uhradit</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell align="right">{transaction.expenditureId}</TableCell>
                    <TableCell align="right">{transaction.itemCode}</TableCell>
                    <TableCell align="right">{formatCurrency(transaction.copayment)}</TableCell>
                    <TableCell align="right">{formatCurrency(transaction.paidByPatient)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.paidByInsurance)}
                    </TableCell>
                    <TableCell align="right">
                      {transaction.remainingLimit !== null
                        ? formatCurrency(transaction.remainingLimit)
                        : '0 Kč'}
                    </TableCell>
                    <TableCell align="right">
                      <button aria-label="Action button">tse</button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
          </div>
        );
      })}
    </div>
  );
};
