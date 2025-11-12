import type { Meta, StoryObj } from '@storybook/nextjs';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Field - Checkbox',
  component: Checkbox,
  argTypes: {
    defaultChecked: {
      description: 'Specifies the initial checked state of the checkbox.',
    },
    label: {
      description: 'Provides an accessible label for the checkbox',
    },
    checked: {
      description: 'Specifies the checked state of the checkbox.',
    },
    isMultiselect: {
      description: 'Specifies the checked icon to "-" ',
    },
    isError: {
      description:
        'When error state should occur it changes the border color to red, could happen when two options that counter each other are selected.',
    },
    disabled: { description: 'Disables the checkbox, makes it non-clickable.' },
    onChange: { description: 'Event handler called when the checkbox state changes.' },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};
export const CheckedMultiselect: Story = {
  args: {
    checked: true,
    disabled: false,
    isMultiselect: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
export const Error: Story = {
  args: {
    isError: true,
  },
};
