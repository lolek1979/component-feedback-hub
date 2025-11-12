import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { RequestHeader } from '@/domains/electronic-requests/components';

import './styles.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.requests');

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
  };
}

// Server component that passes children to client component
const RequestsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <section className="layout-header">
        <RequestHeader />
      </section>
      <section className="content-wrapper">{children}</section>
    </>
  );
};

export default RequestsLayout;
