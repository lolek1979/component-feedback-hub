'use client';

import { ReactNode, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { ComplaintHandlerSection } from '@/domain-limits-copayments-center/components/ComplaintHandlerSection';
import { FormActionCard } from '@/domain-limits-copayments-center/components/FormActionCard/FormActionCard';
import { ReferenceNumberSection } from '@/domain-limits-copayments-center/components/ReferenceNumberSection';
import { useComplaintStore } from '@/domain-limits-copayments-center/stores';

import styles from './ConsentStep.module.css';

import { Button, Divider } from '@/design-system';
/**
 * ConsentStep - Fourth step in the complaint creation process.
 *
 * This component represents the consent/confirmation step where users finalize the complaint
 * by performing several critical actions:
 *
 * 1. **Data Reconciliation** - Print the complaint for the insured person to review and sign
 * 2. **E-File Integration** - Insert the signed document into the E-File system
 * 3. **Reference Number** - Enter the reference number (číslo jednací) from E-File
 * 4. **Complaint Handler Assignment** - Specify who will handle the complaint (Back Office or Client Desk)
 *
 * The step includes navigation to return to the previous step and is part of a multi-step
 * complaint workflow managed by the complaint store.
 *
 * @component
 * @example
 * ```tsx
 * // Used within ComplaintDetailPage stepper
 * <ConsentStep />
 * ```
 *
 * @see {@link ComplaintHandlerSection} - Section for selecting the complaint handler
 * @see {@link ReferenceNumberSection} - Section for entering the E-File reference number
 * @see {@link FormActionCard} - Card component for the data reconciliation action
 * @see {@link useComplaintStore} - Store managing the complaint form state and navigation
 */
export const ConsentStep = (): ReactNode => {
  const t = useTranslations('ConsentStep');
  const { previousStep } = useComplaintStore();

  /**
   * Handles the print complaint action.
   * This will generate a document for the complaint that needs to be printed,
   * signed by the insured person, and inserted into the E-File system.
   *
   * @todo Implement backend service call to generate the complaint document
   */
  const handleClick = useCallback(() => {
    alert('TODO: call backend service to generate document');
  }, []);

  return (
    <div className={styles.container}>
      <FormActionCard
        variant="secondary"
        title={t('DataReconciliationTitle')}
        description={t('DataReconciliationDescription')}
        buttonLabel={t('DataReconciliationButton')}
        onClick={handleClick}
      />
      <Divider />
      <ReferenceNumberSection />
      <Divider />
      <ComplaintHandlerSection />
      <div className={styles.navButtonsContainer}>
        <Button
          id="button-back-consent-step"
          variant="secondary"
          onClick={previousStep}
          size="medium"
        >
          {t('backButton')}
        </Button>
      </div>
    </div>
  );
};
