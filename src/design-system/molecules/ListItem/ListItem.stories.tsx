import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';

import {
  IAccountCircle,
  IAdd,
  IDeleteForever,
  IEdit,
  IFolder,
  IHome,
  ISearch,
  ISettings,
} from '@/core/assets/icons';

import { ListItem } from './ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'Molecules/ListItem',
  component: ListItem,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    children: {
      description: 'The text content of the list item',
      control: 'text',
    },
    size: {
      description: 'Size of the list item',
      control: { type: 'select' },
      options: ['S', 'M'],
    },
    state: {
      description: 'State of the list item',
      control: { type: 'select' },
      options: ['default', 'active', 'disabled'],
    },
    showStatus: {
      description: 'Whether to show the status dot',
      control: 'boolean',
    },
    isActive: {
      description: 'Whether the toggle is active',
      control: 'boolean',
    },
    onActiveChange: {
      description: 'Callback when toggle state changes',
      action: 'activeChange',
    },
    onClick: {
      description: 'Callback when list item is clicked',
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ListItem>;

export const Default: Story = {
  args: {
    children: 'List item',
    size: 'M',
    state: 'default',
    showStatus: false,
    isActive: false,
    onActiveChange: action('active-changed'),
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    state: 'active',
    isActive: true,
  },
};

export const WithStatus: Story = {
  args: {
    ...Default.args,
    children: 'List item with status',
    showStatus: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    state: 'disabled',
  },
};

export const SizeSmall: Story = {
  args: {
    ...Default.args,
    size: 'S',
    children: 'Small list item',
  },
};

export const WithLeftIcon: Story = {
  args: {
    ...Default.args,
    leftIcon: <IHome />,
    children: 'Home',
  },
};

export const WithRightIcon: Story = {
  args: {
    ...Default.args,
    rightIcon: <IEdit />,
    children: 'Editable item',
  },
};

export const WithBothIcons: Story = {
  args: {
    ...Default.args,
    leftIcon: <IFolder />,
    rightIcon: <ISettings />,
    children: 'Folder with settings',
  },
};

export const WithToggle: Story = {
  args: {
    ...Default.args,
    leftIcon: <IAccountCircle />,
    children: 'User account',
    isActive: true,
    onActiveChange: action('toggle-changed'),
  },
};

export const WithClick: Story = {
  args: {
    ...Default.args,
    leftIcon: <ISettings />,
    children: 'Clickable item',
    onClick: action('item-clicked'),
  },
};

// Example with multiple items
export const MultipleItems: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '300px' }}>
      <ListItem leftIcon={<IHome />} rightIcon={<IEdit />} onActiveChange={action('toggle-1')}>
        Home page
      </ListItem>
      <ListItem
        state="active"
        leftIcon={<IFolder />}
        showStatus
        isActive
        onActiveChange={action('toggle-2')}
      >
        Documents (Active)
      </ListItem>
      <ListItem leftIcon={<ISearch />} size="S" onActiveChange={action('toggle-3')}>
        Search results
      </ListItem>
      <ListItem state="disabled" leftIcon={<IAccountCircle />} rightIcon={<ISettings />}>
        User settings (Disabled)
      </ListItem>
      <ListItem
        leftIcon={<IAdd />}
        rightIcon={<IDeleteForever />}
        showStatus
        onActiveChange={action('toggle-5')}
      >
        Add new item
      </ListItem>
    </div>
  ),
};
