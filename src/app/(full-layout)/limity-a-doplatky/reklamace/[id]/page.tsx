import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ComplaintDetailPage } from '@/domains/limits-copayments-center/components/ComplaintDetail';
import styles from '@/domains/limits-copayments-center/index.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.fees');

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className={styles.feesPage} id="complaint-detail">
      <ComplaintDetailPage complaintId={id} />
    </div>
  );
};

export default Page;
