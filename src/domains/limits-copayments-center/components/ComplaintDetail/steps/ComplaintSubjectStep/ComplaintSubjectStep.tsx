'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/design-system/atoms';
import { Typography } from '@/design-system/molecules/Typography/Typography';
import { useComplaintStore } from '@/domains/limits-copayments-center/stores';

import styles from './ComplaintSubjectStep.module.css';

export const ComplaintSubjectStep = () => {
  const t = useTranslations('ComplaintSubjectStep');
  const tCommon = useTranslations('KDPPage.complaintsTab');
  const { nextStep, previousStep } = useComplaintStore();

  return (
    <div className={styles.stepContainer}>
      <Typography variant="H4/Bold" component="h4">
        {t('title')}
      </Typography>

      <div className={styles.buttonGroup}>
        <Button id="button-complaint-back" variant="secondary" onClick={previousStep}>
          {t('back')}
        </Button>
        <Button id="button-complaint-continue" variant="primary" onClick={nextStep}>
          {tCommon('continue')}
        </Button>
      </div>
    </div>
  );
};
