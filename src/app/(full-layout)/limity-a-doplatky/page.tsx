import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import FeesPage from '@/domains/limits-copayments-center';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.fees');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <FeesPage />;

export default Page;
