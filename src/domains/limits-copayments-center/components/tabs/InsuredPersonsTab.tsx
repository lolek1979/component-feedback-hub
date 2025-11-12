'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Typography } from '@/design-system/molecules';

import styles from './InsuredPersonsTab.module.css';

export const InsuredPersonsTab = () => {
  const t = useTranslations('KDPPage');

  return (
    <div className={styles.container}>
      <Typography variant="Body/Regular">{t('insuredPersonsTab.comingSoon')}</Typography>
    </div>
  );
};
