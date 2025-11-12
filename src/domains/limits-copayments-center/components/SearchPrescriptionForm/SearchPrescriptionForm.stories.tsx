import type { Meta, StoryObj } from '@storybook/react';

import { SearchPrescriptionForm } from './SearchPrescriptionForm';

const meta: Meta<typeof SearchPrescriptionForm> = {
  title: 'Organisms/SearchPrescriptionForm',
  component: SearchPrescriptionForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selectedYear: {
      description: 'The selected year for filtering prescriptions.',
      control: 'text',
    },
    selectedMonth: {
      description: 'The selected month for filtering prescriptions.',
      control: 'text',
    },
    searchQuery: {
      description: 'The search query for filtering prescriptions.',
      control: 'text',
    },
    years: {
      description: 'The list of available years for selection.',
      control: 'object',
    },
    onYearChange: {
      description: 'Callback function when the year is changed.',
      action: 'yearChanged',
    },
    onMonthChange: {
      description: 'Callback function when the month is changed.',
      action: 'monthChanged',
    },
    onSearchChange: {
      description: 'Callback function when the search query is changed.',
      action: 'searchChanged',
    },
    className: {
      description: 'Additional class names for styling.',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchPrescriptionForm>;

export const Default: Story = {
  args: {
    selectedYear: '2024',
    selectedMonth: 'all',
    searchQuery: '',
  },
};

export const WithFilters: Story = {
  args: {
    selectedYear: '2024',
    selectedMonth: '3',
    searchQuery: 'ERP-2024',
  },
};
