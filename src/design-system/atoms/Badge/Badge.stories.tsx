import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import IArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';

import { Badge } from './Badge';

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
  title: 'Atoms/Badge',
  component: Badge,
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
      options: ['xsmall', 'small', 'large'],
    },
    icon: {
      description: 'Icon to display in the badge',
    },
    iconPosition: {
      description: 'Position of the icon',
      control: 'radio',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default',
    color: 'gray',
    size: 'small',
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
    size: 'small',
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
    size: 'small',
    color: 'green',
    iconPosition: 'left',
  },
  render: (args) => (
    <Badge
      {...args}
      icon={['small', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
    />
  ),
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    size: 'small',
    color: 'lightBlue',
    iconPosition: 'right',
  },
  render: (args) => (
    <Badge
      {...args}
      icon={['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
    />
  ),
};

export const WithBothIcons: Story = {
  render: (args) => (
    <Badge {...args}>
      <Badge.Icon position="left" id="left-icon">
        {['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
      </Badge.Icon>
      <Badge.Text id="badge-text">{args.children}</Badge.Text>
      <Badge.Icon position="right" id="right-icon">
        {['medium', 'large'].includes(args.size ?? '') ? <IArrowDown /> : <ISmallArrowDown />}
      </Badge.Icon>
    </Badge>
  ),
  args: {
    color: 'red',
    size: 'xsmall',
    children: 'Both Icons',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    size: 'small',
    iconPosition: 'right',
    color: 'disabled',
  },
};
