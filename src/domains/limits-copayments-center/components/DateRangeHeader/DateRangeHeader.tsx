import React from 'react';
import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './DateRangeHeader.module.css';

export interface DateRangeHeaderProps {
  dateRange: string;
  dataSource: string;
}

export const DateRangeHeader = ({ dateRange, dataSource }: DateRangeHeaderProps) => {
  const t = useTranslations('DateRangeHeader');

  return (
    <header className={styles.dateRange} aria-label={t('dateRangeHeaderLabel')}>
      <Text variant="h4" ariaLabel={t('dateRange')}>
        {dateRange}
      </Text>
      <Text variant="subtitle" role="note" regular ariaLabel={t('dataSource')} color="secondary">
        {dataSource}
      </Text>
    </header>
  );
};
