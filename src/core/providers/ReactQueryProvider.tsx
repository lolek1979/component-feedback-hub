'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Provider component for TanStack React Query.
 *
 * Initializes a QueryClient and wraps children with {@link QueryClientProvider}.
 * Sets default query options, such as disabling refetch on window focus.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <ReactQueryProvider>
 *   <App />
 * </ReactQueryProvider>
 *
 * @see {@link QueryClientProvider}
 */
export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // default: true
        },
      },
    }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
