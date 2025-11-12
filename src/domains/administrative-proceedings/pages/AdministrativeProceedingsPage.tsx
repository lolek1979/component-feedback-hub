import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ProcessesList } from '../components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.administrativeProceedings.casesOverview');

  return {
    title: t('title'),
    description: t('description'),
  };
}

const AdministrativeProceedingsPage = () => <ProcessesList />;

export default AdministrativeProceedingsPage;
