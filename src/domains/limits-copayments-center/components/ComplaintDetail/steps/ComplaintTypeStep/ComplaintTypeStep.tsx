import { useTranslations } from 'next-intl';

import { Button } from '@/design-system/atoms';
import { RadioGroup } from '@/design-system/molecules';

import { COMPLAINT_TYPES, useComplaintStore } from '../../../../stores/useComplaintStore';
import styles from './ComplaintTypeStep.module.css';

export const ComplaintTypeStep = () => {
  const t = useTranslations('KDPPage.complaintsTab');
  const { formData, setComplaintType, nextStep } = useComplaintStore();

  const complaintTypeOptions = [
    { value: COMPLAINT_TYPES.INVALID, label: t('complaintTypes.invalid') },
    {
      value: COMPLAINT_TYPES.INSURED_NUMBER_CHANGE,
      label: t('complaintTypes.insuredNumberChange'),
    },
    { value: COMPLAINT_TYPES.GENERAL, label: t('complaintTypes.general') },
  ];

  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className={styles.stepContainer}>
      <RadioGroup
        id="complaint-type-radio"
        name="complaintType"
        options={complaintTypeOptions}
        value={formData.complaintType || ''}
        onChange={(value) =>
          setComplaintType(value as (typeof COMPLAINT_TYPES)[keyof typeof COMPLAINT_TYPES])
        }
        withTitle={t('complaintTypeTitle')}
        ariaLabel={t('complaintTypeTitle')}
      />

      <Button
        id="button-complaint-continue"
        variant="primary"
        onClick={handleContinue}
        disabled={!formData.complaintType}
        className={styles.continueButton}
      >
        {t('continue')}
      </Button>
    </div>
  );
};
