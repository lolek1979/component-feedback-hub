import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import AuditDetailPage from '@/domains/audit-log/Detail';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.auditDetail');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <AuditDetailPage />;

export default Page;
