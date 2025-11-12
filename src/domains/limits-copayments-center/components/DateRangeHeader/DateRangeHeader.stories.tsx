import type { Meta, StoryObj } from '@storybook/react';

import { DateRangeHeader } from './DateRangeHeader';

const meta: Meta<typeof DateRangeHeader> = {
  title: 'Molecules/DateRangeHeader',
  component: DateRangeHeader,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dateRange: { description: 'The range of dates to display' },
    dataSource: { description: 'The source of the data' },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeHeader>;

export const Default: Story = {
  args: {
    dateRange: '1. 1. 2024 - 31. 12. 2024',
    dataSource: 'Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv',
  },
};

export const LongDateRange: Story = {
  args: {
    dateRange: '1. ledna 2024 - 31. prosince 2024',
    dataSource: 'Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv',
  },
};

export const ShortDataSource: Story = {
  args: {
    dateRange: '1. 1. 2024 - 31. 12. 2024',
    dataSource: 'SÚKL',
  },
};
