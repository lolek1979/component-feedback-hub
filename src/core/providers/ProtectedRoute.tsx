'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

import { loginUser } from '@/core/auth/msalConfig';
import { ROUTES } from '@/core/config';

/**
 * Props for {@link ProtectedRoute}.
 */
interface ProtectedRouteProps {
  /** React children to render within the protected route. */
  children: React.ReactNode;
}

/**
 * Provider component for protecting routes that require authentication.
 *
 * Checks authentication status using MSAL and redirects to login if the user is not authenticated.
 * Renders children only when authentication is complete and the user is authenticated.
 *
 * @param props.children - The React children to render within the protected route.
 *
 * @example
 * <ProtectedRoute>
 *   <SecureComponent />
 * </ProtectedRoute>
 *
 * @see {@link useMsal}
 * @see {@link useIsAuthenticated}
 * @see {@link loginUser}
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance, inProgress } = useMsal();
  const pathname = usePathname();

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (!isAuthenticated) {
        if (!(pathname === ROUTES.LOGOUT)) {
          loginUser(msalInstance);
        }
      }
    }
  }, [inProgress, isAuthenticated, msalInstance, pathname]);

  if (inProgress !== InteractionStatus.None || (!isAuthenticated && pathname !== ROUTES.LOGOUT))
    return null;

  return children;
};

export default ProtectedRoute;
