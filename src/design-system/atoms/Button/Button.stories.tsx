import type { Meta, StoryObj } from '@storybook/nextjs';

import ProfileIcon from '@/core/assets/icons/settings.svg';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    variant: 'primary',
    id: 'button-id',
    children: 'Button',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Defines the size of the button: small, medium, or large.', // Description appears in Controls
    },
    icon: {
      control: 'boolean',
      description: 'Icon element to be rendered inside the button.', // Description for icon prop
    },
    iconAlign: {
      control: { type: 'radio', options: ['left', 'right'] },
      description: 'Determines the alignment of the icon: left or right.',
    },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'tertiary'] },
      description: 'Defines the button style variant: primary, secondary, or tertiary.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button when true.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Aria label for the button.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    icon: <ProfileIcon className="icon_white" width={24} height={24} />,
    ariaLabel: 'Primary button',
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    size: 'medium',
    variant: 'tertiary',
  },
  parameters: {
    backgrounds: {
      default: 'black',
      values: [{ name: 'black', value: '#000000' }],
    },
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
};
