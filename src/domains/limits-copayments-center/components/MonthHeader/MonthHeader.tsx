'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import IconInfo from '@/core/assets/icons/info.svg';
import { formatNumber } from '@/core/auth/utils';
import { Button, Text } from '@/design-system/atoms';

import { KdpModalTooltip } from '../KdpResultHeader';
import styles from './MonthHeader.module.css';

interface MonthHeaderProps {
  month?: string;
  year?: string;
  limit?: number;
  limitTotal?: number;
  isPrinting?: boolean;
  isLimitReached?: boolean;
}

export const MonthHeader = ({
  month,
  limit,
  year,
  limitTotal,
  isPrinting = false,
  isLimitReached = false,
}: MonthHeaderProps) => {
  const t = useTranslations('MonthsHeader');
  const tKdp = useTranslations('KDPResultHeader');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.monthHeader}>
      <Text
        variant="h4"
        className={styles.month}
        selectable={false}
        aria-label={`${t(month || '')} ${year || ''}`}
      >
        {`${t(month || '')} ${year}`}
      </Text>
      {!isLimitReached ? (
        <Text variant="body" className={styles.limit} ariaLive="polite">
          {`${tKdp('hasToPay')} ${formatNumber(limit)}`}
          {!isPrinting && (
            <Button
              id={'button-month-header-info-' + month + '-' + year}
              variant="unstyled"
              onClick={() => setIsModalOpen(true)}
              ariaLabel="info"
            >
              <IconInfo
                id={'icon-month-header-info-' + month + '-' + year}
                width={24}
                height={24}
                className={styles.iconInfo}
              />
            </Button>
          )}
        </Text>
      ) : (
        <div className={styles.limitReached} aria-live="polite">
          <Text variant="body" selectable={false} ariaLabel={t('LimReached')}>
            {t('LimReached')}{' '}
          </Text>
          <Text
            variant="body"
            className={styles.greenText}
            selectable={false}
            ariaLabel={`${formatNumber(limitTotal)}`}
          >
            {`${formatNumber(limitTotal)}`}
          </Text>
          {!isPrinting && (
            <Button
              id={'button-month-header-info-' + month + '-' + year}
              variant="unstyled"
              onClick={() => setIsModalOpen(true)}
              ariaLabel="info"
            >
              <IconInfo
                id={'icon-month-header-info-' + month + '-' + year}
                width={24}
                height={24}
                className={styles.iconInfo}
              />
            </Button>
          )}
        </div>
      )}

      <KdpModalTooltip isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};
