import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Spinner } from './Spinner';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    fullScreen: {
      control: 'boolean',
      description: 'Whether the spinner should be full screen.',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
};

export const Default: Story = {
  args: {
    fullScreen: false,
  },
};

export const FullScreen: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: '100vh',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
  args: {
    fullScreen: true,
  },
};
