import { getFromLocalStorage } from '../auth/localStorage';

/**
 * Application route paths.
 *
 * @type {object}
 */

export const ROUTES = {
  HOME: '/',
  FEES: '/limity-a-doplatky',
  AUDIT_LIST: '/audit-list',
  AUDIT_DETAIL: '/audit-detail',
  FEES_PRINT: '/tisk-limity-doplatky',
  SETTINGS: '/nastaveni',
  LOGOUT: '/logout',
  CSC: '/centralni-sprava-ciselniku',
  ADM_PROCEEDINGS: '/spravni-rizeni',
  REQUESTS: '/e-zadanky',
  PDF_COMPARISON: '/porovnanipdf',
  QR_PAYMENT: '/qr-platby',
};

/**
 * API route paths (currently empty).
 *
 * @type {object}
 */
export const API_ROUTES = {};

/**
 * Mobile breakpoint value in pixels.
 *
 * @type {number}
 */
export const BREACKPOINT_MOBILE = 639;

/**
 * Supported environment hostnames.
 *
 * @type {object}
 */
export const ENVIRONMENTS = {
  PRODUCTION: 'app.nis.vzp.cz/',
  DEVELOPMENT: 'app.ndev2.vzpdev.cz',
  TEST: 'app.ntest1.vzpdev.cz',
  LOCAL: 'localhost:7296',
} as const;

/**
 * Returns the current environment name based on the window hostname.
 *
 * @returns {'production' | 'test' | 'development' | 'local'}
 *
 * @example
 * const env = getCurrentEnvironment();
 */
export const getCurrentEnvironment = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  switch (hostname) {
    case ENVIRONMENTS.PRODUCTION:
      return 'production';
    case ENVIRONMENTS.TEST:
      return 'test';
    case ENVIRONMENTS.DEVELOPMENT:
      return 'development';
    default:
      return 'local';
  }
};

/**
 * User roles loaded from localStorage.
 *
 * @type {any}
 */
export const userRoles = getFromLocalStorage('userRoles');

/**
 * Checks if the current environment is production.
 *
 * @returns {boolean}
 */
export const isProd = () => getCurrentEnvironment() === 'production';

/**
 * Checks if the current environment is development, test, or local.
 *
 * @returns {boolean}
 */
export const isDev = () => ['development', 'test', 'local'].includes(getCurrentEnvironment());
