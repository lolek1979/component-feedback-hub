import type { Meta, StoryObj } from '@storybook/nextjs';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Field - Textarea',
  component: Textarea,
  args: {
    placeholder: 'Zadejte text',
    id: 'TextareaID',
    name: 'Textarea',
    form: 'TextareaFORM',
    disabled: false,
    readOnly: false,
    required: false,
    initialValue: '',
    maxLength: 200,
    helperText: 'Test',
  },
  argTypes: {
    placeholder: { description: 'Placeholder text for the textarea' },
    id: { description: 'ID of the textarea' },
    name: { description: 'Name of the textarea' },
    form: { description: 'Form ID that the textarea belongs to' },
    disabled: { description: 'Whether the textarea is disabled' },
    readOnly: { description: 'Whether the textarea is read-only' },
    required: { description: 'Whether the textarea is required' },
    initialValue: { description: 'Initial value of the textarea' },
    onChange: { description: 'Function to handle change events' },
    ariaLabel: { description: 'Aria label for the textarea' },
    ariaLabelledby: { description: 'Aria labelledby for the textarea' },
    ariaDescribedby: { description: 'Aria describedby for the textarea' },
    helperText: { description: 'Helper text displayed below the textarea.' },
    isError: {
      control: 'boolean',
      description: 'Indicates if the textarea is in an error state.',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed in the textarea.',
    },
    width: {
      control: 'number',
      description: 'Defines the width of the textarea in pixels.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    id: 'Disabled',
    name: 'Disabled',
    disabled: true,
    readOnly: false,
  },
};
export const Error: Story = {
  args: {
    placeholder: 'isError',
    id: 'isError',
    name: 'isError',
    readOnly: false,
    isError: true,
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'readOnly',
    id: 'readOnly',
    name: 'readOnly',
    disabled: false,
    readOnly: true,
  },
};
