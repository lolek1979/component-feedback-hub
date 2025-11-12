import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Tooltip, TooltipProps } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const wrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const Template: Story = {
  args: {},
  argTypes: {
    children: { description: 'The content of the tooltip' },
    placement: {
      description:
        'The element passed through children will be displayed on the page and will trigger the tooltip to appear.',
    },
  },
  render: (args: TooltipProps) => (
    <div style={wrapperStyles}>
      <Tooltip {...args}>
        <p style={{ padding: '5px' }}>Hover me</p>
      </Tooltip>
    </div>
  ),
};

export const Top = { ...Template } as Story;
Top.args = {
  content: 'Top Tooltip',
  placement: 'tooltipTop',
  id: 'tooltip-top-story',
};

export const Bottom = { ...Template } as Story;
Bottom.args = {
  content: 'Tooltip at the bottom',
  placement: 'tooltipBottom',
  id: 'tooltip-bottom-story',
};

export const Left = { ...Template } as Story;
Left.args = {
  content: 'Tooltip at the left',
  placement: 'tooltipLeft',
  id: 'tooltip-left-story',
};

export const Right = { ...Template } as Story;
Right.args = {
  content: 'Tooltip at the right',
  placement: 'tooltipRight',
  id: 'tooltip-right-story',
};

export const TopRight = { ...Template } as Story;
TopRight.args = {
  content: 'Tooltip at the top right',
  placement: 'tooltipTopEnd',
  id: 'tooltip-top-end-story',
};
