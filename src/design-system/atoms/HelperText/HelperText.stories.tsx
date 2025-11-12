import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import IDefault from '@/core/assets/icons/icon-placeholder.svg';
import { Input } from '@/design-system/atoms';
import { FieldLabel } from '@/design-system/atoms/FieldLabel';

import { HelperText } from './HelperText';

const meta: Meta<typeof HelperText> = {
  title: 'Atoms/HelperText',
  component: HelperText,
  argTypes: {
    variant: {
      description: "'error' | 'warning' | 'success' | 'default' - The type of message to display.",
      control: { type: 'select', options: ['error', 'warning', 'success', 'default'] },
    },
    text: {
      description: 'string - The message text.',
      control: { type: 'text' },
    },
    className: {
      description: 'string - Additional class names for styling.',
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof HelperText>;

const messagesStylesAllVariants: CSSProperties = {
  display: 'flex',
  gap: '20px',
  flexDirection: 'column',
};

const messagesStylesWithInput: CSSProperties = {
  display: 'flex',
  gap: '4px',
  flexDirection: 'column',
  maxWidth: '250px',
};

export const Default: Story = {
  args: {
    text: 'HelperText',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={messagesStylesAllVariants}>
      <HelperText id="messagge-test" text="HelperText" />
      <HelperText id="messagge-test-error" text="HelperText" variant="error" />
      <HelperText id="messagge-test-warning" text="HelperText" variant="warning" />
      <HelperText id="messagge-test-success" text="HelperText" variant="success" />
    </div>
  ),
};

export const WithInput: Story = {
  args: {
    text: 'HelperText',
    variant: 'error',
  },
  render: (args) => (
    <div style={messagesStylesWithInput}>
      <FieldLabel text="FIELD LABEL" htmlFor="message-story-input" />
      <Input
        type="text"
        value="Value"
        inputSize="small"
        id="message-story-input"
        iconAlign="right"
        icon={<IDefault />}
      />
      <HelperText {...args} />
    </div>
  ),
};
