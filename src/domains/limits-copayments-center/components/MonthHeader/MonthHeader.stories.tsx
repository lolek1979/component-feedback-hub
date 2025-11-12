import type { Meta, StoryObj } from '@storybook/react';

import { MonthHeader } from './MonthHeader';

const meta: Meta<typeof MonthHeader> = {
  title: 'Molecules/MonthHeader',
  component: MonthHeader,
  argTypes: {
    month: { description: 'The month to display' },
    year: { description: 'The year to display' },
    limit: { description: 'The limit for the month' },
    limitTotal: { description: 'The total limit' },
  },
};

export default meta;

type Story = StoryObj<typeof MonthHeader>;

export const Default: Story = {
  args: {
    month: '3',
    limit: 500,
    year: '2023',
    limitTotal: 5000,
  },
};

export const LimitReached: Story = {
  args: {
    month: '2',
    limit: 0,
    year: '2023',
    limitTotal: 0,
  },
};
