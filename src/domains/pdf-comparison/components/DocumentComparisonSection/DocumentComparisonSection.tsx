import React from 'react';

import { Divider, Text } from '@/design-system/atoms';

import styles from './DocumentComparisonSection.module.css';

export interface DocumentComparisonSectionProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: string;
  rightContent: string;
  pageInfo?: string;
  className?: string;
  id: string;
}

export const DocumentComparisonSection = ({
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
  pageInfo,
  className = '',
  id,
}: DocumentComparisonSectionProps) => {
  return (
    <>
      <div className={`${styles.containerTitle} ${className}`}>
        <div className={styles.comparisonRow}>
          <div className={styles.documentSection}>
            <div className={styles.titleWithIcon}>
              <Text variant="subtitle" id="document-comparison-section-left-title">
                {leftTitle}
              </Text>
            </div>
          </div>

          <div className={styles.documentSection}>
            <div className={styles.titleWithIcon}>
              <Text variant="subtitle" id="document-comparison-section-right-title">
                {rightTitle}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${styles.container} ${className}`}
        data-testid="document-comparison-section"
        id={id}
      >
        <div className={styles.comparisonRow}>
          <div className={styles.documentSection}>
            <Text variant="subtitle">{leftTitle}</Text>
          </div>

          <div className={styles.documentSection}>
            <Text variant="subtitle">{rightTitle}</Text>
          </div>
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentSection}>
            <Text variant="subtitle-article" regular className={styles.content}>
              {leftContent}
            </Text>
          </div>

          <div className={styles.contentSection}>
            <Text variant="subtitle-article" regular className={styles.content}>
              {rightContent}
            </Text>
          </div>
        </div>

        <div className={styles.dividersRow}>
          <Divider variant="subtle" />
          <Divider variant="subtle" />
        </div>

        {pageInfo && (
          <div className={styles.pageInfo}>
            <Text variant="subtitle" regular className={styles.content}>
              {pageInfo}
            </Text>
          </div>
        )}
      </div>
    </>
  );
};
