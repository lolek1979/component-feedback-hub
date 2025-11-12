import { CSSProperties } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';

import enMessages from '@/core/messages/en.json';
import { AppContextProvider } from '@/core/providers/context';
import { RolesProvider } from '@/core/providers/RolesProvider';

import { SideBar } from './SideBar';
const queryClient = new QueryClient();

// Mock component for Storybook
const MockedSideBar = () => {
  return (
    <NuqsAdapter>
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <RolesProvider>
              <SideBar />
            </RolesProvider>
          </AppContextProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </NuqsAdapter>
  );
};

const meta: Meta<typeof MockedSideBar> = {
  title: 'Molecules/SideBar',
  component: MockedSideBar,
};

export default meta;

type Story = StoryObj<typeof MockedSideBar>;

const wrapperStyles: CSSProperties = {
  height: '400px',
  overflow: 'auto',
  border: '1px solid var(--color-black-200)',
};

export const Default: Story = {
  render: () => (
    <div style={wrapperStyles}>
      <MockedSideBar />
    </div>
  ),
};
