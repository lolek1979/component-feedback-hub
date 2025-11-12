import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { AuditListFilter } from './AuditListFilter';

const meta: Meta<typeof AuditListFilter> = {
  title: 'Organisms/AuditListFilter',
  component: AuditListFilter,
  argTypes: {
    initialFromDate: {
      description: 'Initial from date filter value',
      control: 'date',
    },
    initialToDate: {
      description: 'Initial to date filter value',
      control: 'date',
    },
    idOrEntityIdOrSessionId: {
      description: 'Initial entity ID filter value',
      control: 'text',
    },
    initialIdentityId: {
      description: 'Initial identity ID filter value',
      control: 'text',
    },
    initialSuccess: {
      description: 'Initial success filter value',
      control: 'text',
    },
    onFilterChange: {
      description: 'Callback function when filters change',
      action: 'onFilterChange',
    },
  },
  decorators: [
    (Story) => (
      <FeedBackHubProvider>
        <Story />
      </FeedBackHubProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AuditListFilter>;

export const Default: Story = {
  args: {
    idOrEntityIdOrSessionId: '12345',
    onFilterChange: fn(),
  },
};
