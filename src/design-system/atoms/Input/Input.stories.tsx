import type { Meta, StoryObj } from '@storybook/nextjs';

import ProfileIcon from '@/core/assets/icons/profileIcon.svg';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Field - Input',
  component: Input,
  argTypes: {
    type: {
      control: { type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
      description: 'The type of input, such as text, email, password, etc.',
    },
    value: {
      control: 'text',
      description: 'The value of the input',
    },
    icon: {
      control: 'boolean',
      description: 'Optional icon to display inside the input',
    },
    iconAlign: {
      control: { type: 'radio', options: ['left', 'right'] },
      description: 'Alignment of the icon, either left or right',
    },
    inputSize: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Size of the input, can be small, medium, or large',
    },
    borderColor: {
      control: 'color',
      description: 'Custom border color for the input',
    },
    isError: {
      control: 'boolean',
      description: 'When input is inc',
    },
    padding: {
      control: 'text',
      description: 'Custom padding for the input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function to handle change events',
    },
    list: {
      control: 'text',
      description: 'The id of a <datalist> element that provides autocomplete options',
    },
    onFocus: {
      action: 'focused',
      description: 'Callback function to handle focus events',
    },
    onBlur: {
      action: 'blurred',
      description: 'Callback function to handle blur events',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function to handle click events',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the input',
    },
    id: {
      control: 'text',
      description: 'The id of the input element',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text to display when the input is empty',
    },
    required: {
      control: 'boolean',
      description: 'Indicates that the input is required',
    },
    ariaLabel: {
      control: 'text',
      description: 'Aria label for the input',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'The id of the element that labels the input',
    },
    ariaInvalid: {
      control: 'boolean',
      description: 'Indicates that the input is invalid',
    },
    ariaRequired: {
      control: 'boolean',
      description: 'Indicates that the input is required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input. Accepts string or ReactNode.',
    },
    currency: {
      control: 'text',
      description: 'Optional currency to display in a box on the right side',
    },
    width: {
      control: 'number',
      description: 'Width of the input in pixels',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLeftIcon: Story = {
  args: {
    ...Default.args,
    icon: <ProfileIcon />,
    iconAlign: 'left',
  },
};

export const WithRightIcon: Story = {
  args: {
    ...Default.args,
    icon: <ProfileIcon />,
    iconAlign: 'right',
  },
};

export const CustomStyles: Story = {
  args: {
    ...Default.args,
    inputSize: 'large',
    borderColor: '#007bff',
    padding: '12px',
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    inputSize: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    inputSize: 'large',
  },
};

export const SmallWithRightIcon: Story = {
  args: {
    ...Small.args,
    icon: <ProfileIcon />,
    iconAlign: 'right',
  },
};

export const LargeWithLeftIcon: Story = {
  args: {
    ...Large.args,
    icon: <ProfileIcon />,
    iconAlign: 'left',
  },
};

export const WithCurrency: Story = {
  args: {
    ...Default.args,
    currency: 'Kč',
    placeholder: 'Enter amount...',
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    placeholder: 'Enter amount...',
    isError: true,
    currency: 'Kč',
    helperText: 'Example helper text :)',
  },
};

export const WithCurrencyAndIcon: Story = {
  args: {
    ...Default.args,
    currency: 'EUR',
    icon: <ProfileIcon />,
    iconAlign: 'left',
    placeholder: 'Enter amount...',
  },
};

export const LargeWithCurrency: Story = {
  args: {
    ...Default.args,
    inputSize: 'large',
    currency: 'USD',
    placeholder: 'Enter amount...',
  },
};

export const WithCustomWidth: Story = {
  args: {
    ...Default.args,
    width: 200,
    placeholder: 'Custom width 200px',
  },
};
