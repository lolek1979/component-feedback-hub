'use client';

import { ChangeEvent, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { useComplaintStore } from '@/domain-limits-copayments-center/stores';

import styles from './ReferenceNumberSection.module.css';

import { FieldLabel, Input, Typography } from '@/design-system';

/**
 * Props for the ReferenceNumberSection component.
 */
export interface ReferenceNumberSectionProps {
  /**
   * Optional CSS class for customizing styles.
   */
  className?: string;
}

/**
 * ReferenceNumberSection - A form section for entering complaint reference number.
 *
 * This component provides a dedicated section for users to input the reference number
 * (číslo jednací) after inserting a document into the E-File system. It displays
 * a title, description, and a required input field. The component integrates with
 * the complaint store to manage the reference number value.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ReferenceNumberSection />
 *
 * // With custom className
 * <ReferenceNumberSection className="custom-section" />
 * ```
 *
 * @see {@link useComplaintStore} - Store managing complaint form data
 */
export const ReferenceNumberSection = ({ className }: ReferenceNumberSectionProps): ReactNode => {
  const t = useTranslations('ComplaintReferenceNumber');
  const { formData, setReferenceNumber } = useComplaintStore();

  /**
   * Handles changes to the reference number input field.
   * Updates the complaint store with the new value or empty string if the value is undefined.
   *
   * @param e - The change event from the input element
   */
  const handleReferenceNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReferenceNumber(e.target.value || '');
  };

  return (
    <section className={clsx(styles.container, className)}>
      <Typography variant="Headline/Bold" component="h3">
        {t('title')}
      </Typography>
      <Typography variant="Body/Regular" component="p">
        {t('description')}
      </Typography>
      <div className={styles.referenceNumberWrapper}>
        <FieldLabel text={t('inputLabel')} htmlFor="input-reference-number-consent-step" required />
        <Input
          id="input-reference-number-consent-step"
          value={formData.referenceNumber}
          onChange={handleReferenceNumberChange}
        />
      </div>
    </section>
  );
};
