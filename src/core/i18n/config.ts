/**
 * Supported locale type.
 *
 * @type {Locale}
 * @see {@link locales}
 */
export type Locale = (typeof locales)[number];
/**
 * Array of supported locales.
 *
 * @type {readonly string[]}
 */

export const locales = ['en', 'cs'] as const;
/**
 * Default locale used in the application.
 *
 * @type {Locale}
 * @see {@link Locale}
 */
export const defaultLocale: Locale = 'cs';
