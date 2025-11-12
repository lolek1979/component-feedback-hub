import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RolesProvider } from '@/core/providers/RolesProvider';

import { CscHeaderButtons } from './CscHeaderButtons';

const meta: Meta<typeof CscHeaderButtons> = {
  title: 'Organisms/CscHeaderButtons',
  component: CscHeaderButtons,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();

      return (
        <QueryClientProvider client={queryClient}>
          <RolesProvider>
            <Story />
          </RolesProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof CscHeaderButtons>;

export const Default: Story = {};
