import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PdfComparisonResultsPage from '@/domains/pdf-comparison/Results';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.pdfComparison');

  return {
    title: t('title', { default: 'Výsledky porovnání PDF' }),
    description: t('description', { default: 'Výsledky porovnání PDF dokumentů' }),
  };
}

const Page = () => <PdfComparisonResultsPage />;

export default Page;
