'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import IconSuccess from '@/core/assets/icons/icon-success.svg';
import { formatNumber } from '@/core/auth/utils';
import { Badge, Skeleton } from '@/design-system/atoms';
import { Breadcrumbs, Typography } from '@/design-system/molecules';

import { ComplaintActions } from './partials/ComplaintActions/ComplaintActions';
import { KdpModalTooltip } from './partials/KdpModalTooltip/KdpModalTooltip';
import styles from './KdpResultHeader.module.css';

interface KdpResultHeaderProps {
  name?: string;
  firstName?: string;
  lastName?: string;
  insuranceNum: string;
  limit?: number;
  hasToPayTotal?: number | null;
  isLoading?: boolean;
  className?: string;
  dayLimitReached?: string;
  error?: boolean;
  showBreadcrumbs?: boolean;
  breadcrumbTitle?: string;
  onBreadcrumbClick?: () => void;
  showActions?: boolean;
  onApprove?: () => void;
  onRequestOpinion?: () => void;
  onReject?: () => void;
  actionsDisabled?: boolean;
}

export const KdpResultHeader = ({
  insuranceNum,
  limit,
  hasToPayTotal,
  firstName,
  lastName,
  isLoading = false,
  className = '',
  dayLimitReached,
  error = false,
  showBreadcrumbs = false,
  breadcrumbTitle = '',
  onBreadcrumbClick,
  name,
  showActions = false,
  onApprove,
  onRequestOpinion,
  onReject,
  actionsDisabled = false,
}: KdpResultHeaderProps) => {
  const t = useTranslations('KDPResultHeader');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : name;

  const kdpContainerClassName = [styles.kdpContainer, className].join(' ');

  if (error) {
    return (
      <div className={styles.personalContainer}>
        <Typography variant="H4/Bold" id="name-label">
          {displayName || insuranceNum}
        </Typography>
        <Typography variant="Subtitle/Default/Regular" id="social-security-label">
          {displayName ? `${t('socialNum')}: ${insuranceNum}` : t('socialNum')}
        </Typography>
      </div>
    );
  }

  const renderBadges = () => {
    if (isLoading) {
      return (
        <div className={styles.badgesContainer}>
          <Skeleton maxWidth="180px" aria-busy="true" />
          <Skeleton maxWidth="120px" aria-busy="true" />
        </div>
      );
    }

    const limitStatusBadge = (
      <Badge
        color="green"
        size="large"
        icon={
          <IconSuccess
            id="icon-cld-result-header-limit-acomplished"
            width={16}
            height={16}
            className="icon_green-500"
          />
        }
        aria-label={dayLimitReached ? t('limitAcomplishedDay') : t('limitAcomplished')}
      >
        {dayLimitReached ? `${t('limitAcomplishedDay')} ${dayLimitReached}` : t('limitAcomplished')}
      </Badge>
    );

    const limitAmountBadge = limit ? (
      <Badge color="gray" size="large" aria-label={`${t('limit')} ${formatNumber(limit)}`}>
        {`${t('limit')} ${formatNumber(limit)}`}
      </Badge>
    ) : null;

    return (
      <div className={styles.badgesContainer}>
        {limitStatusBadge}
        {limitAmountBadge}
      </div>
    );
  };

  return (
    <>
      <div className={kdpContainerClassName} role="region" aria-label="KDP Result Header">
        <Typography variant="Body/Regular" className={styles.kdpResultInfo}>
          {t('kdpResultInfo')}
        </Typography>
        <div className={styles.kdpContainer}>
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
            <>
              <Typography variant="H4/Bold" component="h4" className={styles.name} id="name-label">
                {displayName}
              </Typography>
              <Typography
                variant="Subtitle/Default/Regular"
                className={styles.securityNum}
                id="social-security-label"
              >
                {`${t('socialNum')}: ${insuranceNum}`}
              </Typography>
            </>
          </div>
          <div className={styles.badgesSection}>{renderBadges()}</div>
          {showActions && (
            <div className={styles.actionsContainer}>
              <ComplaintActions
                onApprove={onApprove}
                onRequestOpinion={onRequestOpinion}
                onReject={onReject}
                disabled={actionsDisabled}
              />
            </div>
          )}
        </div>
      </div>

      <KdpModalTooltip isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};
