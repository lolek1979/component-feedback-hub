'use client';

import { ReactNode, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { RadioGroupSection } from '@/domains/limits-copayments-center/components';
import { RadioGroupSectionProps } from '@/domains/limits-copayments-center/components/RadioGroupSection';
import {
  COMPLAINT_HANDLERS,
  ComplaintHandler,
  useComplaintStore,
} from '@/domains/limits-copayments-center/stores';

import styles from './ComplaintHandlerSection.module.css';

/**
 * Props for the ComplaintHandlerSection component.
 */
export interface ComplaintHandlerSectionProps {
  /**
   * Optional CSS class for customizing styles.
   */
  className?: string;
}

/**
 * ComplaintHandlerSection - A form section for selecting who will handle the complaint.
 *
 * This component provides a radio group interface allowing users to specify which department
 * should handle the complaint. It offers two options:
 *
 * - **Back Office** - Forward the complaint to the Back Office team
 * - **KLIPR (Client Desk)** - Assign the complaint to the Client Desk
 *
 * The component integrates with the complaint store to persist the selected handler and
 * uses constants from the store to ensure type safety and consistency across the application.
 * The selection is rendered using a RadioGroupSection with title and description from i18n.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ComplaintHandlerSection />
 *
 * // With custom className
 * <ComplaintHandlerSection className="custom-handler-section" />
 * ```
 *
 * @see {@link COMPLAINT_HANDLERS} - Constants defining available complaint handler types
 * @see {@link RadioGroupSection} - Underlying radio group component
 * @see {@link useComplaintStore} - Store managing complaint form data and handler selection
 */
export const ComplaintHandlerSection = ({ className }: ComplaintHandlerSectionProps): ReactNode => {
  const t = useTranslations('ComplaintHandler');
  const { formData, setComplaintHandler } = useComplaintStore();

  const options: RadioGroupSectionProps['radioButton'] = [
    { value: COMPLAINT_HANDLERS.BACK_OFFICE, label: t('forwardToBackOffice') },
    { value: COMPLAINT_HANDLERS.CLIENT_DESK, label: t('clientDesk') },
  ];

  /**
   * Handles the change event when a complaint handler option is selected.
   * Updates the complaint store with the selected handler value.
   *
   * @param value - The selected handler value (either 'backOffice' or 'clientDesk')
   */
  const handleChange = useCallback(
    (value: string) => {
      setComplaintHandler(value as ComplaintHandler);
    },
    [setComplaintHandler],
  );

  return (
    <section className={clsx(styles.container, className)}>
      <RadioGroupSection
        title={t('title')}
        description={t('description')}
        radioButton={options}
        radioName="complaintHandler"
        value={formData.complaintHandler}
        onChange={handleChange}
      />
      {/* TODO: remove debug this form values info */}
      <pre style={{ background: 'pink', overflow: 'auto', padding: '8px', marginTop: '20px' }}>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </section>
  );
};
