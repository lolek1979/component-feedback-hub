import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import RequestPage from 'src/domains/electronic-requests';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.requests');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <RequestPage />;

export default Page;
