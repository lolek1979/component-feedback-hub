import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CSCTabsContainer } from './CSCTabsContainer';

const queryClient = new QueryClient();

const meta: Meta<typeof CSCTabsContainer> = {
  title: 'Organisms/CSCTabsContainer',
  component: CSCTabsContainer,
  parameters: {
    docs: {
      description: {
        component:
          'A container component that manages multiple tabs for different search functionalities',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CSCTabsContainer>;

export const Default: Story = {};
