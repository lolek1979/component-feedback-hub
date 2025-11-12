import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { UsersSelect } from './UserSelect';

const messages = {
  UserSelect: {
    removeUser: 'Remove User',
    selectedUser: 'Selected User: ',
    choose: 'Choose a user',
    searchInput: 'Search for users',
    userOptions: 'User Options',
    addUser: 'Add User',
    newUser: 'New User',
  },
};

const meta: Meta<typeof UsersSelect> = {
  title: 'Molecules/UserSelect',
  component: UsersSelect,
  argTypes: {
    onSelectsChange: { action: 'onSelectsChange' },
    initialUsers: { control: 'object' },
    roles: { control: 'object' },
    id: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof UsersSelect>;

export const Default: Story = {
  args: {
    onSelectsChange: () => {},
    roles: ['user'],
    id: 'user',
    initialUsers: [],
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
