'use server';

import { cookies } from 'next/headers';

import { defaultLocale, Locale } from '@/core/i18n/config';
// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
/**
 * The name of the cookie used to store the user's locale preference.
 * @internal
 */
const COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Retrieves the user's locale from cookies.
 * If the locale cookie is not set, returns the default locale.
 *
 * @returns A promise that resolves to the user's locale as a string.
 *
 * @example
 * const locale = await getUserLocale();
 *
 * @see {@link defaultLocale}
 */
export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

/**
 * Sets the user's locale in cookies.
 *
 * @param locale - The locale to set for the user.
 *
 * @example
 * await setUserLocale('en');
 *
 * @see {@link Locale}
 */
export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
