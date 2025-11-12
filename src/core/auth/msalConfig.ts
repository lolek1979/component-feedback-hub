/* eslint-disable no-console */
import {
  AccountInfo,
  AuthenticationResult,
  BrowserCacheLocation,
  Configuration,
  EventMessage,
  EventType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';

import type { ParsedEnv } from '@/core/auth/types';
import { ROUTES } from '@/core/config/conf';

/**
 * Microsoft Graph API scopes required for authentication.
 * @type {string[]}
 */
export const GRAPH_SCOPES = ['User.Read'];

/**
 * Suffix for API scopes used in MSAL authentication.
 * @type {string}
 */
export const API_SCOPE_SUFFIX = '/access_as_user';

/**
 * Key used in localStorage to signal logout events.
 * @type {string}
 */
export const LOGOUT_EVENT_KEY = 'msal:logout';

/**
 * Interval for session checks in milliseconds.
 * @type {number}
 */
export const SESSION_CHECK_INTERVAL = 60000; // 1 minute

/**
 * Creates and initializes a MSAL PublicClientApplication instance.
 *
 * @param env - Parsed environment variables.
 * @returns The initialized {@link PublicClientApplication} instance.
 *
 * @see {@link Configuration}
 * @see {@link IPublicClientApplication}
 */
export const createMsalInstance = (env: ParsedEnv): PublicClientApplication => {
  const redirectUri =
    env.NODE_ENV === 'development' ? env.APP_REDIRECT_URI_DEV : env.APP_REDIRECT_URI_PROD;

  const msalConfig: Configuration = {
    auth: {
      clientId: env.CLIENT_ID || '',
      authority: `https://login.microsoftonline.com/${env.TENANT_ID}`,
      redirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true,
    },
    system: {
      allowPlatformBroker: false,
      windowHashTimeout: 9000,
      iframeHashTimeout: 9000,
      loadFrameTimeout: 9000,
      loggerOptions: {
        logLevel: env.NODE_ENV === 'development' ? 3 : 0,
      },
    },
  };

  const msalInstance = new PublicClientApplication(msalConfig);

  msalInstance
    .initialize()
    .then(() => {
      console.log('MSAL initialized successfully');
    })
    .catch((error) => {
      console.error('MSAL initialization failed:', error);
    });

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === LOGOUT_EVENT_KEY) {
        clearAllData(msalInstance);
        window.location.href = ROUTES.LOGOUT;
      }
    });
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    switch (event.eventType) {
      case EventType.LOGIN_SUCCESS:
        console.log('Login successful');
        break;
      case EventType.LOGIN_FAILURE:
        console.error('Login failed:', event.error);
        break;
      case EventType.LOGOUT_SUCCESS:
        clearAllData(msalInstance);
        localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
        window.location.href = ROUTES.LOGOUT;
        break;
      case EventType.ACQUIRE_TOKEN_SUCCESS:
        if (env.NODE_ENV === 'development') {
          console.log('Token acquired successfully');
        }
        break;
      case EventType.ACQUIRE_TOKEN_FAILURE:
        console.error('Token acquisition failed:', event.error);
        if (event.error?.name === 'InteractionRequiredAuthError') {
          logoutUser(msalInstance);
        }
        break;
    }
  });

  return msalInstance;
};

/**
 * Clears all authentication and session data from browser storage.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @internal
 */
const clearAllData = (msalInstance: IPublicClientApplication) => {
  msalInstance.clearCache();
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
};

/**
 * Logs in the user using MSAL, handling popups and redirects as needed.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns The authenticated {@link AccountInfo} or `null` if login fails.
 *
 * @see {@link acquireToken}
 * @see {@link logoutUser}
 */
export const loginUser = async (msalInstance: IPublicClientApplication) => {
  const accounts = msalInstance.getAllAccounts();
  const API_SCOPE = [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`];

  if (accounts.length > 0) {
    try {
      await acquireToken(msalInstance, accounts[0], API_SCOPE);

      return accounts[0];
    } catch (error) {
      console.error('Session validation failed:', error);
      await logoutUser(msalInstance);

      return null;
    }
  }

  const request = {
    scopes: [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`],
  };

  try {
    const isInIframe = window !== window.parent;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIE = userAgent.includes('trident') || userAgent.includes('msie');

    if (isInIframe || isIE) {
      try {
        const response = await msalInstance.loginPopup(request);

        return response.account;
      } catch (popupError: any) {
        console.error('Popup login failed:', popupError);
        await msalInstance.loginRedirect(request);

        return null;
      }
    } else {
      await msalInstance.loginRedirect(request);

      return null;
    }
  } catch (error: any) {
    const errorMessage = error.errorCode || error.message || 'Unknown login error';
    console.error(`Login failed: ${errorMessage}`, error);
    throw error;
  }
};

/**
 * Logs out the user and clears session data.
 *
 * @param msalInstance - The MSAL public client application instance.
 *
 * @see {@link clearAllData}
 */
export const logoutUser = async (msalInstance: IPublicClientApplication) => {
  try {
    localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());

    await msalInstance.logoutRedirect({
      postLogoutRedirectUri: ROUTES.LOGOUT,
      onRedirectNavigate: () => {
        clearAllData(msalInstance);

        return true;
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
    clearAllData(msalInstance);
    window.location.href = ROUTES.LOGOUT;
  }
};

/**
 * Acquires an authentication token for the given account and scopes.
 * Falls back to redirect if silent acquisition fails.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @param account - The account for which to acquire the token.
 * @param scopes - The scopes to request.
 * @returns A promise that resolves to an {@link AuthenticationResult} or `null`.
 *
 * @see {@link logoutUser}
 */
export const acquireToken = async (
  msalInstance: IPublicClientApplication,
  account: AccountInfo,
  scopes: string[],
): Promise<AuthenticationResult | null> => {
  const request = {
    scopes,
    account,
  };

  try {
    return await msalInstance.acquireTokenSilent(request);
  } catch (error: Error | unknown) {
    console.warn('Silent token acquisition failed:', error);
    if (error instanceof Error && error.name === 'InteractionRequiredAuthError') {
      await logoutUser(msalInstance);

      return null;
    }
    await msalInstance.acquireTokenRedirect(request);

    return null;
  }
};

/**
 * Starts a periodic session check to validate the user's authentication status.
 *
 * @param msalInstance - The MSAL public client application instance.
 * @returns A function to stop the session check interval.
 *
 * @see {@link acquireToken}
 * @see {@link logoutUser}
 */
export const startSessionCheck = (msalInstance: IPublicClientApplication) => {
  const checkSession = async () => {
    const accounts = msalInstance.getAllAccounts();
    const API_SCOPE = [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`];
    if (accounts.length > 0) {
      try {
        await acquireToken(msalInstance, accounts[0], API_SCOPE);
      } catch (error) {
        console.error('Session check failed:', error);
        await logoutUser(msalInstance);
      }
    }
  };

  const intervalId = setInterval(checkSession, SESSION_CHECK_INTERVAL);

  return () => clearInterval(intervalId);
};
