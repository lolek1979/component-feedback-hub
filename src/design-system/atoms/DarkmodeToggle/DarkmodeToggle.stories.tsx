import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { DarkmodeToggle } from './DarkmodeToggle';

const messages = {
  Darkmode: {
    light: 'Light',
    dark: 'Dark',
  },
};

const meta: Meta<typeof DarkmodeToggle> = {
  title: 'Atoms/DarkmodeToggle',
  component: DarkmodeToggle,
  argTypes: {
    isDarkMode: {
      description: 'Indicates if dark mode is enabled',
      control: 'boolean',
    },
    setIsDarkMode: {
      description: 'Function to toggle dark mode state',
      action: 'setIsDarkMode',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DarkmodeToggle>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
