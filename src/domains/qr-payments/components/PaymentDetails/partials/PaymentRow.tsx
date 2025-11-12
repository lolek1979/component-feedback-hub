'use client;';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Itrash from '@/core/assets/icons/delete_forever.svg';
import { formatDecimal } from '@/core/auth/utils';
import { Input, Text } from '@/design-system/atoms';
import useDataVS from '@/domains/qr-payments/api/query/useDataVS';
import { useClientStore } from '@/domains/qr-payments/stores/clientStore';
import { usePaymentDetailsStore } from '@/domains/qr-payments/stores/paymentStore';

import styles from '../PaymentDetails.module.css';

import { DynamicSelect } from '@/design-system';

/**
 * Props for the PaymentRow component.
 */
interface PaymentRowProps {
  /**
   * Unique identifier for the row, used for accessibility or testing.
   */
  id: string;

  /**
   * Index of the row in the list (e.g., 0, 1, 2).
   */
  index: number;

  /**
   * Indicates whether this is the first row. Used for conditional styling or logic.
   */
  firstRow?: boolean;

  /**
   * Optional Social Security Number (SSN) passed down for context or data binding.
   */
  ssn?: string;
}

/**
 * Renders a single row in the payment details section.
 *
 * @param id - Unique identifier for the row.
 * @param index - Index of the row.
 * @param firstRow - Flag indicating if this is the first row.
 * @param ssn - Optional SSN for contextual data.
 * @returns JSX.Element
 */

export const PaymentRow = ({ id, index, firstRow = false, ssn = '' }: PaymentRowProps) => {
  const t = useTranslations('QRCodes.paymentDetails');
  const [isStandard, setIsStandard] = useState(true);
  const rows = usePaymentDetailsStore((state) => state.rows);
  const setRow = usePaymentDetailsStore((state) => state.setRow);
  const removeRow = usePaymentDetailsStore((state) => state.removeRow);
  const up = useClientStore((state) => state.localOffice);
  const payerType = useClientStore((state) => state.payerType);
  const symbols = useDataVS({ up: up, tpShrt: rows[index].type, type: payerType });

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d,]/g, '').replace(/^0$/, '');
      setRow(index, { amount: value });
    },
    [index, setRow],
  );

  const formatAmount = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      //Formats value to fit VZP standarts. E.g: 1525.1 => 1 512,10
      const input = e.target.value;
      if (!input) return;

      const number = parseFloat(input.replace(',', '.'));

      setRow(index, { amount: formatDecimal(number) });
    },
    [index, setRow],
  );

  const handleVariable = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
      // Formats the response from getDataVS and returns the number prefix e.g: 154 212 408
      const numbersOnly = symbols.data?.map((item) => {
        const match = item.match(/\d+/);

        return match ? match[0] : '';
      });

      const vsField = numbersOnly ?? [];

      // Checks if the prefix of the vs matches any of the prefixes that we got from BE. If so it is standart / else it is not ..
      const isStandard = vsField.some((code) => value.startsWith(code));
      setIsStandard(isStandard);
      setRow(index, { symbol: value });
    },
    [index, setRow, symbols.data],
  );

  useEffect(() => {
    if (!rows[index].symbol) {
      setIsStandard(true);
    }
  }, [index, rows, setIsStandard]);

  const handleSelect = useCallback(
    //If payment type is 1 or 2 it automatically prefills the vs with ico/ssn. else it uses users input
    (input: string) => {
      if (input === '1' || input === '2') {
        setRow(index, { symbol: ssn });
        setIsStandard(true);
      }

      setRow(index, { type: input });
    },
    [index, setRow, ssn],
  );

  const handleTrash = () => {
    //resets data in a row
    removeRow(index);
    setIsStandard(true);
  };

  const { amount, symbol, type } = rows[index];

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.paymentCell} ${styles.firstCell}`}>
        {firstRow && (
          <Text variant="label" regular htmlFor={`${id}-type`}>
            {t('label1')}
          </Text>
        )}

        <DynamicSelect
          code="QR-Typ-Platby"
          valueColumnIndex={1}
          labelColumnIndexes={[2]}
          onChange={handleSelect}
          value={type}
          placeholder={'Vyberte'}
          id={`${id}-type`}
        />
      </div>

      <div className={styles.paymentCell}>
        {firstRow && (
          <Text variant="label" regular htmlFor={`${id}-amount`}>
            {t('label2')}
          </Text>
        )}
        <Input
          value={amount}
          onChange={handleAmountChange}
          onBlur={formatAmount}
          currency="Kč"
          isError={!amount && (!!type || !!symbol)}
          helperText={!amount && (!!type || !!symbol) ? t('errMessage') : ' '}
          id={`${id}-amount`}
        />
      </div>

      <div className={styles.paymentCell}>
        {firstRow && (
          <Text variant="label" regular htmlFor={`${id}-symbol`}>
            {t('label3')}
          </Text>
        )}
        <Input
          value={symbol}
          onChange={handleVariable}
          disabled={symbol === ssn && (type === '1' || type === '2')}
          isError={!symbol && (!!type || !!amount)}
          helperVariant={!isStandard ? 'warning' : 'default'}
          helperText={
            !symbol && (!!type || !!amount) ? t('errVs') : !isStandard ? t('warningVS') : ' '
          }
          id={`${id}-symbol`}
        />
      </div>

      <div className={`${styles.icon} ${firstRow ? styles.first : ''}`}>
        {(symbol || amount || type) && (
          <Itrash onClick={() => handleTrash()} id={`icon${id}-delete`} width={24} height={24} />
        )}
      </div>
    </div>
  );
};
