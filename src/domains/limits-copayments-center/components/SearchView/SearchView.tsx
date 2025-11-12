'use client';

import React, { ReactElement } from 'react';
import { useTranslations } from 'next-intl';

import { Spinner } from '@/design-system/atoms';
import { SearchInsuranceForm, Typography } from '@/design-system/molecules';

import styles from './SearchView.module.css';

/**
 * Props for the SearchView component
 * @interface SearchViewProps
 */
interface SearchViewProps {
  /**
   * Callback function triggered when the insurance search form is submitted
   * @param insuranceNum - The insurance number entered by the user
   */
  onSubmit: (insuranceNum: string) => void;

  /**
   * Indicates whether the form submission is currently in progress
   */
  isSubmitting: boolean;
}

/**
 * SearchView component for searching insurance information in the limits and copayments center
 *
 * This component displays a search form that allows users to search for insurance information
 * by entering an insurance number. It shows a loading state with a spinner when the search
 * is being processed.
 *
 * @component
 * @param {SearchViewProps} props - The component props
 * @returns {ReactElement} The rendered SearchView component
 *
 * @example
 * ```tsx
 * <SearchView
 *   onSubmit={(insuranceNum) => handleSearch(insuranceNum)}
 *   isSubmitting={false}
 * />
 * ```
 */
export const SearchView = ({ onSubmit, isSubmitting }: SearchViewProps): ReactElement => {
  const t = useTranslations('KDPPage');

  return (
    <div className={styles.container}>
      <Typography variant="H4/Bold" component="h1">
        {t('title')}
      </Typography>
      <SearchInsuranceForm label={t('label')} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      {isSubmitting && (
        <div className={styles.loadingContainer}>
          <Spinner width={40} height={40} />
          <Typography variant="Body/Regular">{t('loading')}</Typography>
        </div>
      )}
    </div>
  );
};
