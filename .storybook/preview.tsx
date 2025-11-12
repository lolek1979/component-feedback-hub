// @ts-nocheck

import { NextIntlClientProvider } from 'next-intl';
import type { Preview } from '@storybook/nextjs';

import en from '../messages/en.json';
import * as customIcons from '../src/assets/icons';
import { AppContextProvider } from './../src/providers/context';
import { ModeDecorator } from './modeDocerator/modeDecorator';

import '../src/styles/globals.css';
import './reset.css';
import './darkMode.css';

import { inter } from '@/app/fonts';
import cz from '@/messages/cz.json';

const messages = {
  en,
  cz,
};

const withNextIntl = (Story, context) => {
  const { locale = 'en' } = context.globals;

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <AppContextProvider>
        <div className={`${inter.className} ${inter.variable}`}>
          <Story {...context} />
        </div>
      </AppContextProvider>
    </NextIntlClientProvider>
  );
};

const initializeDarkMode = () => {
  if (typeof document !== 'undefined') {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';

    if (!savedDarkMode) {
      document.documentElement.classList.remove('dark');
      document.body.setAttribute('data-mode', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.body.setAttribute('data-mode', 'dark');
    }
  }
};

if (typeof document !== 'undefined') {
  initializeDarkMode();
  document.documentElement.classList.add(inter.className, inter.variable);
}

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    designToken: {
      defaultTab: 'Colors',
      styleInjection: '', // Removed Google Fonts import since we're using local fonts
      showSearch: true,
      pageSize: 100,
      tabs: [
        'Colors',
        'SVG Icons',
        'Border',
        'BorderRadius',
        'FontSize',
        'FontWeight',
        'LetterSpacing',
        'Spacing',
      ],
      customIcons,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      // Optional selector to inspect
      element: '#storybook-root',
      config: {
        rules: [
          // For more information how to disable/skip WCAG rules -> https://storybook.js.org/docs/writing-tests/accessibility-testing
          // checking for color contrast is disabled because it's complining about using the following colors:
          // Orange 500, Green 500, Black 400 with a white background
          { id: 'color-contrast', enabled: false },
          { id: 'p-as-heading', enabled: false },
        ],
      },
      // Axe's options parameter
      options: {},
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};

// This is the place responsible for grouping all decorators from the storybook app
export const decorators = [ModeDecorator, withNextIntl];
export default preview;
