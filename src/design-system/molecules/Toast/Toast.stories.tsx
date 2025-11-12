import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Toast, toast } from './Toast';

const messages = {
  common: {
    closeToast: 'Close Toast',
  },
};

const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Toast has no props, only the toast hook
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

const ToastDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Toast />
      <button onClick={() => toast.success('Success toast!', { id: 'success-toast-1' })}>
        Show Success
      </button>
      <button onClick={() => toast.error('Error toast!', { id: 'error-toast-1' })}>
        Show Error
      </button>
      <button onClick={() => toast.info('Info toast!', { id: 'info-toast-1' })}>Show Info</button>
      <button onClick={() => toast.warning('Warning toast!', { id: 'warning-toast-1' })}>
        Show Warning
      </button>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ToastDemo />
    </NextIntlClientProvider>
  ),
};

const ToastActionDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Toast />
      <button
        onClick={() =>
          toast.error('error toast', {
            id: 'error-with-action-toast',
            action: {
              label: 'Retry',
              onClick: () => alert('retry clicked'),
            },
          })
        }
      >
        Error Toast with Action
      </button>
    </div>
  );
};

export const WithAction: Story = {
  render: () => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ToastActionDemo />
    </NextIntlClientProvider>
  ),
};

const ToastInfinityDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Toast />
      <button
        onClick={() => toast.info('Infinity toast', { id: 'infinity-toast', duration: Infinity })}
      >
        Info Toast with Infinity Duration
      </button>
    </div>
  );
};

export const WithInfinityDuration: Story = {
  render: () => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ToastInfinityDemo />
    </NextIntlClientProvider>
  ),
};

const ToastCustomDurationDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Toast />
      <button
        onClick={() =>
          toast.info('Eight seconds duration toast', {
            id: 'custom-duration-toast',
            duration: 8000,
          })
        }
      >
        Info Toast with 8s Duration
      </button>
    </div>
  );
};

export const WithCustomDuration: Story = {
  render: () => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ToastCustomDurationDemo />
    </NextIntlClientProvider>
  ),
};
