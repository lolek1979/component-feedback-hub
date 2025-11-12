import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import { SearchPrescriptionContainer } from './SearchPrescriptionContainer';

const meta: Meta<typeof SearchPrescriptionContainer> = {
  title: 'Organisms/SearchPrescriptionContainer',
  component: SearchPrescriptionContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SearchPrescriptionContainer allows users to search for prescriptions by year, month, and query. It also provides download and print functionalities.',
      },
    },
  },
  argTypes: {
    selectedYear: {
      description: 'The selected year for the search.',
      control: 'text',
    },
    selectedMonth: {
      description: 'The selected month for the search.',
      control: 'text',
    },
    searchQuery: {
      description: 'The search query string.',
      control: 'text',
    },
    onYearChange: {
      description: 'Callback function when the year is changed.',
      action: 'Year changed',
    },
    onMonthChange: {
      description: 'Callback function when the month is changed.',
      action: 'Month changed',
    },
    onSearchChange: {
      description: 'Callback function when the search query is changed.',
      action: 'Search query changed',
    },
    onDownload: {
      description: 'Callback function when the download button is clicked.',
      action: 'Download clicked',
    },
    onPrint: {
      description: 'Callback function when the print button is clicked.',
      action: 'Print clicked',
    },
    isLoading: {
      description: 'Indicates if the component is in a loading state.',
      control: 'boolean',
    },
  },
};

const translations = {
  t: (key: string) => key,
  tKDPResultHeader: (key: string) => key,
  tTable: (key: string) => key,
  tErrors: (key: string) => key,
};

const feesPageProps = {
  suklLimits: undefined,
  suklLimitsName: 'Test Name',
  hasToPayTotal: 100,
  limit: 200,
  period: '2023-01',
  insuranceNum: '123456789',
  translations,
  suklData: {},
  downloadDate: '2023-01-01',
  year: 2023,
  sumInsuer: 5000,
  sumVZP: 150.25,
};
export default meta;
type Story = StoryObj<typeof SearchPrescriptionContainer>;

export const Default: Story = {
  args: {
    selectedYear: '2024',
    selectedMonth: '1',
    searchQuery: '',
    onYearChange: fn(),
    onMonthChange: fn(),
    onSearchChange: fn(),
    onDownload: fn(),
    onPrint: fn(),
    isLoading: false,
    feesPageProps,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    feesPageProps,
  },
};

export const WithSearchQuery: Story = {
  args: {
    ...Default.args,
    searchQuery: 'Test prescription',
    feesPageProps,
  },
};

export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
      feesPageProps,
    },
  },
};
