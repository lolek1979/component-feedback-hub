import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import { ComparisonResult } from './ComparisonResult';

const meta: Meta<typeof ComparisonResult> = {
  title: 'Molecules/ComparisonResult',
  component: ComparisonResult,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      description: 'Variant of the comparison result',
      control: 'select',
      options: ['success', 'error'],
    },
    title: {
      description: 'Main title text',
      control: 'text',
    },
    description: {
      description: 'Description text',
      control: 'text',
    },
    onRetry: {
      description: 'Retry callback function (only for error variant)',
      action: 'retry clicked',
    },
    retryLabel: {
      description: 'Label for retry button',
      control: 'text',
    },
    className: {
      description: 'Additional CSS class names',
      control: 'text',
    },
    id: {
      description: 'Unique identifier',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComparisonResult>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Míra shody 100 %',
    description: 'Oba dokumenty jsou identické, žádné rozdíly nebyly nalezeny.',
    id: 'comparison-result-success',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Dokumenty se nepodařilo nahrát',
    description: 'Zkuste prosím soubory nahrát znovu',
    onRetry: fn(),
    retryLabel: 'Zkusit znovu',
    id: 'comparison-result-error',
  },
};

export const ErrorWithoutRetry: Story = {
  args: {
    variant: 'error',
    title: 'Dokumenty se nepodařilo nahrát',
    description: 'Zkuste prosím soubory nahrát znovu',
    id: 'comparison-result-error-no-retry',
  },
};
