/* eslint-disable no-console */
import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RolesProvider } from '@/core/providers/RolesProvider';

import { RowActionsList, RowActionsListProps } from './RowActionsList';

const messages = {
  TableActionsMenu: {
    Details: 'Details',
    Edit: 'Edit',
    Approval: 'Approval',
    Export: 'Export',
    NewVersion: 'NewVersion',
    CancelApproval: 'CancelApproval',
    Deactivate: 'Deactivate',
    Publish: 'Publish',
    CopyLink: 'CopyLink',
  },
};
const queryClient = new QueryClient();

const meta: Meta<typeof RowActionsList> = {
  title: 'Molecules/RowActionsList',
  component: RowActionsList,

  argTypes: {
    status: {
      description: 'The status of the row which determines the available actions.',
      control: {
        type: 'select',
        options: ['Awaiting', 'Draft', 'Active', 'Inactive'],
      },
    },
    onItemSelect: {
      description: 'Callback function triggered when an action item is selected.',
      action: 'selected',
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <QueryClientProvider client={queryClient}>
          <RolesProvider>
            <Story />
          </RolesProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RowActionsList>;

export const Default = (args: RowActionsListProps) => <RowActionsList {...args} />;

export const Draft: Story = {
  args: {
    status: 'Concept',
    onItemSelect: (item: string) => console.log(`Item selected: ${item}`),
  },
  render: Default,
};

export const Awaiting: Story = {
  args: {
    status: 'Planned',
    onItemSelect: (item: string) => console.log(`Item selected: ${item}`),
  },
  render: Default,
};

export const Active: Story = {
  args: {
    status: 'Active',
    onItemSelect: (item: string) => console.log(`Item selected: ${item}`),
  },
  render: Default,
};

export const Inactive: Story = {
  args: {
    status: 'Expired',
    onItemSelect: (item: string) => console.log(`Item selected: ${item}`),
  },
  render: Default,
};
