import { ReactNode } from 'react';
import { getLocale, getMessages } from 'next-intl/server';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { loadEnvVariables } from '@/core/auth/loadEnvVariables';
import AppProviders from '@/core/providers/index';
import { Toast } from '@/design-system/molecules/Toast';
import { ScreenshotSnackbar, UnsavedChangesModal } from '@/design-system/organisms';

import { inter } from './fonts';

import '@/styles/globals.css';

export const metadata = {
  title: {
    template: '%s | NIS',
    default: 'NIS',
  },
  description: '',
  icons: {
    icon: '/logo.svg',
    apple: [{ url: '/logo.svg' }, { url: '/logo.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();
  const env = await loadEnvVariables();
  const isReactQueryDebuggerVisible = env.SHOW_REACT_QUERY_DEBUGGER === 'true';
  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale || 'cs'}>
      <body className={`${inter.className} ${inter.variable}`} suppressHydrationWarning>
        <AppProviders messages={messages} env={env} locale={locale || 'cs'}>
          {children}
          {isReactQueryDebuggerVisible && <ReactQueryDevtools />}
          <UnsavedChangesModal />
          <ScreenshotSnackbar />
          <Toast />
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
