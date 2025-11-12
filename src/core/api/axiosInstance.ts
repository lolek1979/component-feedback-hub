import { IPublicClientApplication } from '@azure/msal-browser';
import axios from 'axios';

import { API_SCOPE_SUFFIX, GRAPH_SCOPES } from '@/core/auth/msalConfig';
import { getCurrentGraphAPIToken, getCurrentToken } from '@/core/auth/tokenFetcher';
import type { ParsedEnv } from '@/core/auth/types';

const GRAPH_URL = 'https://graph.microsoft.com/v1.0';

let axiosInstance = axios.create();
let axiosInstanceGraph = axios.create();
let axiosInstanceNoAuth = axios.create();

/**
 * The current API version.
 * @type {string}
 */
export const API_VERSION = '1';

/**
 * The current patch version for codelist APIs.
 * @type {string}
 */
export const CODELIST_PATCH_VERSION = '1.1';

/**
 * Initializes Axios instances for API, Graph API, and unauthenticated requests.
 * Sets up interceptors for authentication and token refresh logic.
 *
 * @param env - Parsed environment variables.
 * @param msalInstance - The MSAL public client application instance for authentication.
 *
 * @see {@link axiosInstance}
 * @see {@link axiosInstanceGraph}
 * @see {@link axiosInstanceNoAuth}
 */
export const initAxiosInstances = (env: ParsedEnv, msalInstance: IPublicClientApplication) => {
  const IS_DEV = env.NODE_ENV === 'development';
  const IS_MOCK = env.IS_MOCK === 'true';

  const BASE_URL = !IS_DEV ? env.BASE_URL_PROD : IS_MOCK ? env.BASE_URL_MOCK : env.BASE_URL_DEV;

  axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  axiosInstanceGraph = axios.create({
    baseURL: GRAPH_URL,
  });

  axiosInstanceNoAuth = axios.create({
    baseURL: BASE_URL,
  });

  axiosInstanceGraph.interceptors.request.use(
    async (config) => {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          const silentRequest = {
            scopes: GRAPH_SCOPES,
            account: account,
          };

          const response = await msalInstance.acquireTokenSilent(silentRequest);
          config.headers.Authorization = `Bearer ${response.accessToken}`;
        }

        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error),
  );

  axiosInstanceGraph.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await getCurrentGraphAPIToken(msalInstance);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          const silentRequest = {
            scopes: [`api://${msalInstance.getConfiguration().auth.clientId}${API_SCOPE_SUFFIX}`],
            account: account,
          };

          const response = await msalInstance.acquireTokenSilent(silentRequest);
          config.headers.Authorization = `Bearer ${response.accessToken}`;
        }

        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await getCurrentToken(msalInstance);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

export { axiosInstance, axiosInstanceGraph, axiosInstanceNoAuth };
