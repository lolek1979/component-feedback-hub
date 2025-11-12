import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AuditListPage } from '@/domains/audit-log';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.audit');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <AuditListPage />;

export default Page;
