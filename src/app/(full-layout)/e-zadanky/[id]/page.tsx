import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { RequestDetail } from '@/domains/electronic-requests/components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.requests');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <RequestDetail />;

export default Page;
