import {
  BrowserAuthError,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from '@azure/msal-browser';

import { ROUTES } from '../config';
import { clearLocalStorage } from './localStorage';
import { API_SCOPE_SUFFIX, GRAPH_SCOPES } from './msalConfig';

/**
 * Handles authentication errors during token acquisition.
 * Clears local storage and redirects to logout if interaction is required or a browser auth error occurs.
 *
 * @param error - The error encountered during token acquisition.
 * @throws The original error after handling.
 * @internal
 */
const handleAuthError = (error: unknown) => {
  console.error('Token acquisition failed:', error);

  if (error instanceof InteractionRequiredAuthError || error instanceof BrowserAuthError) {
    clearLocalStorage();
    window.location.replace(ROUTES.LOGOUT);
  }

  throw error;
};

/**
 * Retrieves the current API access token using MSAL.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns A promise that resolves to the access token string, or `null` if not available.
 *
 * @example
 * const token = await getCurrentToken(msalInstance);
 *
 * @see {@link IPublicClientApplication}
 */
export async function getCurrentToken(
  msalInstance: IPublicClientApplication,
): Promise<string | null> {
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    clearLocalStorage();

    return null;
  }

  const request = {
    scopes: [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`],
    account: activeAccount || accounts[0],
  };

  try {
    const authResult = await msalInstance.acquireTokenSilent(request);

    return authResult.accessToken;
  } catch (error) {
    handleAuthError(error);

    return null;
  }
}

/**
 * Retrieves the current Microsoft Graph API access token using MSAL.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns A promise that resolves to the Graph API access token string, or `null` if not available.
 *
 * @example
 * const graphToken = await getCurrentGraphAPIToken(msalInstance);
 *
 * @see {@link IPublicClientApplication}
 */
export async function getCurrentGraphAPIToken(
  msalInstance: IPublicClientApplication,
): Promise<string | null> {
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    clearLocalStorage();

    return null;
  }

  const request = {
    scopes: GRAPH_SCOPES,
    account: activeAccount || accounts[0],
  };

  try {
    const authResult = await msalInstance.acquireTokenSilent(request);

    return authResult.accessToken;
  } catch (error) {
    handleAuthError(error);

    return null;
  }
}

/**
 * Ensures that an API access token is available for the current user.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns A promise that resolves to `true` if the token is available, otherwise `false`.
 *
 * @example
 * const hasToken = await ensureAccessToken(msalInstance);
 */
export async function ensureAccessToken(msalInstance: IPublicClientApplication): Promise<boolean> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      const silentRequest = {
        scopes: [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`],
        account: account,
      };

      const response = await msalInstance.acquireTokenSilent(silentRequest);

      return !!response.accessToken;
    }

    return false;
  } catch (error) {
    handleAuthError(error);

    return false;
  }
}

/**
 * Ensures that a Microsoft Graph API access token is available for the current user.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns A promise that resolves to `true` if the Graph token is available, otherwise `false`.
 *
 * @example
 * const hasGraphToken = await ensureGraphToken(msalInstance);
 */
export async function ensureGraphToken(msalInstance: IPublicClientApplication): Promise<boolean> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      const silentRequest = {
        scopes: GRAPH_SCOPES,
        account: account,
      };

      const response = await msalInstance.acquireTokenSilent(silentRequest);

      return !!response.accessToken;
    }

    return false;
  } catch (error) {
    handleAuthError(error);

    return false;
  }
}
