import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ProcessHeader } from '../components';
import styles from './AdministrativeProceedingsLayout.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.administrativeProceedings');

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
  };
}

interface AdministrativeProceedingsLayoutProps {
  children: ReactNode;
}

const AdministrativeProceedingsLayout = ({ children }: AdministrativeProceedingsLayoutProps) => {
  return (
    <>
      <section className={styles.layoutHeader}>
        <ProcessHeader />
      </section>
      <section className={styles.contentWrapper}>{children}</section>
    </>
  );
};

export default AdministrativeProceedingsLayout;
