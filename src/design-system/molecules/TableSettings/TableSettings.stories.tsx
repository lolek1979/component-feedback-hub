import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test'; // Import the fn utility

import enMessages from '@/core/messages/en.json';
import { tableData } from '@/design-system/organisms/TableContainer/partials/mockData';

import { TableSettings, TableSettingsProps } from './TableSettings';

const meta: Meta<typeof TableSettings> = {
  title: 'Molecules/TableSettings',
  component: TableSettings,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    items: {
      description: 'Array of item strings to display as options in the table settings.',
    },
    onOptionsChange: {
      description: 'Callback function that is called when the options change.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TableSettings>;

const RenderTableSettings = (args: TableSettingsProps) => {
  const items = Object.keys(tableData[0]).map((key) => ({
    label: key,
    value: key,
  }));

  return (
    <div style={{ width: '300px', border: '1px gray solid' }}>
      <TableSettings items={items} onOptionsChange={args.onOptionsChange} />
    </div>
  );
};

export const Default: Story = {
  render: RenderTableSettings,
  args: {
    onOptionsChange: fn(), // Explicitly define the action using fn()
  },
};
