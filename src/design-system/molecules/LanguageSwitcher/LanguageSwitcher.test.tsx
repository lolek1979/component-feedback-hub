import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import { setUserLocale } from '@/core/auth';
import { locales } from '@/core/i18n';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { LanguageSwitcher } from './LanguageSwitcher';

const defaultLocale = 'en';

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale={defaultLocale}>
      <FeedBackHubProvider>{component}</FeedBackHubProvider>
    </NextIntlClientProvider>,
  );
};

describe('LanguageSwitcher', () => {
  it('renders all available locales as options', () => {
    renderWithIntl(<LanguageSwitcher />);
    const selectElement = screen.getByRole('button');

    fireEvent.click(selectElement);
    const options = screen.getAllByRole('option');

    locales.forEach((locale, index) => {
      const expectedText = locale.toUpperCase();
      expect(options[index]).toHaveTextContent(expectedText);
    });
  });

  it('sets the default locale as selected', () => {
    renderWithIntl(<LanguageSwitcher />);
    const selectElement = screen.getByRole('button');
    const expectedText = defaultLocale.toUpperCase();
    expect(selectElement).toHaveTextContent(expectedText); // assuming 'en' is the default from useLocale mock
  });

  it('changes locale on selection and calls setUserLocale', () => {
    renderWithIntl(<LanguageSwitcher />);
    const selectElement = screen.getByRole('button');
    fireEvent.click(selectElement);

    const options = screen.getAllByRole('option');
    const newValue = 'cz';

    options.forEach((option) => {
      const expectedText = option.textContent?.trim().toLowerCase();
      if (expectedText !== newValue) {
        return;
      }
      fireEvent.click(option);
      expect(setUserLocale).toHaveBeenCalledWith(expectedText); // Verify the argument
    });
  });
});
