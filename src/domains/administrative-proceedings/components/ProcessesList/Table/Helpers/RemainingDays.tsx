'use client';

import { useTranslations } from 'next-intl';

import IconWarning from '@/core/assets/icons/icon-warning.svg';
import { Text, Tooltip } from '@/design-system/atoms';

import styles from './RemainingDays.module.css';

interface RemainingDaysProps {
  deadlineDate: string | null;
}

/**
 * Max value of remaining days marked as warning.
 */
const warningLimitDays = 8;

const RemainingDays = (props: RemainingDaysProps) => {
  const { deadlineDate } = props;
  const days = deadlineDate
    ? Math.ceil((new Date(deadlineDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;
  const formattedDate = deadlineDate ? new Date(deadlineDate).toLocaleDateString('cs-CZ') : '';

  const t = useTranslations('administrativeProceedings');

  return (
    <Tooltip
      placement="tooltipTop"
      variant="inverse"
      content={formattedDate}
      id="tooltip-processes-remaining-days"
    >
      {days <= warningLimitDays ? (
        <div className={styles.remainingDaysWarning}>
          <IconWarning id="icon-remaining-days-warning" />
          <Text className={styles.warningLabel}>{t('remainingDays', { count: days })}</Text>
        </div>
      ) : (
        <Text className={styles.remainingDays}>{t('remainingDays', { count: days })}</Text>
      )}
    </Tooltip>
  );
};

export default RemainingDays;
