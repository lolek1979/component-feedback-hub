import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './EPrescriptionHeader.module.css';

interface EPrescriptionHeaderProps {
  date: string;
  prescriptionCode: string;
  isLimitOverPaid?: boolean;
}

export const EPrescriptionHeader = ({
  date,
  prescriptionCode,
  isLimitOverPaid = false,
}: EPrescriptionHeaderProps) => {
  const t = useTranslations('EPrescriptionHeader');

  return (
    <header
      className={`${styles.prescriptionHeader} ${isLimitOverPaid ? styles.overPaid : ''}`}
      aria-label="Prescription Header"
    >
      <div className={styles.contentColumn}>
        <Text
          variant="body"
          className={styles.dateHeader}
          aria-label={`Prescription Date: ${date}`}
        >
          {date}
        </Text>
        <div className={styles.codeContainer}>
          <Text
            variant="subtitle"
            className={styles.dateHeader}
            aria-label={`Prescription Code: ${prescriptionCode}`}
          >
            {`${t('eRecept')} ${prescriptionCode}`}
          </Text>
        </div>
      </div>
    </header>
  );
};
