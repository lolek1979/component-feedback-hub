import { Meta, StoryObj } from '@storybook/nextjs';

import { AppLink } from './Link';

const meta: Meta<typeof AppLink> = {
  title: 'Atoms/Link',
  component: AppLink,
  argTypes: {
    link: {
      control: 'text',
      description: 'The URL that the hyperlink points to.',
    },
    target: {
      control: {
        type: 'select',
        options: ['_self', '_blank', '_parent', '_top'],
      },
      description: 'Specifies where to open the linked document.',
    },
    children: {
      control: 'text',
      description: 'The content inside the link.',
    },
    dotted: {
      control: 'boolean',
      description: 'If the underline should be dotted',
    },
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary'],
      },
      description: 'Defines the style variant of the link (e.g., primary, secondary, tertiary).',
    },
    ariaLabel: {
      control: 'text',
      description: 'Aria label for the link.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof AppLink>;

export const Default: Story = {
  args: {
    link: '#',
    target: '_self',
    children: 'Link',
    variant: 'primary',
  },
};
