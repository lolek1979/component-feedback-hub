import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DetailPage from '@/domains/central-codelist-management/DetailPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.codeListDetail');

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface PageProps {
  params: Promise<{ codeListId: string }>;
  searchParams: Promise<{ parent?: string }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const codeListId = params.codeListId;
  const parentInfo = searchParams?.parent || '';

  return <DetailPage codeListId={codeListId} parentId={parentInfo} />;
}
