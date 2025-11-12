import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import IArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';

import { Chip } from './Chip';

const ISmallArrowDown = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_201_10648"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_201_10648)">
        <path
          d="M12 15.0538L6.34625 9.4L7.4 8.34625L12 12.9463L16.6 8.34625L17.6538 9.4L12 15.0538Z"
          fill="#19191A"
        />
      </g>
    </svg>
  );
};
const meta = {
  title: 'Molecules/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'The content to be displayed inside the badge',
      control: 'text',
    },
    className: {
      description: 'Additional CSS class names to apply to the badge',
      control: 'text',
    },
    ariaLabel: {
      description: 'Aria label for the badge',
      control: 'text',
    },
    color: {
      description: 'Badge color variant',
      control: 'select',
      options: [
        'gray',
        'green',
        'red',
        'blue',
        'orange',
        'lightGreen',
        'lightRed',
        'lightBlue',
        'lightOrange',
      ],
    },
    size: {
      description: 'Badge size variant',
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    icon: {
      description: 'Icon to display in the badge',
    },
    iconPosition: {
      description: 'Position of the icon',
      control: 'radio',
      options: ['left', 'right'],
    },
    disabled: {
      description: 'Disables the badge interaction',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default',
    color: 'gray',
    size: 'medium',
  },
};

export const Green: Story = {
  args: {
    children: 'Success',
    color: 'green',
    size: 'large',
  },
};

export const LightBlue: Story = {
  args: {
    children: 'Information',
    color: 'lightBlue',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'small',
    color: 'gray',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Done',
    size: 'medium',
    color: 'green',
    iconPosition: 'left',
  },
  render: (args) => (
    <Chip
      {...args}
      icon={['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
    />
  ),
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    size: 'medium',
    color: 'lightBlue',
    iconPosition: 'right',
  },
  render: (args) => (
    <Chip
      {...args}
      icon={['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
    />
  ),
};

export const WithBothIcons: Story = {
  render: (args) => (
    <Chip {...args}>
      <Chip.Icon position="left" id="left-icon">
        {['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
      </Chip.Icon>
      <Chip.Text id="badge-text">{args.children}</Chip.Text>
      <Chip.Icon position="right" id="right-icon">
        {['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
      </Chip.Icon>
    </Chip>
  ),
  args: {
    color: 'red',
    size: 'large',
    children: 'Both Icons',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    size: 'medium',
    iconPosition: 'right',
    disabled: true,
  },
};
