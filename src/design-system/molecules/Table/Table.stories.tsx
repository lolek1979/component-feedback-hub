import { JSX, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { tableData } from '@/design-system/organisms/TableContainer/partials/mockData';

import { ColumnType, Table, TableProps, TableRowType } from './Table';

const columnDefaultTypes = Object.keys(tableData[0]).reduce(
  (acc, key) => {
    acc[key] = 'String';

    return acc;
  },
  {} as { [key: string]: ColumnType },
);

const meta: Meta<typeof Table> = {
  title: 'Molecules/Table',
  component: Table,
  decorators: [
    (Story) => (
      <UnsavedChangesProvider>
        <FeedBackHubProvider>
          <Story />
        </FeedBackHubProvider>
      </UnsavedChangesProvider>
    ),
  ],
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Data to be displayed in the table',
    },

    children: {
      control: { type: 'object' },
      description: 'Custom children elements to render inside the table',
    },

    editable: {
      control: { type: 'boolean' },
      description: 'Flag to enable or disable table editing',
    },

    columnTypes: {
      control: { type: 'object' },
      description: 'Column types for the table',
    },
    setColumnTypes: {
      control: { type: 'object' },
      description: 'Function to update column types',
    },
    hasFooter: {
      control: { type: 'boolean' },
      description: 'Flag to enable or disable table footer',
    },
  },
};
const tableMock = tableData.map((item, idx) => ({ rowId: idx + 1, ...item }));
export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    data: tableMock,
  },
};

export const ExcludedKeys: Story = {
  args: {
    data: tableMock,
  },
};

const EditableTableComponent = (args: JSX.IntrinsicAttributes & TableProps<TableRowType>) => {
  const [columnTypes, setColumnTypes] = useState<{ [key: string]: ColumnType }>(columnDefaultTypes);

  return (
    <UnsavedChangesProvider>
      <Table {...args} data={tableMock} columnTypes={columnTypes} setColumnTypes={setColumnTypes} />
    </UnsavedChangesProvider>
  );
};

export const EditableTable: Story = {
  render: (args) => <EditableTableComponent {...args} />,
  args: {
    data: tableMock,
    editable: true,
    columnTypes: {
      ...columnDefaultTypes,
    },
    hasFooter: true,
  },
};

export const TableWithFooter: Story = {
  args: {
    data: tableMock,
    hasFooter: true,
  },
};
