import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { DownloadPrintButtons } from './DownloadPrintButtons';

const meta: Meta<typeof DownloadPrintButtons> = {
  title: 'Molecules/DownloadPrintButtons',
  component: DownloadPrintButtons,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Component for download and print buttons with loading state.',
      },
    },
  },
  argTypes: {
    onDownload: {
      description: 'Function to handle download action',
      action: 'download',
    },
    onPrint: {
      description: 'Function to handle print action',
      action: 'print',
    },
    isLoading: {
      description: 'Boolean to indicate loading state',
      control: 'boolean',
    },
    className: {
      description: 'Optional additional class name for styling',
      control: 'text',
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
type Story = StoryObj<typeof DownloadPrintButtons>;

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
  sumVZP: 250.15,
};

export const Default: Story = {
  args: {
    onDownload: fn(),
    onPrint: fn(),
    isLoading: false,
    feesPageProps,
  },
};

export const Loading: Story = {
  args: {
    onDownload: fn(),
    onPrint: fn(),
    isLoading: true,
    feesPageProps,
  },
};
