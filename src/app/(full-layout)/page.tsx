import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HomePage from '@/domains/home';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.homepage');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <HomePage />;

export default Page;
