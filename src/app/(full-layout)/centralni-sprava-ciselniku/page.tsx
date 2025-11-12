import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CSCPage from '@/domains/central-codelist-management';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.codeLists');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <CSCPage />;

export default Page;
