'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { toast } from '@/design-system/molecules/Toast/Toast';

/**
 * Props for {@link NetworkStatusProvider}.
 */
interface NetworkStatusProviderProps {
  /** React children to render within the provider. */
  children: React.ReactNode;
}

/**
 * Provider component for monitoring network status and displaying offline notifications.
 *
 * Listens for the browser's offline event and shows a toast notification when the user goes offline.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <NetworkStatusProvider>
 *   <App />
 * </NetworkStatusProvider>
 */
const NetworkStatusProvider = ({ children }: NetworkStatusProviderProps) => {
  const tCommon = useTranslations('common');

  useEffect(() => {
    const handleOffline = () => {
      toast.error(tCommon('networkError'), {
        id: 'toast-networkStatusProvider-networkError',
      });
    };

    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, [tCommon]);

  return <>{children}</>;
};

export default NetworkStatusProvider;
