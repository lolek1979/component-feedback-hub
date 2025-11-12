/* eslint-disable no-console */
import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ColumnOptions } from './ColumnOptions';

const messages = {
  ColumnOptions: {
    addColumnRight: 'Add Column Right',
    addColumnLeft: 'Add Column Left',
    deleteColumn: 'Delete Column',
  },
};

const meta: Meta<typeof ColumnOptions> = {
  title: 'Molecules/ColumnOptions',
  component: ColumnOptions,
  argTypes: {
    index: {
      description: 'The index of the column',
    },
    onColumnAction: {
      description: 'Function to handle column actions (delete, add left, add right)',
    },
    onTypeChange: {
      description: 'Function to handle column type changes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ColumnOptions>;

export const Default: Story = {
  args: {
    index: 0,
    onColumnAction: (action: string, columnIndex: number) =>
      console.log(`Action: ${action} on column ${columnIndex}`),
    onTypeChange: (type: string) => console.log(`Type changed to: ${type}`),
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
