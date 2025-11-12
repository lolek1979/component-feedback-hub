'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './PdfComparisonHeader.module.css';

export interface PdfComparisonHeaderProps {
  matchPercentage: number;
  leftFileName?: string;
  rightFileName?: string;
  className?: string;
  id?: string;
}

export const PdfComparisonHeader = ({
  matchPercentage,
  className = '',
  id,
}: PdfComparisonHeaderProps) => {
  const t = useTranslations('PdfComparison');

  return (
    <div
      className={`${styles.comparisonHeader} ${className}`}
      data-testid="pdf-comparison-header"
      id={id}
    >
      <div className={styles.matchPercentage}>
        <Text variant="headline">
          {t('results.differences.matchPercentage', { percentage: matchPercentage })}
        </Text>
      </div>
    </div>
  );
};
