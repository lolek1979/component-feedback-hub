'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';
import { Breadcrumbs } from '@/design-system/molecules';

import { useAdminProcessById } from '../../api';
import { AdminProcessByIdResponse } from '../../api/services/getAdminProcessById';
import { CreateNewAdminProcessModal } from '../CreateNewAdminProcessModal';
import DetailHeader, { AdminProcess } from './DetailHeader/DetailHeader';
import styles from './ProcessHeader.module.css';

export const ProcessHeader = () => {
  const t = useTranslations('administrativeProceedings');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const adminProcessDetailRegex = /^\/spravni-rizeni\/(.+)$/;
  const match = pathname.match(adminProcessDetailRegex);
  const adminProcessId = match ? match[1] : null;

  const [headerData, setHeaderData] = useState<AdminProcess | null>(null);

  const { data, isLoading, isError, error } = useAdminProcessById(adminProcessId ?? '');

  const breadcrumbs = [
    { value: t('title'), link: '/spravni-rizeni' },
    { value: t('pageTitle'), link: `/spravni-rizeni/${data?.id}`, current: true },
  ];

  const getAdminProcessHeaderData = (data: AdminProcessByIdResponse): AdminProcess => {
    return {
      agendaNumber: data.agenda.code,
      recordNumber: data.recordFolder.number,
      responsibleUsers: data.responsibleUsers,
      insurancePayer: data.insurancePayer,
    };
  };

  useEffect(() => {
    if (data && !isLoading && adminProcessId) {
      const transformedData = getAdminProcessHeaderData(data);
      setHeaderData(transformedData);
    }
  }, [data, isLoading, adminProcessId]);

  if (isError) {
    console.error('Failed to load admin process data:', error);
  }

  return (
    <>
      {pathname === '/spravni-rizeni' && (
        <div data-testid="admin-process-overview-header" className={styles.overviewHeaderCont}>
          <Text variant="h4">{t('title')}</Text>
          <CreateNewAdminProcessModal />
        </div>
      )}

      {adminProcessId && isLoading && (
        <div className={styles.detailHeaderCont}>{tCommon('loading')}</div>
      )}

      {adminProcessId && !isLoading && headerData && (
        <div className={styles.processDetailContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.navigation}>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Text variant="h4" className={styles.pageTitle}>
              {t('pageTitle')}
            </Text>
          </div>
          <DetailHeader process={headerData} />
        </div>
      )}

      {adminProcessId && !isLoading && isError && (
        <div className={styles.detailHeaderCont}>{t('noData')}</div>
      )}
    </>
  );
};
