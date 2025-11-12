import type { Meta, StoryObj } from '@storybook/nextjs';

import { StepProgressBar } from './StepProgressBar';

const meta: Meta<typeof StepProgressBar> = {
  title: 'Molecules/StepProgressBar',
  component: StepProgressBar,
};

export default meta;

type Story = StoryObj<typeof StepProgressBar>;

export const Default: Story = {
  args: {
    steps: [{ status: 'passed' }, { status: 'active' }, { status: 'incomplete' }],
    orientation: 'horizontal',
  },
};

export const WithLabels: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'passed' },
      { label: 'Step 2', status: 'active' },
      { label: 'Step 3', status: 'incomplete' },
    ],
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    steps: [{ status: 'passed' }, { status: 'active' }, { status: 'incomplete' }],
    orientation: 'vertical',
  },
};

export const VerticalWithLabels: Story = {
  args: {
    steps: [
      { label: 'Step 1', status: 'passed' },
      { label: 'Step 2', status: 'active' },
      { label: 'Step 3', status: 'incomplete' },
    ],
    orientation: 'vertical',
  },
};
