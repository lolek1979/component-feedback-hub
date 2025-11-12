'use client';

import { useTranslations } from 'use-intl';

import { formatDateWithDots } from '@/core/auth/utils';
import { Avatar, Badge, Text, Tooltip } from '@/design-system/atoms';

import styles from './CSMainInfo.module.css';

type Guarantor = {
  abbrev: string;
  fullName: string;
  mail: string;
  department: string;
  businessPhones: string[];
};

export type CSMainInfoType = {
  title: string;
  id: string;
  guarantors: Guarantor[];
  validFrom?: Date;
  validUntil?: Date;
  types: string;
  state?: string;
};

export interface CSMainInfoProps {
  CSObject: CSMainInfoType;
}

export const CSMainInfo = ({ CSObject }: CSMainInfoProps) => {
  const { title, id, guarantors, validFrom, validUntil, types } = CSObject;
  const t = useTranslations('CSCTabsContainer.CSMainInfo');

  return (
    <div className={styles.csMainInfoWrapper} role="region" aria-label={t('title')}>
      <ul className={styles.csInfoList}>
        <li>
          <Text variant="subtitle" id="headerTitleId" selectable={false}>
            {t('title')}
          </Text>
          {title.length > 25 ? (
            <Tooltip
              variant="inverse"
              id="tootlip-csc-main-info-title"
              content={title}
              placement="tooltipTop"
            >
              <div
                className={`${styles.listValue} ${styles.title}`}
                role="definition"
                aria-labelledby="headerTitleId"
              >
                {title}
              </div>
            </Tooltip>
          ) : (
            <div
              className={`${styles.listValue}`}
              role="definition"
              aria-labelledby="headerTitleId"
            >
              {title}
            </div>
          )}
        </li>
        <li>
          <Text variant="subtitle" id="headerGuid" selectable={false}>
            {t('id')}
          </Text>
          <div className={styles.listValue} role="note" aria-labelledby="headerGuid">
            {id}
          </div>
        </li>
        <li>
          <Text variant="subtitle" id="headerGarantId" selectable={false}>
            {t('guarantor')}
          </Text>
          <ul className={styles.subList} aria-labelledby="headerGarantId">
            {guarantors?.length > 0 && (
              <li className={styles.guarantorList}>
                <Avatar name={guarantors[0].fullName} className={styles.avatarTest} />
                <Text className={styles.guarantorFullname} selectable={false}>
                  {guarantors[0].fullName.split(' (')[0]}
                  {guarantors.length > 1 && (
                    <Tooltip
                      variant="inverse"
                      content={guarantors
                        .slice(1)
                        .map((g) => g.fullName)
                        .join(', ')}
                      id={`tooltip-csc-guarantor-${id}`}
                    >
                      <Text className={styles.moreGuarantors}> +{guarantors.length - 1}</Text>
                    </Tooltip>
                  )}
                </Text>
              </li>
            )}
          </ul>
        </li>
        <li className={styles.validity}>
          <Text variant="subtitle" id="headerValidFromId" selectable={false}>
            {t('validity')}
          </Text>
          <ul className={styles.subListValidity} aria-labelledby="headerValidFromId">
            <li>{formatDateWithDots(validFrom ?? validUntil)}</li>
          </ul>
        </li>
        <li>
          <Text variant="subtitle" id="headerTypeId" selectable={false}>
            {t('type')}
          </Text>
          <ul className={styles.subList} aria-labelledby="headerTypeId">
            <li>
              {types === 'Internal' ? (
                <Badge color="gray" className={styles.badgeType}>
                  Interní
                </Badge>
              ) : types === 'InternalPaid' ? (
                <Badge color="gray" className={styles.badgeType}>
                  Interní - Placený
                </Badge>
              ) : types === 'InternalPublic' ? (
                <Badge color="gray" className={styles.badgeType}>
                  Interní - Veřejný
                </Badge>
              ) : types === 'External' ? (
                <Badge color="gray" className={styles.badgeType}>
                  Externí
                </Badge>
              ) : (
                ''
              )}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
