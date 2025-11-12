import { ReactNode } from 'react';

import { AdministrativeProceedingsLayout } from '@/domains/administrative-proceedings';

export { generateMetadata } from '@/domains/administrative-proceedings/pages/AdministrativeProceedingsLayout';

const Layout = ({ children }: { children: ReactNode }) => {
  return <AdministrativeProceedingsLayout>{children}</AdministrativeProceedingsLayout>;
};

export default Layout;
