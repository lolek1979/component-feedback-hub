import type { Meta, StoryObj } from '@storybook/nextjs';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    name: {
      description: 'The name of the user to generate initials from',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'John Doe',
  },
};

export const WithLongName: Story = {
  args: {
    name: 'Alexander Hamilton',
  },
};

export const WithSingleName: Story = {
  args: {
    name: 'Madonna',
  },
};
