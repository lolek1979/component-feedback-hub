'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/design-system/atoms';
import { useComplaintStore } from '@/domains/limits-copayments-center/stores';

import styles from './ComplaintDraftActions.module.css';

interface ComplaintDraftActionsProps {
  onSubmitForReview?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  kliprSettlement?: boolean;
  currentStep?: number;
}

export const ComplaintDraftActions = ({
  onSubmitForReview,
  onCancel,
  disabled = false,
  kliprSettlement = false,
  currentStep = 0,
}: ComplaintDraftActionsProps) => {
  const t = useTranslations('ComplaintDraftActions');
  const { formData } = useComplaintStore();

  const isSubmitDisabled = disabled || (currentStep !== 3 && !kliprSettlement);

  return (
    <div className={styles.actions}>
      {((formData.complaintHandler && currentStep === 3) || kliprSettlement) && (
        <Button
          id="button-complaint-submit-review"
          variant="primary"
          onClick={onSubmitForReview}
          disabled={isSubmitDisabled}
          aria-label={!kliprSettlement ? t('submitForReview') : t('submitForCheck')}
        >
          {formData.complaintHandler === 'backOffice' && !kliprSettlement
            ? t('submitForReview')
            : kliprSettlement
              ? t('submitForCheck')
              : t('kliprSolve')}
        </Button>
      )}

      <Button
        id="button-complaint-cancel"
        variant="secondary"
        onClick={onCancel}
        disabled={disabled}
        aria-label={!kliprSettlement ? t('void') : t('cancel')}
      >
        {!kliprSettlement ? t('void') : t('cancel')}
      </Button>
    </div>
  );
};
