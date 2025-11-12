import { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Button } from '@/design-system/atoms';

import { CSCFormData, CscFormModal } from './CscFormModal';

const meta: Meta<typeof CscFormModal> = {
  title: 'Organisms/CscFormModal',
  component: CscFormModal,
  parameters: {
    docs: {
      description: {
        component: 'A form modal component for creating or editing CSC entries.',
      },
    },
  },
  argTypes: {
    onSubmit: { action: 'onSubmit', description: 'Callback function to handle form submission.' },
    setIsVisible: {
      action: 'setIsVisible',
      description: 'Function to set the visibility of the modal.',
    },
    isVisible: {
      control: 'boolean',
      description: 'Boolean to control the visibility of the modal.',
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
interface CscFormModalProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onSubmit: (data: CSCFormData) => void;
}

type Story = StoryObj<typeof CscFormModal>;

const RenderCscFormModal = (args: CscFormModalProps) => {
  const [isVisible, setIsVisible] = useState(args.isVisible);

  useEffect(() => {
    setIsVisible(args.isVisible);
  }, [args.isVisible]);

  return (
    <>
      <div
        id="modal-root"
        style={{
          height: '800px',
        }}
      />
      <Button id="button-csc-form-open" onClick={() => setIsVisible(true)}>
        Open Form Modal
      </Button>
      <CscFormModal
        {...args}
        creationType="new"
        isVisible={isVisible}
        setIsVisible={(value: boolean) => {
          setIsVisible(value);
          args.setIsVisible(value);
        }}
      />
    </>
  );
};

export const Default: Story = {
  args: {
    isVisible: false,
  },
  render: RenderCscFormModal,
};
