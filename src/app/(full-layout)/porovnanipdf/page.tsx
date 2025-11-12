import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PdfComparisonPage from '@/domains/pdf-comparison';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.pdfComparison');

  return {
    title: t('title', { default: 'Porovnání PDF' }),
    description: t('description', { default: 'Porovnání PDF dokumentů' }),
  };
}

const Page = () => <PdfComparisonPage />;

export default Page;
