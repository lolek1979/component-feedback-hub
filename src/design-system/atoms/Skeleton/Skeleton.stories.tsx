import { Meta, StoryObj } from '@storybook/nextjs';

import { Skeleton } from './Skeleton';

export default {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  argTypes: {
    size: {
      description: 'Defines the size of the skeleton. Can be "small", "medium", or "large".',
    },
    maxWidth: {
      description: 'Sets the maximum width of the skeleton.',
    },
    height: {
      description: 'Sets the height of the skeleton.',
    },
    borderRadius: {
      description: 'Sets the border radius of the skeleton.',
    },
  },
} as Meta<typeof Skeleton>;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const CustomSize: Story = {
  args: {
    maxWidth: '200px',
    height: '48px',
  },
};

export const CustomBorderRadius: Story = {
  args: {
    size: 'medium',
    borderRadius: '16px',
  },
};

export const MultipleSkeletons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton size="small" />
      <Skeleton size="medium" />
      <Skeleton size="large" />
      <Skeleton maxWidth="180px" />
      <Skeleton borderRadius="16px" />
    </div>
  ),
};
