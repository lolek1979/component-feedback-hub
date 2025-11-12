import { Meta, StoryObj } from '@storybook/nextjs';

import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: 'A toggle switch component with customizable properties.',
      },
    },
  },
  argTypes: {
    checked: {
      description:
        'Controls the checked state of the toggle. If set, it overrides the internal state.',
    },
    disabled: {
      description: 'Disables the toggle if set to true.',
    },
    defaultChecked: {
      description: 'Sets the initial checked state of the toggle.',
    },
    label: {
      description: 'Aria-label for the toggle button.',
    },
    isError: {
      description: 'Indicates whether the toggle is in an error state.',
    },
    onChange: {
      description: 'Event handler for the change event. Receives the change event as an argument.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

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
