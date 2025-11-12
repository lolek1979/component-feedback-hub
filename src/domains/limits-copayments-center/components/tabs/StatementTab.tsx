'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Divider } from '@/design-system/atoms';
import { Typography } from '@/design-system/molecules';

import styles from './StatementTab.module.css';

interface StatementTabProps {
  isError?: boolean;
  isLoading?: boolean;
  error?: {
    status: string | number;
    message?: string;
  };
  onRetry?: () => void;
  data?: {
    request?: {
      requestedDate?: string;
      department?: string;
      messageText?: string;
    };
    expertStatement?: {
      answeredDate?: string;
      author?: string;
      statement?: string;
    };
  };
}

export const StatementTab = ({ data }: StatementTabProps) => {
  const t = useTranslations('KDPPage.statementTab');

  return (
    <div className={styles.container}>
      {/* Request Section */}
      <div className={styles.section}>
        <div className={`${styles.row} ${styles.sectionHeader}`}>
          <div className={styles.cellLeft}>
            <Typography variant="Subtitle/Default/Bold" component="div">
              {t('request')}
            </Typography>
          </div>
          <div className={styles.cellRight}>
            <div className={styles.spacer} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.cellLeft}>
            <Typography variant="Subtitle/Default/Regular">{t('requestedDate')}</Typography>
          </div>
          <div className={styles.cellRight}>
            <Typography variant="Subtitle/Default/Bold">
              {data?.request?.requestedDate || '21.2.2024'}
            </Typography>
          </div>
        </div>

        <Divider variant="dotted" className={styles.divider} />

        <div className={styles.row}>
          <div className={styles.cellLeft}>
            <Typography variant="Subtitle/Default/Regular">{t('department')}</Typography>
          </div>
          <div className={styles.cellRight}>
            <Typography variant="Subtitle/Default/Bold">
              {data?.request?.department || 'OZP'}
            </Typography>
          </div>
        </div>

        <Divider variant="dotted" className={styles.divider} />

        <div className={styles.row}>
          <div className={styles.cellLeft}>
            <Typography variant="Subtitle/Default/Regular">{t('messageText')}</Typography>
          </div>
          <div className={styles.cellRight}>
            <Typography variant="Subtitle/Default/Bold">
              {data?.request?.messageText ||
                'Prosím o upřesnění, zda sit amet magna sit amet purus sagittis consequat. Integer imperdiet, nibh non ultricies feugiat, velit ligula posuere ipsum, vitae dictum risus ligula at metus.'}
            </Typography>
          </div>
        </div>

        <Divider variant="dotted" className={styles.divider} />
      </div>

      {/* Expert Statement Section */}
      <div className={styles.section}>
        <Typography variant="Body/Bold" component="div" className={styles.sectionTitle}>
          {t('expertStatement')}
        </Typography>
      </div>
    </div>
  );
};
