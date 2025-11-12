'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { ClientTable } from '../ClientTable';
import styles from './JudgmentTab.module.css';

import { Typography } from '@/design-system';

export const JudgmentTab = () => {
  const t = useTranslations('KDPPage.judgmentTab');

  const mockJudgmentData = {
    judgmentDate: '18.5.2024',
    referenceNumber: '987654321-1234',
    result: 'Schváleno',
    approvedAmount: '1 250 Kč',
    resolver: 'František Omáčka',
    resolverGroup: 'OSK_FO',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. lor sit amet, consectetur adipiscing elit.',
  };

  return (
    <div className={styles.container}>
      <Typography variant="Body/Bold" className={styles.title}>
        {t('title')}
      </Typography>
      <ClientTable data={mockJudgmentData} />
    </div>
  );
};
