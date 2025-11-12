import React from 'react';

import CancelIcon from '@/core/assets/icons/cancel_xl.svg';
import CheckCircleIcon from '@/core/assets/icons/check_circle_xl.svg';
import { Button, Text } from '@/design-system/atoms';

import styles from './ComparisonResult.module.css';

export type ComparisonResultVariant = 'success' | 'error';

export interface ComparisonResultProps {
  variant: ComparisonResultVariant;
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  id: string;
}

export const ComparisonResult = ({
  variant,
  title,
  description,
  onRetry,
  retryLabel = 'Zkusit znovu',
  className = '',
  id,
}: ComparisonResultProps) => {
  const Icon = variant === 'success' ? CheckCircleIcon : CancelIcon;

  return (
    <div
      className={`${styles.container} ${styles[variant]} ${className}`}
      data-testid={`comparison-result-${variant}`}
      id={id}
    >
      <div className={styles.iconContainer}>
        <Icon className={styles.icon} id="icon-comparison-result" />
      </div>

      <Text variant="h4" className={styles.title}>
        {title}
      </Text>

      <Text variant="subtitle" regular className={styles.description}>
        {description}
      </Text>

      {variant === 'error' && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className={styles.retryButton}
          id={`${id}-retry-button`}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
