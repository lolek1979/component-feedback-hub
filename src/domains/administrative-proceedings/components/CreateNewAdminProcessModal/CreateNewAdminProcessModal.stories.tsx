import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';

import { RolesProvider } from '@/core/providers/RolesProvider';

import { CreateNewAdminProcessModal } from './CreateNewAdminProcessModal';

// Create a mock QueryClient for the stories
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const meta: Meta<typeof CreateNewAdminProcessModal> = {
  title: 'Organisms/CreateNewAdminProcessModal',
  component: CreateNewAdminProcessModal,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <RolesProvider>
            <Story />
          </RolesProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CreateNewAdminProcessModal>;

export const Default: Story = {};
