import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Meta, StoryObj } from '@storybook/nextjs';

import IDownload from '@/core/assets/icons/download.svg';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { Button } from '@/design-system/atoms';

import { FileUpload, UploadProps } from './FileUpload';

const messages = {
  Fileupload: {
    dragAndDrop: 'Drag and drop your files here',
    clickHere: 'Click here to select files',
    uploadFiles: 'Upload Files',
  },
};

const meta: Meta<typeof FileUpload> = {
  title: 'Molecules/FileUpload',
  component: FileUpload,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <FeedBackHubProvider>
          <Story />
        </FeedBackHubProvider>
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A file upload component that can be used to upload files.',
      },
    },
  },
  argTypes: {
    onFilesSelected: {
      action: 'filesSelected',
      description: 'Callback function when files are selected.',
    },
    setIsVisible: {
      action: 'setIsVisible',
      description: 'Function to set the visibility of the modal.',
    },
    setIsAbleToContinue: {
      action: 'setIsAbleToContinue',
      description: 'Function to set the ability to continue.',
    },
    isVisible: {
      control: 'boolean',
      description: 'Boolean to control the visibility of the modal.',
    },
    isModal: {
      control: 'boolean',
      description: 'Boolean to control the state in which the FileUpload is rendered.',
    },
    isUploaded: { control: 'boolean', description: 'Boolean to control if files are uploaded.' },
    icon: { control: 'object', description: 'Icon to be displayed on the upload button.' },
    dropLabel: { control: 'text', description: 'Label for the drop area.' },
    limitLabel: { control: 'text', description: 'Label for the file size limit.' },
    width: { control: 'text', description: 'Width of the drop area.' },
    height: { control: 'text', description: 'Height of the drop area.' },
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

const RenderFileUpload = (args: UploadProps) => {
  const [isVisible, setIsVisible] = useState(args.isVisible);

  useEffect(() => {
    setIsVisible(args.isVisible);
  }, [args.isVisible]);

  return (
    <>
      {args.isModal ? (
        <>
          <div id="modal-root" style={{ height: '400px' }}>
            <FileUpload
              {...args}
              isVisible={isVisible}
              setIsVisible={(value: boolean) => {
                setIsVisible(value);
                args.setIsVisible(value);
              }}
              icon={<IDownload />}
            />
          </div>
          <Button id="button-file-upload" onClick={() => setIsVisible(true)}>
            Open File Upload
          </Button>
        </>
      ) : (
        <>
          <FileUpload
            {...args}
            isVisible={isVisible}
            setIsVisible={(value: boolean) => {
              setIsVisible(value);
              args.setIsVisible(value);
            }}
            icon={<IDownload />}
          />
        </>
      )}
    </>
  );
};

export const Default: Story = {
  args: {
    isModal: false,
    isVisible: false,
    icon: <span>Icon</span>,
    dropLabel: 'Drag and drop your files here',
    limitLabel: 'Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT, .XLSX',
    width: '100%',
    height: 'auto',
    isUploaded: false,
  },
  render: RenderFileUpload,
};

export const Modal: Story = {
  args: {
    isModal: true,
    isVisible: true,
    icon: <span>Icon</span>,
    dropLabel: 'Drag and drop your files here',
    limitLabel: 'Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT, .XLSX',
    width: '100%',
    height: 'auto',
    isUploaded: false,
  },
  render: RenderFileUpload,
};
