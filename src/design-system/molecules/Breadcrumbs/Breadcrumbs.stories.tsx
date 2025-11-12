import type { Meta, StoryObj } from '@storybook/nextjs';

import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component: 'Breadcrumbs component to display navigation links.',
      },
      argTypes: {
        breadcrumbs: {
          description: 'Array of breadcrumb objects containing value and link.',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    breadcrumbs: [
      { value: 'Domov', link: '/' },
      { value: 'Zdraví', link: '/products' },
      { value: 'Prohlídky', link: '/products/electronics' },
    ],
  },
};
export const BackLinkIcon: Story = {
  args: {
    breadcrumbs: [{ value: 'Domov', link: '/' }],
    showBackLink: true,
  },
};

export const WithLastCurrent: Story = {
  args: {
    breadcrumbs: [
      { value: 'Domov', link: '/' },
      { value: 'Zdraví', link: '/products' },
      { value: 'Prohlídky', link: '/products/electronics' },
    ],
  },
};

export const TwoElements: Story = {
  args: {
    breadcrumbs: [
      { value: 'Domov', link: '/' },
      { value: 'Zdraví', link: '/products' },
    ],
  },
};
