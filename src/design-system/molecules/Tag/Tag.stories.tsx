import type { Meta, StoryObj } from '@storybook/nextjs';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Molecules/Tag',
  component: Tag,
  args: {
    variant: 'active',
    children: 'Active',
  },
  argTypes: {
    variant: {
      description: 'The variant of the tag',
      control: 'select',
      options: ['active', 'concept', 'waiting', 'inactive', 'denied'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    variant: 'active',
    children: 'Active',
  },
};

export const Concept: Story = {
  args: {
    variant: 'concept',
    children: 'Draft',
  },
};

export const Waiting: Story = {
  args: {
    variant: 'planned',
    children: 'Planned',
  },
};

export const Inactive: Story = {
  args: {
    variant: 'expired',
    children: 'Expired',
  },
};

export const Denied: Story = {
  args: {
    variant: 'denied',
    children: 'Denied',
  },
};
