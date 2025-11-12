import { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { Button } from '@/design-system/atoms';

import { Popover, PopoverProps } from './Popover';
import styles from './Popover.module.css';

const meta: Meta<typeof Popover> = {
  title: 'Molecules/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: 'A popover component that displays content in a floating container.',
      },
    },
  },
  argTypes: {
    content: { description: 'Function that returns the content of the popover' },
    trigger: { description: 'ReactNode that triggers the popover' },
    title: { control: 'text', description: 'Title of the popover' },
    isVisible: {
      control: 'boolean',
      description: 'Boolean to control the visibility of the popover',
    },
    setIsVisible: {
      action: 'setIsVisible',
      description: 'Function to set the visibility of the popover',
    },
    placement: { control: 'text', description: 'Placement of the popover' },
  },
  decorators: [
    (Story) => (
      <FeedBackHubProvider>
        <Story />
      </FeedBackHubProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Popover>;

const RenderPopover = <T extends object>(args: PopoverProps<T>) => {
  const [isVisible, setIsVisible] = useState(args.isVisible);

  useEffect(() => {
    setIsVisible(args.isVisible);
  }, [args.isVisible]);

  return (
    <div style={{ height: '200px' }}>
      <Popover
        {...args}
        isVisible={isVisible}
        setIsVisible={(value: boolean) => {
          setIsVisible(value);
          args.setIsVisible && args.setIsVisible(value);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    content: () => <div className={styles.content}>Popover Content</div>,
    trigger: <Button id="button-popover-click">Click me</Button>,
    title: 'Popover Title',
    placement: 'tooltip-bottom',
  },
  render: RenderPopover,
};
