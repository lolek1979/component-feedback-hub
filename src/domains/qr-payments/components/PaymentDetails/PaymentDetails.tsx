import { useTranslations } from 'next-intl';

import { Divider, Text } from '@/design-system/atoms';

import { PaymentRow } from './partials/PaymentRow';
import styles from './PaymentDetails.module.css';

/**
 * Props for the PaymentDetails component.
 */
interface PaymentDetailsProps {
  /**
   * Optional Social Security Number (SSN) used for identifying the payment context.
   */
  ssn?: string;
}

/**
 * Displays the payment details section including a title and three payment rows.
 *
 * @param ssn - Optional SSN passed to each PaymentRow component.
 * @returns JSX.Element
 */

export const PaymentDetails = ({ ssn }: PaymentDetailsProps) => {
  const t = useTranslations('QRCodes.paymentDetails');

  return (
    <div className={styles.container}>
      <Divider variant="subtle" />
      <Text variant="headline">{t('paymentTitle')}</Text>
      <div className={styles.paymentContainer}>
        {[0, 1, 2].map((idx) => (
          <PaymentRow
            key={idx}
            index={idx}
            id={`payment-row-${idx}`}
            firstRow={idx === 0}
            ssn={ssn}
          />
        ))}
      </div>
    </div>
  );
};
