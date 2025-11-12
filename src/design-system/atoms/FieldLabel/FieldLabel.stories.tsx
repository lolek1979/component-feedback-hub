import type { Meta, StoryObj } from '@storybook/nextjs';

import { FieldLabel } from './FieldLabel';

const meta: Meta<typeof FieldLabel> = {
  title: 'Atoms/FieldLabel',
  component: FieldLabel,
  argTypes: {
    text: { control: 'text', description: 'The text which will be represented on the label.' },
    htmlFor: {
      control: 'text',
      description:
        'Associates the label with a specific form element, such as an `<input>` or `<textarea>`. This improves accessibility and allows users to click the label to focus on the corresponding input field.',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description:
        'Specifies the size of the label. Common sizes include `small`, `medium`, and `large`.',
    },
    color: { control: 'color', description: 'Defines the label color.' },
    fontFamily: { control: 'text', description: 'Determines the label font family.' },
    required: { control: 'boolean', description: 'Indicates if the label is required.' },
    className: { control: 'text', description: 'Additional CSS classes to apply to the label.' },
    ariaLabel: { control: 'text', description: 'Aria label for the label.' },
    ariaLabelledBy: { control: 'text', description: 'Aria labelled by for the label.' },
    id: { control: 'text', description: 'The id of the label.' },
  },
};

export default meta;

type Story = StoryObj<typeof FieldLabel>;

export const Default: Story = {
  args: {
    text: 'Default Label',
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
  },
};

export const Prominent: Story = {
  args: {
    ...Default.args,
    required: true,
    size: 'prominent',
  },
};

export const CustomStyles: Story = {
  args: {
    ...Default.args,
    color: '#0f62fe',
    fontFamily: 'Arial, sans-serif',
  },
};
