import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Atoms/Field - RadioButton',
  component: RadioButton,
  argTypes: {
    id: { control: 'text', description: 'The unique identifier for the radio button.' },
    name: { control: 'text', description: 'The name attribute for the radio button.' },
    value: { control: 'text', description: 'The value attribute for the radio button.' },
    disabled: { control: 'boolean', description: 'Whether the radio button is disabled.' },
    onChange: {
      action: 'changed',
      description: 'Callback function when the radio button state changes.',
    },
    checked: { control: 'boolean', description: 'Whether the radio button is checked.' },
    label: { control: 'text', description: 'The aria-label for the radio button.' },
    'aria-labelledby': {
      control: 'text',
      description: 'The id of the element that serves as the label for the radio button.',
    },
    isError: { control: 'boolean', description: 'Whether the radio button is not valid.' },
  },
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  args: {
    checked: true,
    id: 'default-radio',
    name: 'default-group',
    value: 'default',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

const ErrorComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState('');

  return (
    <div>
      <RadioButton
        id="error1"
        name="error"
        value="error"
        checked={selectedValue === 'error'}
        isError={true}
        onChange={() => setSelectedValue('error1')}
      />
      <RadioButton
        id="error1"
        name="error"
        defaultChecked
        value="optierroron2"
        checked={selectedValue === 'error'}
        isError={true}
        onChange={() => setSelectedValue('error2')}
      />
    </div>
  );
};

export const Error: Story = {
  render: ErrorComponent,
};

const GroupComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState('');

  return (
    <div>
      <RadioButton
        id="option1"
        name="group"
        value="option1"
        checked={selectedValue === 'option1'}
        onChange={() => setSelectedValue('option1')}
      />
      <RadioButton
        id="option2"
        name="group"
        value="option2"
        checked={selectedValue === 'option2'}
        onChange={() => setSelectedValue('option2')}
      />
      <RadioButton
        id="option3"
        name="group"
        value="option3"
        checked={selectedValue === 'option3'}
        onChange={() => setSelectedValue('option3')}
      />
    </div>
  );
};

export const Group: Story = {
  render: GroupComponent,
};
