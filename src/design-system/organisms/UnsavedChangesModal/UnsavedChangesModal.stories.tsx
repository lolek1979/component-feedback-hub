import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import enMessages from '@/core/messages/en.json';
import { UnsavedChangesProvider, useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { Button } from '@/design-system/atoms';

import UnsavedChangesModal from './UnsavedChangesModal';

const queryClient = new QueryClient();
const RenderUnsavedChangesModal = () => {
  const { updateUnsavedChanges } = useUnsavedChanges();
  const handleClick = () => {
    updateUnsavedChanges(true);
  };

  return (
    <>
      <Button id="button-unsaved-simulate" onClick={handleClick}>
        Simulate edit
      </Button>
      <Link href={'/test'}> Simulate exit</Link>
      <UnsavedChangesModal />
    </>
  );
};

const meta: Meta<typeof UnsavedChangesModal> = {
  title: 'Organisms/UnsavedChangesModal',
  component: RenderUnsavedChangesModal,
};

export default meta;

type Story = StoryObj<typeof UnsavedChangesModal>;

export const Default: Story = {
  render: () => (
    <>
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <QueryClientProvider client={queryClient}>
          <UnsavedChangesProvider>
            <div
              id="modal-root"
              style={{
                height: '400px',
              }}
            />
            <RenderUnsavedChangesModal />
          </UnsavedChangesProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </>
  ),
};
