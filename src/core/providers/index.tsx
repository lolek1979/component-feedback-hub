'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import type { ParsedEnv } from '@/core/auth';
import KeyboardShortcutsProvider from '@/core/providers/KeyboardShortcutsProvider';
import NetworkStatusProvider from '@/core/providers/NetworkStatusProvider';
import ProtectedRoute from '@/core/providers/ProtectedRoute';
import { ReactQueryProvider } from '@/core/providers/ReactQueryProvider';
import { RolesProvider } from '@/core/providers/RolesProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { FeesPageProvider } from '@/domains/limits-copayments-center/providers/FeesPageContext';

import AuthMsalProvider from './AuthProvider';
import { AppContextProvider } from './context';
import { EnvProvider } from './EnvProvider';
import { FeedBackHubProvider } from './FeedBackHubProvider';

/**
 * Props for {@link AppProviders}.
 */
interface AppProvidersProps {
  /** React children to render within the provider tree. */
  children: ReactNode;
  /** Internationalization messages. */
  messages: any; // Using any for now to avoid AbstractIntlMessages import issue
  /** Parsed environment variables. */
  env: ParsedEnv;
  /** Current locale string. */
  locale: string;
}

/**
 * Top-level provider component for the application.
 *
 * Wraps the application with all required context providers, including environment,
 * theme, internationalization, authentication, roles, feedback hub, network status,
 * keyboard shortcuts, unsaved changes, and protected route handling.
 *
 * @param props.children - The React children to render within the provider tree.
 * @param props.messages - Internationalization messages.
 * @param props.env - Parsed environment variables.
 * @param props.locale - Current locale string.
 *
 * @example
 * <AppProviders messages={messages} env={env} locale="cz">
 *   <App />
 * </AppProviders>
 */
const AppProviders = (props: AppProvidersProps) => {
  const { children, messages, env, locale } = props;

  //Removed Theme provider

  return (
    <NuqsAdapter>
      <EnvProvider env={env}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppContextProvider>
            <FeesPageProvider>
              <AuthMsalProvider env={env}>
                <ProtectedRoute>
                  <RolesProvider>
                    <FeedBackHubProvider>
                      <ReactQueryProvider>
                        <NetworkStatusProvider>
                          <KeyboardShortcutsProvider>
                            <UnsavedChangesProvider>
                              {children}
                              <div id="modal-root"></div>
                            </UnsavedChangesProvider>
                          </KeyboardShortcutsProvider>
                        </NetworkStatusProvider>
                      </ReactQueryProvider>
                    </FeedBackHubProvider>
                  </RolesProvider>
                </ProtectedRoute>
              </AuthMsalProvider>
            </FeesPageProvider>
          </AppContextProvider>
        </NextIntlClientProvider>
      </EnvProvider>
    </NuqsAdapter>
  );
};

export default AppProviders;
