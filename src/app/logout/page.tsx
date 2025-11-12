import { Metadata } from 'next';

import LogoutPage from '@/domains/log-out';

export const metadata: Metadata = {
  title: 'NIS - logout',
  description: '',
};

const Page = () => <LogoutPage />;

export default Page;
