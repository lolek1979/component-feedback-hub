import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ProcessDetail } from '../components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.administrativeProceedings.adminProcessDetail');

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface AdministrativeProceedingsDetailPageProps {
  id: string;
}

const AdministrativeProceedingsDetailPage = ({ id }: AdministrativeProceedingsDetailPageProps) => (
  <ProcessDetail id={id} />
);

export default AdministrativeProceedingsDetailPage;
