import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import enMessages from '@/core/messages/en.json';
import { AppContextProvider } from '@/core/providers/context';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Header } from './Header';

const queryClient = new QueryClient();

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onSearch: {
      description: 'Callback function to handle search input changes',
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AppContextProvider>
          <FeedBackHubProvider>
            <QueryClientProvider client={queryClient}>
              <Story />
            </QueryClientProvider>
          </FeedBackHubProvider>
        </AppContextProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithSearchCallback: Story = {
  args: {
    // eslint-disable-next-line no-console
    onSearch: (searchTerm: string) => console.log('Search term:', searchTerm),
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
