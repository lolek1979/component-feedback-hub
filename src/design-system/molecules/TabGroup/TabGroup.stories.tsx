import type { Meta, StoryObj } from '@storybook/nextjs';

import { TabGroup } from './TabGroup';

const meta: Meta<typeof TabGroup> = {
  title: 'Molecules/TabGroup',
  component: TabGroup,
  argTypes: {
    tabs: {
      description: 'Array of tab objects with value, id, and optional disabled properties.',
    },
    children: {
      description: 'Content to be displayed within the selected tab.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabGroup>;

export const Default: Story = {
  args: {
    tabs: [
      { value: 'Záložka 1', id: 'tab1' },
      { value: 'Záložka 2', id: 'tab2' },
      { value: 'Záložka 3', id: 'tab3' },
    ],
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { value: 'Záložka 1', id: 'tab1' },
      { value: 'Záložka 2', id: 'tab2', disabled: true },
      { value: 'Záložka 3', id: 'tab3' },
    ],
  },
};
