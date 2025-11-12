import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RolesProvider } from '@/core/providers/RolesProvider';

import { CSCHeader } from './CSCHeader';
const query = new QueryClient();
const meta: Meta<typeof CSCHeader> = {
  title: 'Organisms/CSCHeader',
  component: CSCHeader,
  decorators: [
    (Story) => (
      <QueryClientProvider client={query}>
        <RolesProvider>
          <Story />
        </RolesProvider>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    title: {
      description: 'Header title',
      control: 'text',
    },
    status: {
      description: 'Status badge text',
      control: 'text',
    },
    breadcrumbs: {
      description: 'Navigation breadcrumbs',
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CSCHeader>;

export const Default: Story = {
  args: {
    title: 'Seznam odbernych mist',
    status: 'concept',
    breadcrumbs: [
      { value: 'Centralni sprava ciselniku', link: '/' },
      { value: 'Seznam odbernych mist', link: '/projects/123' },
    ],
  },
};

export const ActiveStatus: Story = {
  args: {
    title: 'Seznam odbernych mist',
    status: 'active',
    breadcrumbs: [
      { value: 'Centralni sprava ciselniku', link: '/' },
      { value: 'Seznam odbernych mist', link: '/projects/123' },
    ],
  },
};
export const ConceptWithParent: Story = {
  args: {
    title: 'Seznam odbernych mist',
    status: 'concept',
    parentInfo: {
      title: 'Seznam odbernych mist',
      validFrom: '1.1.2024',
      link: '/ciselniky/seznam-odbernych-mist',
    },
    breadcrumbs: [
      { value: 'Centralni sprava ciselniku', link: '/' },
      { value: 'Seznam odbernych mist', link: '/projects/123' },
    ],
  },
};
