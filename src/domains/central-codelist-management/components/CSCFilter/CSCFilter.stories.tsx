import type { Meta, StoryObj } from '@storybook/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { CSCFilter } from './CSCFilter';

const meta: Meta<typeof CSCFilter> = {
  title: 'Molecules/CSCFilter',
  component: CSCFilter,
  argTypes: {
    onFilterChange: {
      description: 'Callback function that is called when any filter value changes',
      action: 'filter changed',
    },
    types: {
      description: 'Array of type options for the type select dropdown',
      control: false,
      table: {
        type: {
          summary: 'Array<{ value: string; label: string }>',
        },
      },
    },
    states: {
      description: 'Array of state options for the state select dropdown',
      control: false,
      table: {
        type: {
          summary: 'Array<{ value: string; label: string }>',
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A filter component for code lists that includes search, type selection, state selection and subconcepts toggle.',
      },
    },
  },
  decorators: [
    (Story) => (
      <FeedBackHubProvider>
        <Story />
      </FeedBackHubProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CSCFilter>;

export const Default: Story = {
  args: {
    types: [
      { value: 'leky', label: 'Léky' },
      { value: 'diagnozy', label: 'Diagnózy' },
    ],
    states: [
      { value: 'aktivni', label: 'Aktivní' },
      { value: 'neaktivni', label: 'Neaktivní' },
    ],
    onFilterChange: () => {},
  },
};

export const WithPrefilledValues: Story = {
  args: {
    ...Default.args,
    initialValues: {
      search: 'test',
      types: ['leky'],
      states: ['aktivni'],
      showSubconcepts: true,
    },
  },
};
