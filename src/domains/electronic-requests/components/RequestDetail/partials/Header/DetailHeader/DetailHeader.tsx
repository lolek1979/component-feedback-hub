'use client';

import { useTranslations } from 'next-intl';

import { formatDateWithDots } from '@/core/auth/utils';
import { Avatar, Text } from '@/design-system/atoms';
import {
  ApprovalResolution,
  UserPublicInfoModel,
} from '@/domains/electronic-requests/api/services/types';

import styles from './DetailHeader.module.css';

export interface RequestHeaderDetail {
  status?: string;
  createdAt?: string;
  createdBy?: UserPublicInfoModel;
  recipient?: UserPublicInfoModel;
  approver: UserPublicInfoModel | null;
  requestNumber?: string | null;
  resolution?: ApprovalResolution;
}

interface DetailHeaderProps {
  process: RequestHeaderDetail;
}

const DetailHeader = ({ process }: DetailHeaderProps) => {
  const { createdAt, createdBy, recipient, approver, requestNumber } = process;
  const t = useTranslations('requests');
  const tRequestsTable = useTranslations('requests.requestsTable');

  const formatPerson = (person?: UserPublicInfoModel) => {
    if (!person) return '-';

    return `${person.givenName} ${person.surname}`;
  };

  return (
    <div
      data-testid="request-detail-header"
      className={styles.detailHeaderWrapper}
      role="region"
      aria-label={t('title')}
    >
      <ul className={styles.detailInfoList}>
        <li>
          <Text variant="subtitle" id="headerCreatedAtId" selectable={false}>
            {t('requestsTable.createdAt')}
          </Text>
          <dd className={styles.listValue} role="definition" aria-labelledby="headerCreatedAtId">
            {formatDateWithDots(createdAt ? new Date(createdAt) : undefined)}
          </dd>
        </li>
        <li>
          <Text variant="subtitle" id="headerCreatedById" selectable={false}>
            {t('requestsTable.requester')}
          </Text>
          <dd className={styles.listValue} aria-labelledby="headerCreatedById">
            {createdBy ? (
              <div className={styles.userContainer}>
                <Avatar name={formatPerson(createdBy)} className={styles.user} />
                <Text regular variant="subtitle">
                  {formatPerson(createdBy)}
                </Text>
              </div>
            ) : (
              '-'
            )}
          </dd>
        </li>
        <li>
          <Text variant="subtitle" id="headerRecipientId" selectable={false}>
            {t('requestsTable.recipient')}
          </Text>
          <dd className={styles.listValue} aria-labelledby="headerRecipientId">
            {recipient ? (
              <div className={styles.userContainer}>
                <Avatar name={formatPerson(recipient)} className={styles.user} />
                <Text regular variant="subtitle">
                  {formatPerson(recipient)}
                </Text>
              </div>
            ) : (
              '-'
            )}
          </dd>
        </li>
        <li>
          <Text variant="subtitle" id="headerApproverId" selectable={false}>
            {t('requestsTable.approver')}
          </Text>
          <dd className={styles.listValue} aria-labelledby="headerApproverId">
            {approver ? (
              <div className={styles.userContainer}>
                <Avatar name={formatPerson(approver)} className={styles.user} />
                <span>{formatPerson(approver)}</span>
              </div>
            ) : (
              '-'
            )}
          </dd>
        </li>
        <li>
          <Text variant="subtitle" id="headerRequestNumberId" selectable={false}>
            {t('requestsTable.id')}
          </Text>
          <dd className={styles.listValue}>{requestNumber ?? tRequestsTable('withoutID')}</dd>
        </li>
      </ul>
    </div>
  );
};

export default DetailHeader;
