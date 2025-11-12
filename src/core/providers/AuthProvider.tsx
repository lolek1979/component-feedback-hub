'use client';

import { ReactNode, useEffect, useState } from 'react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import { initAxiosInstances } from '@/core/api/axiosInstance';
import { ParsedEnv } from '@/core/auth';
import { createMsalInstance, startSessionCheck } from '@/core/auth/msalConfig';
/**
 * AuthMsalProvider component for initializing and providing MSAL authentication context.
 *
 * Sets up MSAL instance, handles redirects, initializes Axios instances for authenticated requests,
 * and starts periodic session checks. Wraps children with {@link MsalProvider}.
 *
 * @param props.children - The React children to render within the provider.
 * @param props.env - Parsed environment variables for MSAL configuration.
 *
 * @example
 * <AuthMsalProvider env={env}>
 *   <App />
 * </AuthMsalProvider>
 *
 * @see {@link createMsalInstance}
 * @see {@link initAxiosInstances}
 * @see {@link startSessionCheck}
 * @see {@link MsalProvider}
 */
const AuthMsalProvider = ({ children, env }: { children: ReactNode; env: ParsedEnv }) => {
  const [msalInstance] = useState<IPublicClientApplication>(() => createMsalInstance(env));

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
        initAxiosInstances(env, msalInstance);

        const cleanup = startSessionCheck(msalInstance);

        return () => cleanup();
      } catch (error) {
        console.error('Error initializing MSAL:', error);
      }
    };

    initializeAuth();
  }, [env, msalInstance]);

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default AuthMsalProvider;
