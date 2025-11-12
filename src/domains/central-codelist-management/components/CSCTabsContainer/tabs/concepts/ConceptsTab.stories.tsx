import type { Meta, StoryObj } from '@storybook/react';

import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { ConceptsTab } from './ConceptsTab';

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
    state: '',
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
    state: '',
  },
];

const meta = {
  title: 'Organisms/CSCTabsContainer/Tabs/ConceptsTab',
  component: ConceptsTab,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <UnsavedChangesProvider>
        <Story />
      </UnsavedChangesProvider>
    ),
  ],
} satisfies Meta<typeof ConceptsTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: transformedDataCSCTabs,
    parentId: [],
  },
};
