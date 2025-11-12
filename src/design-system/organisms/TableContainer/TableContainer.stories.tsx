import type { Meta, StoryObj } from '@storybook/nextjs';

import DownloadIcon from '@/core/assets/icons/download.svg';
import PrintIcon from '@/core/assets/icons/icon-print.svg';
import { Button } from '@/design-system/atoms';
import { Table } from '@/design-system/molecules/Table';

import { tableData } from './partials/mockData';
import { TableContainer } from './TableContainer';

const tabs = [
  { id: '2025', value: '2025' },
  { id: '2024', value: '2024' },
  { id: '2023', value: '2023' },
];

const table1Data = [
  {
    rowId: 3,
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    age: 28,
    role: 'Moderator',
  },
  { rowId: 3, id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', age: 35, role: 'User' },
];
const table2Data = [
  { rowId: 1, id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30, role: 'Admin' },
  { rowId: 2, id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, role: 'User' },
];

const selectedItems = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '15', value: '15' },
];

const TableButtons = [
  <Button
    id="button-table-container-pdf"
    key="download"
    icon={<DownloadIcon width={24} height={24} className={'icon_white'} />}
  >
    Uložit jako PDF
  </Button>,
  <Button
    id="button-table-container-print"
    key="print"
    variant="secondary"
    icon={<PrintIcon width={24} height={24} />}
  >
    Vytisknout
  </Button>,
];

const meta: Meta<typeof TableContainer> = {
  title: 'Organisms/TableContainer',
  component: TableContainer,
  args: {
    title: 'Table Title',
    description: 'This is a description for the table.',
    tabs: tabs,
    buttons: TableButtons,
    selectItems: selectedItems,
    // eslint-disable-next-line no-console
    onSelectChange: (value: string) => console.log(`Selected row count: ${value}`),
  },
  argTypes: {
    title: {
      description: 'The title of the table container.',
    },
    description: {
      description: 'The description of the table container.',
    },
    tabs: {
      description: 'Array of tab objects with id and value.',
    },
    buttons: {
      description: 'Array of button components to be displayed in the toolbar.',
    },
    selectItems: {
      description: 'Array of selectable items for the table.',
    },
    onSelectChange: {
      description: 'Callback function when the selected item changes.',
    },
    toolbar: {
      description: 'Boolean to show or hide the toolbar.',
      control: { type: 'boolean' },
    },
    children: {
      description: 'Child components to be rendered inside the table container.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TableContainer>;
const tableMock = tableData.map((item, idx) => ({ rowId: idx + 1, ...item }));
export const Default: Story = {
  render: (args) => (
    <TableContainer {...args}>
      <Table data={tableMock} />
      <Table data={tableMock} />
      <Table
        data={table1Data.concat(table2Data)}
        //TODO: Check if theme is required here
        // theme={{
        //   headerBgColor: '#ffffff',
        //   headerTextColor: 'black',
        //   bodyBgColor: '#ffffff',
        //   bodyTextColor: 'black',
        //   borderColor: 'black',
        // }}
      />
    </TableContainer>
  ),
};
