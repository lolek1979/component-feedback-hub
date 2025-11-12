import type { Meta, StoryObj } from '@storybook/react';

import { KdpResultHeader } from './KdpResultHeader';

const meta: Meta<typeof KdpResultHeader> = {
  title: 'Organisms/KdpResultHeader',
  component: KdpResultHeader,
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the person',
    },
    insuranceNum: {
      control: 'text',
      description: 'Social Security Number of the person',
    },
    limit: {
      control: 'number',
      description: 'Limit amount in Kč',
    },
    hasToPayTotal: {
      control: 'number',
      description: 'Total amount to be paid in Kč',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
};

export default meta;

type Story = StoryObj<typeof KdpResultHeader>;

export const Default: Story = {
  args: {
    name: 'Jan Novak',
    insuranceNum: '123456789',
    limit: 1000,
    hasToPayTotal: 1000,
  },
};
