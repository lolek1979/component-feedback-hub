import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { FileUpload, UploadProps } from './FileUpload';

import '@testing-library/jest-dom';

const setup = (props: Partial<UploadProps> = {}) => {
  const defaultProps: UploadProps = {
    onFilesSelected: jest.fn(),
    icon: <span>Icon</span>,
    dropLabel: 'Drag and drop your files here',
    limitLabel: 'Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT, .XML',
    width: '100%',
    height: '200px',
    setIsVisible: () => {},
    setIsAbleToContinue: () => {},
    isVisible: true,
    ...props,
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FeedBackHubProvider>
        <FileUpload {...defaultProps} />
      </FeedBackHubProvider>
    </NextIntlClientProvider>,
  );
};

describe('FileUpload component', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    // eslint-disable-next-line testing-library/no-node-access
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('renders with correct labels', () => {
    setup();
    expect(screen.getByText('Drag and drop your files here')).toBeInTheDocument();
    expect(
      screen.getByText('Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT, .XML'),
    ).toBeInTheDocument();
  });

  it('calls onFilesSelected when files are selected via input', () => {
    const onFilesSelected = jest.fn();
    setup({ onFilesSelected });

    const fileInput = screen.getByLabelText('Browse files');
    const file = new File(['dummy content'], 'example.xml', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onFilesSelected).toHaveBeenCalledWith([file], {
      'example.xml': 'StructureFile',
    });
  });

  it('closes the modal when the close button is clicked', () => {
    const setIsVisible = jest.fn();
    setup({ setIsVisible, isModal: true });

    const uploadButton = screen.getByText('Upload File');
    fireEvent.click(uploadButton);

    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);

    expect(setIsVisible).toHaveBeenCalledWith(false);
  });
});
