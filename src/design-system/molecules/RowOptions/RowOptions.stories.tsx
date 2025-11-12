/* eslint-disable no-console */
import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { RowOptions } from './RowOptions';

const messages = {
  RowOptions: {
    addRowAbove: 'Add Row Above',
    addRowBelow: 'Add Row Below',
    deleteRow: 'Delete Row',
  },
};

const meta: Meta<typeof RowOptions> = {
  title: 'Molecules/RowOptions',
  component: RowOptions,
  argTypes: {
    index: {
      description: 'The index of the row',
    },
    onRowAction: {
      description: 'Function to handle row actions (delete, add above, add below)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RowOptions>;

export const Default: Story = {
  args: {
    index: 0,
    onRowAction: (action: string, rowIndex: number) =>
      console.log(`Action: ${action} on row ${rowIndex}`),
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
