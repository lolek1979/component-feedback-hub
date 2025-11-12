import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';

import enMessages from '@/core/messages/en.json';

import ScreenshotSnackbar from './ScreenshotSnackbar';

const queryClient = new QueryClient();

const meta: Meta<typeof ScreenshotSnackbar> = {
  component: ScreenshotSnackbar,
  title: 'Organisms/ScreenshotSnackbar',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ScreenshotSnackbar>;

const MockedComponent = () => {
  const [isVisible, setIsVisible] = useQueryState(
    'captureScreenshot',
    parseAsBoolean.withDefault(false),
  );

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '40px',
    backgroundColor: '#f8f8f8',
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: isVisible ? '#ef4444' : '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  };

  return (
    <div>
      <div style={containerStyle}>
        <div>
          <span style={{ marginRight: '10px' }}>
            Status:{' '}
            {isVisible ? 'Visible (captureScreenshot=true)' : 'Hidden (captureScreenshot=false)'}
          </span>
        </div>
        <button style={buttonStyle} onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide Screenshot Snackbar' : 'Show Screenshot Snackbar'}
        </button>
      </div>

      <ScreenshotSnackbar />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <NuqsAdapter>
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <QueryClientProvider client={queryClient}>
          <MockedComponent />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </NuqsAdapter>
  ),
};
