import type { Meta, StoryObj } from '@storybook/react';

import { CSMainInfo } from './CSMainInfo';

const meta: Meta<typeof CSMainInfo> = {
  title: 'Organisms/CSMainInfo',
  component: CSMainInfo,
  argTypes: {
    CSObject: {
      description: 'Main object containing all the information',
      control: 'object',
      table: {
        type: { summary: 'object' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CSMainInfo>;

export const Default: Story = {
  args: {
    CSObject: {
      title: 'Sample Title',
      id: '12345',
      guarantors: [
        {
          abbrev: 'JD',
          fullName: 'John Doe',
          mail: 'john.doe@example.com',
          department: 'Finance',
          businessPhones: ['123-456-7890'],
        },
        {
          abbrev: 'JS',
          fullName: 'Jane Smith',
          mail: 'jane.smith@example.com',
          department: 'HR',
          businessPhones: ['098-765-4321'],
        },
      ],
      validFrom: new Date('2023-01-01'),
      validUntil: new Date('2023-12-31'),
      types: 'Type1',
    },
  },
};
