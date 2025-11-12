import { AdministrativeProceedingsDetailPage } from '@/domains/administrative-proceedings';

export { generateMetadata } from '@/domains/administrative-proceedings/pages/AdministrativeProceedingsDetailPage';

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  return <AdministrativeProceedingsDetailPage id={params.id} />;
};

export default Page;
