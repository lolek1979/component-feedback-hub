import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fn } from 'storybook/test';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { AuditTable } from './AuditTable';

const queryClient = new QueryClient();

const meta: Meta<typeof AuditTable> = {
  title: 'Organisms/AuditTable',
  component: AuditTable,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <UnsavedChangesProvider>
          <FeedBackHubProvider>
            <Story />
          </FeedBackHubProvider>
        </UnsavedChangesProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AuditTable>;

export const Default: Story = {
  args: {
    shouldFetch: false,
    onNumberOfRecordsChange: fn(),
    initialPage: 0,
    initialPageSize: '10',
    identityId: '',
    idOrEntityIdOrSessionId: '',
    timestampFrom: null,
    timestampTo: null,
    success: null,
    sort: 'timestamp,desc',
  },
};
