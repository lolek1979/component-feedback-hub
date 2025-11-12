'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ICancel from '@/core/assets/icons/cancel.svg';
import { EmptyState } from '@/design-system/molecules/EmptyState';
import { Header } from '@/design-system/organisms';

import styles from './not-found.module.css';

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations('ErrorPages.NotFound.General');

  return (
    <>
      <Header />
      <div className={styles.notFoundContainer}>
        <EmptyState
          title={t('title')}
          description={t('body')}
          btnPrimText={t('button')}
          icon={
            <ICancel id="icon-not-found-cancel" className="icon_red-500" width={140} height={140} />
          }
          onPrimaryAction={() => router.push('/')}
        />
      </div>
    </>
  );
}
