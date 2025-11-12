import { useLocale } from 'next-intl';

import { setUserLocale } from '@/core/auth/locale';
import { Locale, locales } from '@/core/i18n/config';
import { Option, Select } from '@/design-system/atoms';

import style from './LanguageSwitcher.module.css';

/**
 * LanguageSwitcher component for selecting application language.
 *
 * Renders a select dropdown with available locales and updates the user's locale on change.
 *
 * @returns React component
 */
export const LanguageSwitcher = () => {
  /**
   * Handles locale selection change.
   *
   * @param nextLocale - The selected locale string.
   */
  const onSelectChange = (nextLocale: string) => {
    setUserLocale(nextLocale as Locale);
  };

  const locale = useLocale();

  return (
    <Select
      id="select-language-switcher"
      defaultValue={locale}
      className={style.languageSwitcher}
      onChange={onSelectChange}
      ariaLabel="Language Switcher"
    >
      {locales.map((cur) => (
        <Option key={cur} value={cur}>
          {cur.toUpperCase()}
        </Option>
      ))}
    </Select>
  );
};
