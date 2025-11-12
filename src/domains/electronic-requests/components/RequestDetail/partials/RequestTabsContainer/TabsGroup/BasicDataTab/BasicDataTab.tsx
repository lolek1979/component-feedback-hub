import { Fragment, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { mapStatusToBadge } from 'src/domains/electronic-requests/partials/RequestsDataTable/RequestsDataTable';

import { Divider, Text } from '@/design-system/atoms';
import { Person } from '@/design-system/molecules/UserSelect';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { DetailRowContent } from './paritals/DetailRowContent';
import styles from './BasicDataTab.module.css';

import { formatDateWithDots } from '@/core';

interface BasicDataTabProps {
  requestId: string | null;
  requestData: RequestDetailModel | null | undefined;
  isLoading: boolean;
  onUserChange?: (type: 'requester' | 'recipient', users: Person[]) => void;
}

export type BasicRequestDataItem = { label: string; value: string };

const getBasicRequestData = (
  data: RequestDetailModel,
  t: (key: string) => string,
  tStatus: (key: string) => string,
): BasicRequestDataItem[] => {
  const wfState = data.wfState;
  const showIdStates = [
    'PendingApprove0',
    'PendingApprove1',
    'PendingApprove2',
    'PendingApprove3',
    'PendingApprove4',
  ];

  const items: BasicRequestDataItem[] = [
    { label: t('status'), value: mapStatusToBadge(wfState, tStatus) },
    {
      label: t('createdAt'),
      value: data.createdAtUtc ? formatDateWithDots(new Date(data.createdAtUtc)) || '-' : '-',
    },
    { label: t('requester'), value: `${data.createdBy.givenName} ${data.createdBy.surname}` },
    {
      label: t('recipient'),
      value: `${data.recipient.givenName} ${data.recipient.surname}`,
    },
    {
      label: t('approver'),
      value: data.approver ? `${data.approver.givenName} ${data.approver.surname}` : '-',
    },
    {
      label: t('id'),
      value: showIdStates.includes(wfState) ? data.id || '-' : '-',
    },
    { label: t('description'), value: data.description || '-' },
    {
      label: t('address'),
      value: data.createdBy.defaultAddress || '-',
    },
    { label: t('costCenter'), value: data.costCenter ? data.costCenter.code || '-' : '-' },
    { label: t('orderLabel'), value: data.order ? data.order.code || '-' : '-' },
    { label: t('requestCause'), value: data.justification || '-' },
  ];

  return items;
};

export const BasicDataTab = ({
  requestData,
  isLoading,
  requestId,
  onUserChange,
}: BasicDataTabProps) => {
  const t = useTranslations('requests.newRequestModal.fieldsLabels');
  const tStatus = useTranslations('requests.filters.status');
  const [requestBasicInfo, setRequestBasicInfo] = useState<BasicRequestDataItem[] | null>(null);

  useEffect(() => {
    if (requestData && !isLoading && requestId) {
      const transformedData = getBasicRequestData(requestData, t, tStatus);
      setRequestBasicInfo(transformedData);
    }
  }, [requestData, isLoading, requestId, t, tStatus]);

  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      if (event.detail && onUserChange) {
        onUserChange(event.detail.type, event.detail.users);
      }
    };

    window.addEventListener('userUpdate', handleUserUpdate as EventListener);

    return () => {
      window.removeEventListener('userUpdate', handleUserUpdate as EventListener);
    };
  }, [onUserChange]);

  return (
    <div className={styles.basicDataTabContainer}>
      <div className={styles.formBlockDetails}>
        <ul>
          {requestBasicInfo?.map((item, itemIndex) => (
            <Fragment key={`block-${requestId}-item-${itemIndex}`}>
              <li>
                <div className={styles.detailRow}>
                  <div
                    className={
                      item.value === undefined || item.value === '-'
                        ? styles.detailRowTextNoValue
                        : styles.detailRowText
                    }
                  >
                    <Text variant="subtitle" regular color="secondary">
                      {item.label}
                    </Text>
                  </div>
                  <div className={styles.detailRowValue}>
                    <DetailRowContent item={item} t={t} requestData={requestData} />
                  </div>
                </div>
              </li>
              {itemIndex < requestBasicInfo.length - 1 && (
                <li>
                  <Divider variant="dotted" />
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};
