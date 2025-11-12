import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from '../auth/locale';

/**
 * Returns the Next.js internationalization request configuration.
 *
 * Dynamically loads locale messages based on the user's locale preference.
 *
 * @returns A promise that resolves to the request configuration object containing the locale and messages.
 *
 * @example
 * export default getRequestConfig(async () => {
 *   const locale = await getUserLocale();
 *   return {
 *     locale,
 *     messages: (await import(`../messages/${locale}.json`)).default,
 *   };
 * });
 *
 * @see {@link getUserLocale}
 */
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
