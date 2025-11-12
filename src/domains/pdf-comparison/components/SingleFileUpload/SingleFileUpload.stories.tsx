import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/react';

import IFile from '@/core/assets/icons/icon-file.svg';
import enMessages from '@/core/messages/en.json';

import { SingleFileUpload } from './SingleFileUpload';

const meta: Meta<typeof SingleFileUpload> = {
  title: 'Molecules/SingleFileUpload',
  component: SingleFileUpload,
  parameters: {
    docs: {
      description: {
        component:
          'A single file upload component that allows uploading PDF files for comparison. The component supports drag and drop functionality and displays file information after upload.',
      },
    },
  },
  argTypes: {
    onFileSelected: {
      action: 'fileSelected',
      description: 'Callback function when a file is selected.',
    },
    dropLabel: {
      control: 'text',
      description: 'Label for the drop area.',
    },
    width: {
      control: 'text',
      description: 'Width of the drop area.',
    },
    height: {
      control: 'text',
      description: 'Height of the drop area.',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the component.',
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SingleFileUpload>;

export const Default: Story = {
  args: {
    dropLabel: 'Přetáhněte sem soubor nebo klikněte pro výběr',
    width: '100%',
    height: '160px',
    id: 'upload-pdf-comparison-left',
  },
};

export const WithCustomSize: Story = {
  args: {
    dropLabel: 'Přetáhněte sem soubor nebo klikněte pro výběr',
    width: '400px',
    height: '200px',
    id: 'upload-pdf-comparison-custom',
  },
};

export const WithIcon: Story = {
  args: {
    dropLabel: 'Přetáhněte sem soubor nebo klikněte pro výběr',
    width: '100%',
    height: '160px',
    id: 'upload-pdf-comparison-with-icon',
    icon: <IFile width={24} height={24} />,
  },
};
