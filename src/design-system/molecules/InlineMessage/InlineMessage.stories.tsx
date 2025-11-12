import type { Meta, StoryObj } from '@storybook/nextjs';

import CrossMark from '@/core/assets/icons/icon-error.svg';
import SuccessMark from '@/core/assets/icons/icon-success.svg';
import ArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';

import { InlineMessage } from './InlineMessage';

const meta: Meta<typeof InlineMessage> = {
  title: 'Molecules/InlineMessage',
  component: InlineMessage,
  argTypes: {
    message: { control: 'text', description: 'The message to be displayed' },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'info', 'warning'],
      description: 'Visual variant of the message',
    },
    icon: { description: 'Icon to be displayed alongside the message', control: false },
    buttonText: { control: 'text', description: 'Text for the button' },
    centeredText: { control: 'boolean', description: 'Center the InlineMessage Text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof InlineMessage>;

export const Default: Story = {
  args: {
    message: 'This is a default inline message.',
    icon: <CrossMark className="icon_black-700" />,
    variant: 'default',
  },
};

export const LimitAchived: Story = {
  args: {
    message:
      'Byl dosažen limit doplatků hrazených pacientem 2 000 Kč. Odteď jsou výdeje hrazeny pouze z pojištění.',
    icon: <SuccessMark className="icon_red-600" />,
    variant: 'error',
  },
};

export const withButton: Story = {
  args: {
    message:
      'Byl dosažen limit doplatků hrazených pacientem 2 000 Kč. Odteď jsou výdeje hrazeny pouze z pojištění.',
    icon: <SuccessMark className="icon_red-600" />,
    variant: 'error',
    buttonText: 'Next',
    onClick: () => {},
  },
};
export const LimitDown: Story = {
  args: {
    message: 'Limit doplatků hrazených pacientem byl ponížen na 2 000 Kč.',
    icon: <ArrowDown className="icon_blue-700" />,
    variant: 'info',
  },
};
