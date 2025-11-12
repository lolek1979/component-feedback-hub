'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './index.module.css';

const SettingsPage = () => {
  const t = useTranslations('HomePage');

  return (
    <div className={styles.homePage}>
      <Text variant="h1">{t('title')}</Text>
      Settings Page
    </div>
  );
};

export default SettingsPage;
