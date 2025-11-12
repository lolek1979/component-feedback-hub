import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@/design-system/atoms';

import { Modal, ModalProps } from './Modal';

const messages = {
  common: {
    close: 'Close',
  },
};

const meta: Meta<typeof Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component:
          'A modal component that can be used to display content in a layer above the main content.',
      },
    },
  },
  argTypes: {
    onClose: { action: 'closed', description: 'Callback function to handle close event.' },
    setIsVisible: {
      action: 'setIsVisible',
      description: 'Function to set the visibility of the modal.',
    },
    isVisible: {
      control: 'boolean',
      description: 'Boolean to control the visibility of the modal.',
    },
    size: {
      options: ['small', 'medium', 'large', 'xlarge'],
      control: { type: 'radio' },
      description: 'Size of the modal.',
    },
    title: {
      control: 'text',
      description: 'Title of the modal.',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle of the modal.',
    },
    children: {
      control: false,
      description: 'Content to be displayed inside the modal.',
    },
    showCloseIcon: {
      control: 'boolean',
      description: 'Boolean to control the visibility of the close icon.',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Boolean to control if the modal should close on pressing the Escape key.',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Boolean to control if the modal should close on clicking the overlay.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const RenderModal = (args: ModalProps) => {
  const [isVisible, setIsVisible] = useState(args.isVisible);

  // Sync the local state with the `isVisible` control
  useEffect(() => {
    setIsVisible(args.isVisible);
  }, [args.isVisible]);

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <div
        id="modal-root"
        style={{
          height: '400px',
        }}
      />
      <Button id="button-modal-open" onClick={() => setIsVisible(true)}>
        Open modal
      </Button>
      <Modal
        {...args}
        id="story-modal"
        isVisible={isVisible}
        setIsVisible={(value: boolean) => {
          setIsVisible(value); // Update the local state
          args.setIsVisible(value);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <Button id="button-modal-cancel" variant="tertiary">
            Cancel
          </Button>
          <Button id="button-modal-cancel-ghost" variant="secondary">
            Zrušit
          </Button>
          <Button id="button-modal-accept">Potvrdit</Button>
        </div>
      </Modal>
    </NextIntlClientProvider>
  );
};

export const Default: Story = {
  args: {
    isVisible: true, // Default state is visible
    size: 'small',
    showCloseIcon: true,
    closeOnEsc: true,
    closeOnOverlayClick: true,
    title: 'Modal dialog',
    subtitle: 'Lorem ipsum',
    description:
      'Beyond the reach of sight and sound, where silence weaves through the void, lies the realm of forgotten stars. They shimmer faintly, unseen and unheard, casting echoes of their ancient songs into the endless night.',
  },
  argTypes: {
    onClose: { action: 'closed' },
    setIsVisible: { action: 'setIsVisible' },
    isVisible: { control: 'boolean' },
    size: {
      options: ['small', 'medium', 'large', 'xlarge'],
      control: { type: 'radio' },
    },
    title: {
      control: 'text',
    },
    children: {
      control: false,
    },
  },
  render: RenderModal,
};
