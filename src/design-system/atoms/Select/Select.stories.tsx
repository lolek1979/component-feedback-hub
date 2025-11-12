import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import IPlaceholder from '@/core/assets/icons/icon-placeholder.svg';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Option } from './partials/Option';
import { Select, SelectProps } from './Select';

const items = [
  { label: 'Item Item Item 1', value: 'item-1' },
  { label: 'Item Item Item 2', value: 'item-2' },
  { label: 'Item Item Item 3', value: 'item-3' },
  { label: 'Item Item Item 4', value: 'item-4' },
  { label: 'Item Item Item 5', value: 'item-5' },
];

const wrapperStyles = {
  width: '100%',
};

const RenderSelect = (args: SelectProps) => {
  return (
    <div style={wrapperStyles}>
      <Select {...args}>
        {items.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const meta: Meta<typeof Select> = {
  title: 'Atoms/Field - Select',
  component: Select,
  decorators: [
    (Story) => (
      <FeedBackHubProvider>
        <Story />
      </FeedBackHubProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { description: 'The options to be displayed within the select.' },
    defaultValue: { description: 'The default selected value.' },
    value: { description: 'The currently selected value (controlled).' },
    onChange: { description: 'Callback function triggered when the selected value changes.' },
    multiple: { description: 'Enable multiple selection mode.' },
    defaultValues: { description: 'Default selected values for multiple selection.' },
    values: { description: 'Current selected values for controlled multiple selection.' },
    onMultiChange: { description: 'Callback for multiple selection changes.' },
    searchable: { description: 'Enable search functionality.' },
    searchPlaceholder: { description: 'Placeholder text for search input.' },
    placeholder: { description: 'Placeholder text displayed when no option is selected.' },
    disabled: { description: 'Disables the select component when true.' },
    className: { description: 'Additional class names for custom styling.' },
    compact: { description: 'Reduces padding and font size for a more compact layout.' },
    ariaLabel: { description: 'Aria label for accessibility.' },
    id: { description: 'Unique identifier for the select component.' },
    setIsOpenFooter: { description: 'Callback to toggle the visibility of a footer element.' },
    inputName: { description: 'Name attribute for the select input (used in forms).' },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select component.',
    },
    isError: {
      control: 'boolean',
      description: 'Indicates if the select is in an error state.',
    },
    maxDisplayLength: {
      control: 'number',
      description: 'Maximum number of characters to display for selected items.',
    },
    width: {
      control: 'number',
      description: 'Defines the width of the select component in pixels.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    placeholder: 'Select items',
    id: 'select-default',
  },
  render: RenderSelect,
};

export const Disabled: Story = {
  args: {
    placeholder: 'Select items',
    disabled: true,
    id: 'select-disabled',
  },
  argTypes: {
    defaultValue: {
      control: false,
    },
    disabled: {
      control: false,
    },
    className: {
      control: false,
    },
    placeholder: {
      control: false,
    },
  },
  render: RenderSelect,
};
export const Error: Story = {
  args: {
    placeholder: 'Select items',
    id: 'select-error',
    isError: true,
  },
  argTypes: {
    defaultValue: {
      control: false,
    },
    isError: {
      control: false,
    },
    className: {
      control: false,
    },
    placeholder: {
      control: false,
    },
  },
  render: RenderSelect,
};

export const Preselected: Story = {
  args: {
    placeholder: 'Select items',
    defaultValue: 'item-3',
    id: 'select-preselected',
  },
  render: RenderSelect,
};

const RenderCustomSelect = (args: SelectProps) => {
  return (
    <div style={wrapperStyles}>
      <Select {...args}>
        {items.map((item) => (
          <Option key={item.value} value={item.value}>
            <IPlaceholder width="30px" />
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export const WithCustomOptions: Story = {
  args: {
    placeholder: 'Select items',
    defaultValue: 'item-3',
    id: 'select-custom-options',
  },
  render: RenderCustomSelect,
};

// Multiselect Stories
export const MultiSelectBasic: Story = {
  args: {
    id: 'multiselect-basic',
    multiple: true,
    placeholder: 'Select multiple items',
    onMultiChange: action('multi-selection-changed'),
  },
  render: RenderSelect,
};

export const MultiSelectWithSearch: Story = {
  args: {
    id: 'multiselect-search',
    multiple: true,
    searchable: true,
    placeholder: 'Select multiple items',
    searchPlaceholder: 'Search options...',
    onMultiChange: action('multi-selection-changed'),
  },
  render: (args) => (
    <div style={wrapperStyles}>
      <Select {...args}>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
        <Option value="cherry">Cherry</Option>
        <Option value="date">Date</Option>
        <Option value="elderberry">Elderberry</Option>
        <Option value="fig">Fig</Option>
        <Option value="grape">Grape</Option>
        <Option value="honeydew">Honeydew</Option>
      </Select>
    </div>
  ),
};

export const MultiSelectPreselected: Story = {
  args: {
    id: 'multiselect-preselected',
    multiple: true,
    searchable: true,
    placeholder: 'Select multiple items',
    defaultValues: ['item-2', 'item-4'],
    onMultiChange: action('multi-selection-changed'),
  },
  render: RenderSelect,
};

export const MultiSelectDisabled: Story = {
  args: {
    id: 'multiselect-disabled',
    multiple: true,
    searchable: true,
    placeholder: 'Select multiple items',
    defaultValues: ['item-1', 'item-3'],
    disabled: true,
    onMultiChange: action('multi-selection-changed'),
  },
  render: RenderSelect,
};

// Single Select with Search
export const SingleSelectWithSearch: Story = {
  args: {
    id: 'singleselect-search',
    multiple: false,
    searchable: true,
    placeholder: 'Select an item',
    searchPlaceholder: 'Search options...',
    onChange: action('selection-changed'),
  },
  render: (args) => (
    <div style={wrapperStyles}>
      <Select {...args}>
        <Option value="javascript">JavaScript</Option>
        <Option value="typescript">TypeScript</Option>
        <Option value="python">Python</Option>
        <Option value="java">Java</Option>
        <Option value="csharp">C#</Option>
        <Option value="cpp">C++</Option>
        <Option value="rust">Rust</Option>
        <Option value="go">Go</Option>
      </Select>
    </div>
  ),
};
