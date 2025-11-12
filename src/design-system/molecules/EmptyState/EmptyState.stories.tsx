import type { Meta, StoryObj } from '@storybook/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import IBug from '@/core/assets/icons/bug_report.svg';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  argTypes: {
    onPrimaryAction: { action: 'primary clicked' },
    onSecondaryAction: { action: 'secondary clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: (args) => (
    <NuqsAdapter>
      <EmptyState {...args} />
    </NuqsAdapter>
  ),
  args: {
    title: 'No Data Found',
    description: 'Try adjusting your filters or add new items.',
    icon: <IBug width={24} height={24} />,
    btnPrimText: 'Add Item',
    onPrimaryAction: () => {},
  },
};

export const WithSecondary: Story = {
  render: (args) => (
    <NuqsAdapter>
      <EmptyState {...args} />
    </NuqsAdapter>
  ),
  args: {
    title: 'Nothing Here',
    description: 'You can refresh or add something new.',
    icon: <IBug width={48} height={48} />,
    btnPrimText: 'Refresh',
    btnScndText: 'Add New',
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  },
};

export const WithBugReport: Story = {
  render: (args) => (
    <NuqsAdapter>
      <EmptyState {...args} />
    </NuqsAdapter>
  ),
  args: {
    title: 'No Results',
    description: 'If you think this is a bug, report it.',
    icon: <IBug width={48} height={48} />,
    btnPrimText: 'Try Again',
    bugReport: true,
    onPrimaryAction: () => {},
  },
};

export const AllActions: Story = {
  render: (args) => (
    <NuqsAdapter>
      <EmptyState {...args} />
    </NuqsAdapter>
  ),
  args: {
    title: 'Empty State',
    description: 'You can try again, add new, or report a bug.',
    icon: <IBug width={48} height={48} />,
    btnPrimText: 'Try Again',
    btnScndText: 'Add New',
    bugReport: true,
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  },
};
