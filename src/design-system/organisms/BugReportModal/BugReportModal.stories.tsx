import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';

import enMessages from '@/core/messages/en.json';

import { BugReportModal } from './BugReportModal';

const queryClient = new QueryClient();

const meta: Meta<typeof BugReportModal> = {
  component: BugReportModal,
  title: 'Organisms/BugReportModal',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BugReportModal>;

const MockedComponent = () => {
  const [isVisible, setIsVisible] = useQueryState('bugReport', parseAsBoolean.withDefault(false));

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
    <>
      <div
        id="modal-root"
        style={{
          height: '400px',
        }}
      />
      <div style={containerStyle}>
        <div>
          <span style={{ marginRight: '10px' }}>
            Status: {isVisible ? 'Visible (bugReport=true)' : 'Hidden (bugReport=false)'}
          </span>
        </div>
        <button style={buttonStyle} onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide Bug Report Modal' : 'Show Bug Report Modal'}
        </button>
      </div>

      <BugReportModal />
    </>
  );
};

export const Default: Story = {
  render: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('feedbackScreenshot');
    }

    return (
      <NuqsAdapter>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <QueryClientProvider client={queryClient}>
            <MockedComponent />
          </QueryClientProvider>
        </NextIntlClientProvider>
      </NuqsAdapter>
    );
  },
};

export const WithScreenshot: Story = {
  render: () => {
    // Simulate having a screenshot in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'feedbackScreenshot',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      );
    }

    return (
      <NuqsAdapter>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <QueryClientProvider client={queryClient}>
            <MockedComponent />
          </QueryClientProvider>
        </NextIntlClientProvider>
      </NuqsAdapter>
    );
  },
};
