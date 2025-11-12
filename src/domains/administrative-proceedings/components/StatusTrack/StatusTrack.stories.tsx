import type { Meta, StoryObj } from '@storybook/react';

import { StatusTrack } from './StatusTrack';

const meta: Meta<typeof StatusTrack> = {
  title: 'Molecules/StatusTrack',
  component: StatusTrack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onItemClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof StatusTrack>;

export const Default: Story = {
  args: {
    items: [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }, { label: 'Step 4' }],
  },
};

export const WithActiveItem: Story = {
  args: {
    items: [
      { label: 'Step 1' },
      { label: 'Step 2', active: true },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ],
  },
};

export const WithCompletedItems: Story = {
  args: {
    items: [
      { label: 'Step 1', completed: true },
      { label: 'Step 2', completed: true },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3', disabled: true },
      { label: 'Step 4', disabled: true },
    ],
  },
};

export const MixedStatuses: Story = {
  args: {
    items: [
      { label: 'Step 1', completed: true },
      { label: 'Step 2', active: true },
      { label: 'Step 3' },
      { label: 'Step 4', disabled: true },
    ],
  },
};

export const WithBadges: Story = {
  args: {
    items: [
      { label: 'Step 1', completed: true, badgeContent: 'Completed' },
      { label: 'Step 2', active: true, badgeContent: 'In Progress' },
      { label: 'Step 3', badgeContent: 'Upcoming' },
      { label: 'Step 4', disabled: true, badgeContent: 'Unavailable' },
    ],
  },
};
