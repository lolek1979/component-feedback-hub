import { Meta, StoryObj } from '@storybook/nextjs';

import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Molecules/RadioButtonGroup',
  component: RadioGroup,
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options for the radio buttons',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the radio button group',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when a radio button is selected',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button group is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional class name for custom styling',
    },
    horizontal: {
      control: 'boolean',
      description: 'Display radio buttons horizontally instead of vertically',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    name: 'default-group',
  },
};

export const WithDefaultValue: Story = {
  args: {
    ...Default.args,
    defaultValue: 'option2',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Horizontal: Story = {
  args: {
    ...Default.args,
    horizontal: true,
    id: 'horizontal-group',
  },
};

export const ManyOptions: Story = {
  args: {
    ...Default.args,
    options: [
      ...defaultOptions,
      { value: 'option4', label: 'Option 4' },
      { value: 'option5', label: 'Option 5' },
      { value: 'option6', label: 'Option 6' },
    ],
  },
};
