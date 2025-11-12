'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Context value type for Feedback Hub.
 *
 * @property isFeedBackHubOpen - Indicates if the Feedback Hub is open.
 */
type FeedBackHubContextType = {
  isFeedBackHubOpen: boolean;
};

/**
 * React context for Feedback Hub state.
 *
 * @see {@link FeedBackHubProvider}
 * @see {@link useFeedBackHub}
 */
const FeedBackHubContext = createContext<FeedBackHubContextType | undefined>(undefined);

/**
 * Provider component for Feedback Hub state.
 *
 * Determines if the Feedback Hub should be open based on the `captureScreenshot` query parameter.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <FeedBackHubProvider>
 *   <App />
 * </FeedBackHubProvider>
 *
 * @see {@link useFeedBackHub}
 */
export const FeedBackHubProvider = ({ children }: { children: ReactNode }) => {
  const [isFeedBackHubOpen, setIsFeedBackHubOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const shouldCapture = searchParams.get('captureScreenshot') === 'true';
    setIsFeedBackHubOpen(shouldCapture);
  }, [searchParams]);

  return (
    <FeedBackHubContext.Provider value={{ isFeedBackHubOpen }}>
      {children}
    </FeedBackHubContext.Provider>
  );
};

/**
 * Custom hook to access Feedback Hub context.
 *
 * Throws an error if used outside of {@link FeedBackHubProvider}.
 *
 * @returns The {@link FeedBackHubContextType} context value.
 *
 * @throws Error if used outside of {@link FeedBackHubProvider}.
 *
 * @example
 * const { isFeedBackHubOpen } = useFeedBackHub();
 */
export const useFeedBackHub = () => {
  const context = useContext(FeedBackHubContext);
  if (context === undefined) {
    throw new Error('useFeedBackHub must be used within a FeedBackHubProvider');
  }

  return context;
};
