import type { Meta, StoryObj } from '@storybook/nextjs';

import { UsersInfo } from './UsersInfo';

const meta: Meta<typeof UsersInfo> = {
  title: 'Molecules/UsersInfo',
  component: UsersInfo,
  argTypes: {
    title: { description: 'The title of the UsersInfo component' },
    users: { description: 'Array of user objects containing name, phone, and email' },
    className: { description: 'Optional additional class name for the container' },
  },
};

export default meta;
type Story = StoryObj<typeof UsersInfo>;

export const Default: Story = {
  args: {
    title: 'Garant',
    users: [
      {
        abbrev: 'MF',
        fullName: 'Milan Fousek',
        mail: 'milan.fousek@vzp.cz',
        department: 'MVP',
        businessPhones: ['+420 123 456 789', '+420 987 654 321'],
      },
      {
        abbrev: 'MH',
        fullName: 'Miroslav Hakl',
        mail: 'miroslav.hakl@vzp.cz',
        department: 'MVP',
        businessPhones: ['+420 123 456 789'],
      },
      {
        abbrev: 'JP',
        fullName: 'Jana Potužáková',
        mail: 'jana.potuzakova@vzp.cz',
        businessPhones: ['+420 123 456 789'],
        department: 'MVP',
      },
    ],
  },
};
