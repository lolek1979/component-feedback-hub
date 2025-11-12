import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { LanguageSwitcher } from './LanguageSwitcher';

const messages = {
  LanguageSwitcher: {
    czech: 'Czech',
    english: 'English',
    selectLanguage: 'Select Language',
  },
};

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Molecules/LanguageSwitcher',
  component: LanguageSwitcher,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <FeedBackHubProvider>
          <Story />
        </FeedBackHubProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {
  render: () => (
    <FeedBackHubProvider>
      <LanguageSwitcher />
    </FeedBackHubProvider>
  ),
};
