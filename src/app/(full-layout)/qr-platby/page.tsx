import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import QRPayments from '@/domains/qr-payments';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.qr');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const Page = () => <QRPayments />;

export default Page;
