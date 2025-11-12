import type { Meta, StoryObj } from '@storybook/nextjs';

import { Divider, DividerProps } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      description: 'The orientation of the divider. Can be "horizontal" or "vertical".',
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      description: 'The style variant of the divider.',
      control: { type: 'radio' },
      options: ['primary', 'subtle', 'dotted', 'prominent'],
    },
    className: {
      description: 'Additional class names to apply to the divider.',
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

const Template = (args: DividerProps) => (
  <div>
    {args.orientation === 'horizontal' && (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100px' }}
      >
        <span style={{ marginBottom: '8px' }}>Top content</span>
        <Divider {...args} />
        <span style={{ marginTop: '8px' }}>Bottom content</span>
      </div>
    )}

    {args.orientation === 'vertical' && (
      <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
        <span>Left content</span>
        <Divider {...args} />
        <span>Right content</span>
      </div>
    )}
  </div>
);

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'primary',
  },
  render: Template,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    variant: 'primary',
  },
  render: Template,
};

export const Subtle: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'subtle',
  },
  render: Template,
};

export const Dotted: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'dotted',
  },
  render: Template,
};

export const Prominent: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'prominent',
  },
  render: Template,
};
