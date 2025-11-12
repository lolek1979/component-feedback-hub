import { Meta, StoryObj } from '@storybook/react';

import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { CodeListByIdResponse } from '@/domains/central-codelist-management/api/services';

import { CodelistTab } from './CodelistTab';

const meta: Meta<typeof CodelistTab> = {
  title: 'Organisms/CSCTabsContainer/Tabs/CodelistTab',
  component: CodelistTab,
  decorators: [
    (Story) => (
      <UnsavedChangesProvider>
        <Story />
      </UnsavedChangesProvider>
    ),
  ],
  argTypes: {
    data: {
      description: 'Table data to be displayed',
      control: 'object',
    },
    setTableData: {
      action: 'setTableData',
      description: 'Function to set the table data',
    },
    setColumnTypes: {
      action: 'setColumnTypes',
      description: 'Function to set the column types',
    },
    setCurrentPage: {
      action: 'setCurrentPage',
      description: 'Function to set the current page',
    },

    tableData: {
      control: 'object',
      description: 'The table data',
    },
    columnTypes: {
      control: 'object',
      description: 'The column types',
    },
    currentPage: {
      control: 'number',
      description: 'The current page number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodelistTab>;

const mockData: CodeListByIdResponse = {
  state: 'Success',
  messages: [
    {
      severity: 'info',
      code: '200',
      data: {
        additionalProp1: 'value1',
        additionalProp2: 'value2',
        additionalProp3: 'value3',
      },
    },
  ],
  payload: {
    id: '1',
    codeListId: 'CL123',
    name: 'Test Code List',
    code: 'TCL',
    description: 'This is a test code list',
    validFrom: '2024-01-01',
    garants: [
      {
        id: 'test-id',
        abbrev: 'JD',
        fullName: 'John Doe',
        mail: 'john.doe@example.com',
        department: 'IT',
        businessPhones: ['123-456-789'],
      },
    ],
    content: {
      data: [
        ['Test Item', 'TEST123', 'Praha'],
        ['Another Item', 'TEST456', 'Brno'],
      ],
      structure: {
        name: 'Test Structure',
        fields: [
          {
            code: '001',
            name: 'Field1',
            index: 1,
            length: 10,
            default: 'N/A',
            valueType: 1,
            description: 'Description1',
            validations: [],
          },
          {
            code: '002',
            name: 'Field2',
            index: 2,
            length: 20,
            default: 'N/A',
            valueType: 2,
            description: 'Description2',
            validations: [],
          },
        ],
      },
    },
    versionType: 'Draft',
    editors: [],
  },
};

export const Default: Story = {
  args: {
    data: mockData,
    setTableData: () => {},
    setColumnTypes: () => {},
    setCurrentPage: () => {},
    tableData: mockData.payload.content.data.map((item, idx) => ({
      rowId: idx + 1,
      column1: item[0],
      column2: item[1],
      column3: item[2],
    })),
    currentPage: 1,
  },
};
