import { Meta, StoryObj } from '@storybook/react';

import { CodeListByIdResponse } from '@/domains/central-codelist-management/api/services';
import { DraftsByIdResponse } from '@/domains/central-codelist-management/api/services/getDraftsById';

import { DetailsTab } from './DetailsTab';

const meta: Meta<typeof DetailsTab> = {
  title: 'Organisms/CSCTabsContainer/Tabs/DetailsTab',
  component: DetailsTab,
  argTypes: {
    data: {
      description: 'Details data to be displayed',
      control: 'object',
    },
    status: {
      description: 'Status of the details',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DetailsTab>;

const mockCodeListData: CodeListByIdResponse = {
  state: 'Success',
  messages: [],
  payload: {
    id: '1',
    codeListId: 'CL123',
    name: 'Test Code List',
    code: 'TCL',
    description: 'This is a test code list',
    validFrom: '2024-01-01',
    garants: [
      {
        id: 'test-id1',
        abbrev: 'JD',
        fullName: 'John Doe',
        mail: 'john.doe@example.com',
        department: 'IT',
        businessPhones: ['123-456-789'],
      },
    ],
    editors: [
      {
        id: 'test-id2',
        abbrev: 'JS',
        fullName: 'Jane Smith',
        mail: 'jane.smith@example.com',
        department: 'HR',
        businessPhones: ['987-654-321'],
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
  },
};

const mockDraftData: DraftsByIdResponse = {
  structure: {
    structGuid: 'struct-123',
    version: '1.0',
    name: 'Test Structure',
    fields: [
      {
        code: '001',
        name: 'Field1',
        index: 1,
        length: 10,
        default: 'N/A',
        valueType: 'Decimal',
        description: 'Description1',
        validations: [],
      },
      {
        code: '002',
        name: 'Field2',
        index: 2,
        length: 20,
        default: 'N/A',
        valueType: 'String',
        description: 'Description2',
        validations: [],
      },
    ],
  },
  content: [
    ['Draft Item', 'DRAFT123', 'Ostrava'],
    ['Another Draft Item', 'DRAFT456', 'Plzeň'],
  ],
  id: '2',
  codeListId: 'CL456',
  name: 'Test Draft',
  description: 'This is a test draft',
  validFrom: '2024-02-01',
  garants: [
    {
      id: 'test-id3',
      abbrev: 'JS',
      fullName: 'Jane Smith',
      mail: 'jane.smith@example.com',
      department: 'HR',
      businessPhones: ['987-654-321'],
    },
  ],
  editors: [
    {
      id: 'test-id4',
      abbrev: 'JS',
      fullName: 'Jane Smith',
      mail: 'jane.smith@example.com',
      department: 'HR',
      businessPhones: ['987-654-321'],
    },
  ],
  versionType: 'Internal',
  code: 'TD',
};

export const Default: Story = {
  args: {
    data: mockCodeListData,
    status: 'Active',
  },
};

export const Draft: Story = {
  args: {
    data: mockDraftData,
    status: 'Draft',
  },
};
