import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import messages from '@/core/messages/en.json';

import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/Field - DatePicker',
  component: DatePicker,
  argTypes: {
    onDateChange: {
      description: 'Callback function that is called when the selected date changes.',
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const MinDate: Story = {
  args: {
    minDate: new Date().getFullYear(),
  },
};
export const RangedCalendar: Story = {
  args: {
    rangeCalendar: true,
  },
};
