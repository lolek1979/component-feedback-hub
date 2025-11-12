'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/design-system/atoms';
import { Breadcrumbs, Typography } from '@/design-system/molecules';

import { ComplaintActions } from '../KdpResultHeader/partials/ComplaintActions';
import { ComplaintDraftActions } from '../KdpResultHeader/partials/ComplaintDraftActions';
import { OpinionModal } from '../Opinion';
import styles from './ComplaintHeader.module.css';

interface ComplaintHeaderProps {
  complaintId: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  insuranceNum: string;
  showBreadcrumbs?: boolean;
  breadcrumbTitle?: string;
  onBreadcrumbClick?: () => void;
  complaintStatus?: 'registered';
  isDraft?: boolean;
  onApprove?: () => void;
  onRequestOpinion?: () => void;
  onReject?: () => void;
  onSubmitForReview?: () => void;
  onCancel?: () => void;
  actionsDisabled?: boolean;
  currentStep?: number;
  kliprSettlement?: boolean;
}

export const ComplaintHeader = ({
  complaintId,
  firstName,
  lastName,
  name,
  insuranceNum,
  showBreadcrumbs = false,
  breadcrumbTitle = '',
  onBreadcrumbClick,
  complaintStatus,
  isDraft = false,
  onApprove,
  onRequestOpinion,
  onReject,
  onSubmitForReview,
  onCancel,
  actionsDisabled = false,
  currentStep = 0,
  kliprSettlement = false,
}: ComplaintHeaderProps) => {
  const t = useTranslations('KDPResultHeader');
  const [isOpinionModalVisible, setIsOpinionModalVisible] = useState(false);

  const renderStatusBadge = () => {
    if (complaintStatus === 'registered') {
      return (
        <Badge color="lightBlue" size="large" aria-label={t('complaintStatus.registered')}>
          {t('complaintStatus.registered')}
        </Badge>
      );
    }

    return null;
  };

  const renderActions = () => {
    if (isDraft) {
      return (
        <ComplaintDraftActions
          onSubmitForReview={onSubmitForReview}
          onCancel={onCancel}
          disabled={actionsDisabled}
          currentStep={currentStep}
          kliprSettlement={kliprSettlement}
        />
      );
    }

    return (
      <ComplaintActions
        onApprove={onApprove}
        onRequestOpinion={() => setIsOpinionModalVisible(true)}
        onReject={onReject}
        disabled={actionsDisabled}
      />
    );
  };

  return (
    <>
      <div className={styles.container} role="region" aria-label="Complaint Header">
        <div className={styles.content}>
          <div className={styles.personalContainer}>
            {showBreadcrumbs && (
              <div className={styles.breadcrumbs}>
                <Breadcrumbs
                  showBackLink
                  showUnderline={false}
                  breadcrumbs={[
                    {
                      value: breadcrumbTitle,
                      link: '#',
                      onClick: onBreadcrumbClick,
                    },
                  ]}
                />
              </div>
            )}
            <Typography variant="H4/Bold" component="h4" className={styles.name} id="name-label">
              {complaintId}
            </Typography>
            <Typography
              variant="Subtitle/Default/Regular"
              className={styles.securityNum}
              id="social-security-label"
            >
              {`${t('socialNum')}: ${insuranceNum}`}
            </Typography>
          </div>

          <div className={styles.badgesSection}>{renderStatusBadge()}</div>

          <div className={styles.actionsContainer}>{renderActions()}</div>
        </div>
      </div>

      <OpinionModal
        isVisible={isOpinionModalVisible}
        setIsVisible={setIsOpinionModalVisible}
        onSubmit={() => {
          onRequestOpinion?.();
        }}
      />
    </>
  );
};
