'use client';

import React, { createContext, useContext } from 'react';

/**
 * React context for environment variables.
 *
 * @see {@link EnvProvider}
 * @see {@link useEnv}
 */
const EnvContext = createContext<Record<string, string | undefined>>({});

/**
 * Props for {@link EnvProvider}.
 */
interface EnvProviderProps {
  /** React children to render within the provider. */
  children: React.ReactNode;
  /** Environment variables to provide. */
  env: Record<string, string | undefined>;
}

/**
 * Provider component for environment variables.
 *
 * Wraps children and provides environment variables via React context.
 *
 * @param props.children - The React children to render within the provider.
 * @param props.env - The environment variables to provide.
 *
 * @example
 * <EnvProvider env={env}>
 *   <App />
 * </EnvProvider>
 *
 * @see {@link useEnv}
 */
export const EnvProvider: React.FC<EnvProviderProps> = ({ children, env }) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

/**
 * Custom hook to access environment variables from context.
 *
 * @returns The environment variables object.
 *
 * @example
 * const env = useEnv();
 */
export const useEnv = () => useContext(EnvContext);
