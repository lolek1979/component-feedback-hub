import type { Meta, StoryObj } from '@storybook/nextjs';

import ProfileIcon from '@/core/assets/icons/settings.svg';

import { Tab } from './Tab';

const meta: Meta<typeof Tab> = {
  title: 'Atoms/Tab',
  component: Tab,
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables the tab' },
    selected: { control: 'boolean', description: 'Marks the tab as selected' },
    onChange: { action: 'changed', description: 'Callback when the tab is clicked' },
    id: { control: 'text', description: 'Unique identifier for the tab' },
    icon: {
      control: 'boolean',
      description: 'Icon element to be rendered inside the tab.',
    },
    iconAlign: {
      control: { type: 'radio', options: ['left', 'right'] },
      description: 'Determines the alignment of the icon: left or right.',
    },
  },
  args: {
    children: 'Záložka',
  },
};

export default meta;

type Story = StoryObj<typeof Tab>;

const TabList = ({ children }: { children: React.ReactNode }) => (
  <div role="tablist">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <TabList>
      <Tab {...args} icon={<ProfileIcon width={24} height={24} />} id="tab1" />
    </TabList>
  ),
};

export const IconRight: Story = {
  render: (args) => (
    <TabList>
      <Tab {...args} icon={<ProfileIcon width={24} height={24} />} iconAlign="right" id="tab1" />
    </TabList>
  ),
};

export const Selected: Story = {
  args: {
    selected: true,
    id: 'tab2',
  },
  render: (args) => (
    <TabList>
      <Tab {...args} id="tab1" />
    </TabList>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    id: 'tab3',
  },
  render: (args) => (
    <TabList>
      <Tab {...args} id="tab1" />
    </TabList>
  ),
};
