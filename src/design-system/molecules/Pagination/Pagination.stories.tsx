import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Pagination } from './Pagination';

const messages = {
  common: {
    pagination: {
      page: 'Page',
      previousPage: 'Previous Page',
      nextPage: 'Next Page',
      paginationNavigation: 'Pagination Navigation',
    },
  },
};

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: 'Pagination component for navigating through pages.',
      },
    },
  },
  argTypes: {
    pageCount: {
      description: 'Array of page numbers to display.',
    },
    currPage: {
      description: 'Current active page number.',
    },
    onChange: {
      description: 'Callback function triggered when the page changes.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    pageCount: 5,
    currPage: 1,
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export const MoreThanFivePages: Story = {
  args: {
    pageCount: 20,
    currPage: 1,
  },
};

export const CurrentPageMiddle: Story = {
  args: {
    pageCount: 20,
    currPage: 10,
  },
};

export const CurrentPageEnd: Story = {
  args: {
    pageCount: 20,
    currPage: 18,
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};
