'use client';

import { useTranslations } from 'next-intl';

import IconCheck from '@/core/assets/icons/circle_check.svg';
import IconHelp from '@/core/assets/icons/help.svg';
import IconClose from '@/core/assets/icons/icon-close.svg';
import { Button } from '@/design-system/atoms';

import styles from './ComplaintActions.module.css';

interface ComplaintActionsProps {
  onApprove?: () => void;
  onRequestOpinion?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}

export const ComplaintActions = ({
  onApprove,
  onRequestOpinion,
  onReject,
  disabled = false,
}: ComplaintActionsProps) => {
  const t = useTranslations('ComplaintActions');

  return (
    <div className={styles.actions}>
      <Button
        id="button-complaint-approve"
        variant="primary"
        onClick={onApprove}
        disabled={disabled}
        icon={<IconCheck width={20} height={20} id={`icon-complaint-approve`} />}
        aria-label={t('approve')}
      >
        {t('approve')}
      </Button>
      <Button
        id="button-complaint-request-opinion"
        variant="secondary"
        onClick={onRequestOpinion}
        disabled={disabled}
        icon={<IconHelp width={20} height={20} id={`icon-complaint-request-opinion`} />}
        aria-label={t('requestOpinion')}
      >
        {t('requestOpinion')}
      </Button>
      <Button
        id="button-complaint-reject"
        variant="secondary"
        onClick={onReject}
        disabled={disabled}
        icon={<IconClose width={20} height={20} id={`icon-complaint-reject`} />}
        aria-label={t('reject')}
      >
        {t('reject')}
      </Button>
    </div>
  );
};
