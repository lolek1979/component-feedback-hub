import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Multiselect, MultiselectProps } from './Multiselect';

const messages = {
  Multiselect: {
    noOptions: 'No options available',
    selectAll: 'Select All',
    clearAll: 'Clear All',
    selected: 'selected',
  },
};

const RenderMultiselect = (args: MultiselectProps) => {
  return (
    <div
      style={{
        width: 'calc(100% - 62px)',
      }}
    >
      <Multiselect {...args} />
    </div>
  );
};

const meta: Meta<typeof Multiselect> = {
  title: 'Molecules/Multiselect',
  component: Multiselect,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <FeedBackHubProvider>
          <Story />
        </FeedBackHubProvider>
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    items: {
      description: 'Array of items to be displayed in the multiselect dropdown.',
      control: 'object',
    },
    defaultValues: {
      description: 'Array of default selected values.',
    },
    values: {
      description: 'Array of controlled selected values.',
    },
    placeholder: {
      description: 'Placeholder text to be displayed when no items are selected.',
      control: 'text',
    },
    disabled: {
      description: 'Disables the multiselect dropdown if set to true.',
      control: 'boolean',
    },
    className: {
      description: 'Additional class names to style the multiselect component.',
      control: 'text',
    },
    searchable: {
      description: 'Enable search functionality.',
      control: 'boolean',
    },
    searchPlaceholder: {
      description: 'Placeholder text for search input.',
      control: 'text',
    },
    helperText: {
      description: 'Helper text displayed below the component.',
      control: 'text',
    },
    isError: {
      description: 'Indicates if the component is in an error state.',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Multiselect>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Item 1', value: 'item-1' },
      { label: 'Item 2', value: 'item-2' },
      { label: 'Item 3', value: 'item-3' },
      { label: 'Item 4', value: 'item-4' },
      { label: 'Item 5', value: 'item-5' },
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
    placeholder: 'Select items',
    searchable: true,
    searchPlaceholder: 'Search options...',
    id: 'multiselect-default',
  },
  render: RenderMultiselect,
};

export const Disabled: Story = {
  args: {
    items: [
      { label: 'Item 1', value: 'item-1' },
      { label: 'Item 2', value: 'item-2' },
      { label: 'Item 3', value: 'item-3' },
      { label: 'Item 4', value: 'item-4' },
      { label: 'Item 5', value: 'item-5' },
    ],
    placeholder: 'Select items',
    searchable: true,
    searchPlaceholder: 'Search options...',
    disabled: true,
    defaultValues: ['item-1', 'item-2'],
    id: 'multiselect-disabled',
  },
  argTypes: {
    defaultValues: {
      control: false,
    },
    disabled: {
      control: false,
    },
    className: {
      control: false,
    },
    items: {
      control: false,
    },
    placeholder: {
      control: false,
    },
    searchable: {
      control: false,
    },
  },
  render: RenderMultiselect,
};

export const Preselected: Story = {
  args: {
    items: [
      { label: 'Item 1', value: 'item-1' },
      { label: 'Item 2', value: 'item-2' },
      { label: 'Item 3', value: 'item-3' },
      { label: 'Item 4', value: 'item-4' },
      { label: 'Item 5', value: 'item-5' },
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
    placeholder: 'Select items',
    searchable: true,
    searchPlaceholder: 'Search options...',
    defaultValues: ['item-1', 'item-3', 'apple'],
    id: 'multiselect-preselected',
  },
  render: RenderMultiselect,
};

export const WithHelperText: Story = {
  args: {
    items: [
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
      { label: 'Option 3', value: 'option-3' },
    ],
    placeholder: 'Choose options',
    searchable: true,
    searchPlaceholder: 'Search...',
    helperText: 'Select one or more options from the list',
    id: 'multiselect-helper',
  },
  render: RenderMultiselect,
};

export const ErrorState: Story = {
  args: {
    items: [
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
      { label: 'Option 3', value: 'option-3' },
    ],
    placeholder: 'Choose options',
    searchable: true,
    searchPlaceholder: 'Search...',
    helperText: 'Please select at least one option',
    isError: true,
    id: 'multiselect-error',
  },
  render: RenderMultiselect,
};
