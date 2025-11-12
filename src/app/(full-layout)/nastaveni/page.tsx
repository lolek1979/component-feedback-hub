import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SettingsPage from '@/domains/settings';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.settings');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <SettingsPage />;

export default Page;
