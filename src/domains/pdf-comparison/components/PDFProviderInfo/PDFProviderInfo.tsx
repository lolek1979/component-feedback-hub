'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './index.module.css';

interface PdfProviderInfoProps {
  serviceProviderInfo: {
    poskytovatelSluzeb: string;
    adresa: string;
    zastoupeny: string;
    ic: string;
    icz: string;
    podepsany: string;
  };
  id?: string;
}

export const PDFProviderInfo = ({ serviceProviderInfo, id }: PdfProviderInfoProps) => {
  const t = useTranslations('ServiceProvider');

  return (
    <div className={styles.pdfProviderWrapper} role="region" aria-label={t('title')} id={id}>
      <ul className={styles.infoList}>
        <li>
          <Text variant="subtitle" id="providerNameId" selectable={false}>
            {t('poskytovatelSluzeb')}
          </Text>
          <Text variant="subtitle" regular role="definition" aria-labelledby="providerNameId">
            {serviceProviderInfo.poskytovatelSluzeb}
          </Text>
        </li>
        <li>
          <Text variant="subtitle" id="addressId" selectable={false}>
            {t('adresa')}
          </Text>
          <Text variant="subtitle" regular role="definition" aria-labelledby="addressId">
            {serviceProviderInfo.adresa}
          </Text>
        </li>
        <li>
          <Text variant="subtitle" id="representedById" selectable={false}>
            {t('zastoupeny')}
          </Text>
          <Text variant="subtitle" regular role="definition" aria-labelledby="representedById">
            {serviceProviderInfo.zastoupeny}
          </Text>
        </li>
        <li>
          <Text variant="subtitle" id="icId" selectable={false}>
            {t('ic')}
          </Text>
          <Text variant="subtitle" regular role="definition" aria-labelledby="icId">
            {serviceProviderInfo.ic}
          </Text>
        </li>
        <li>
          <Text variant="subtitle" id="iczId" selectable={false}>
            {t('icz')}
          </Text>
          <Text variant="subtitle" role="definition" aria-labelledby="iczId" regular>
            {serviceProviderInfo.icz}
          </Text>
        </li>
        <li>
          <Text variant="subtitle" id="signedById" selectable={false}>
            {t('podepsany')}
          </Text>
          <Text variant="subtitle" regular role="definition" aria-labelledby="signedById">
            {serviceProviderInfo.podepsany}
          </Text>
        </li>
      </ul>
    </div>
  );
};
