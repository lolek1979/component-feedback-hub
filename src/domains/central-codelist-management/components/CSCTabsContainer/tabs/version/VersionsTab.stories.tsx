import type { Meta, StoryObj } from '@storybook/react';

import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { VersionsTab } from './VersionsTab';

const meta = {
  title: 'Organisms/CSCTabsContainer/Tabs/VersionsTab',
  component: VersionsTab,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <UnsavedChangesProvider>
        <Story />
      </UnsavedChangesProvider>
    ),
  ],
} satisfies Meta<typeof VersionsTab>;

const transformedDataCSCTabs = [
  {
    rowId: 1,
    id: '1',
    name: 'Concept 1',
    type: 'Type A',
    status: 'Active',
    validUntil: '2023-12-31',
    description: 'Description 1',
    validFrom: '2023-01-01',
    validTo: '2023-12-31',
    versionType: 'v1',
  },

  {
    rowId: 2,
    id: '2',
    name: 'Concept 2',
    type: 'Type B',
    status: 'Inactive',
    validUntil: '2024-06-30',
    description: 'Description 2',
    validFrom: '2024-01-01',
    validTo: '2024-06-30',
    versionType: 'v2',
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: transformedDataCSCTabs,
    parentId: [],
    codeListId: '',
  },
};
