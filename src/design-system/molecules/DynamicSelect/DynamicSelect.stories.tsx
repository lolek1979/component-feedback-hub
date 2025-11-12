import type { Meta, StoryObj } from '@storybook/react';

import { DynamicSelect } from './DynamicSelect';

const meta: Meta<typeof DynamicSelect> = {
  title: 'Molecules/DynamicSelect',
  component: DynamicSelect,
};

export default meta;

type Story = StoryObj<typeof DynamicSelect>;

export const Default: Story = {};
