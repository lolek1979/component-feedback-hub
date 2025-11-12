import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/en.json';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { AttachmentsUpload } from './AttachmentsUpload';

import '@testing-library/jest-dom';

const setup = (props: Partial<React.ComponentProps<typeof AttachmentsUpload>> = {}) => {
  const defaultProps = {
    onFilesChange: jest.fn(),
    maxFiles: 5,
    maxFileSize: 10,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png', '.gif'],
    ...props,
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AttachmentsUpload {...defaultProps} />
    </NextIntlClientProvider>,
  );
};

describe('AttachmentsUpload', () => {
  it('renders upload button', () => {
    setup();
    expect(screen.getByText('Upload file')).toBeInTheDocument();
  });

  it('calls onFilesChange when valid file is selected', () => {
    const onFilesChange = jest.fn();
    setup({ onFilesChange });

    const input = screen.getByLabelText('Browse files');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesChange).toHaveBeenCalledWith([file]);
  });

  it('displays warning for unsupported file type', () => {
    setup();

    const input = screen.getByLabelText('Browse files');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Unsupported file format.')).toBeInTheDocument();
  });

  it('displays warning for file exceeding size limit', () => {
    setup({ maxFileSize: 1 });

    const input = screen.getByLabelText('Browse files');
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(screen.getByText('Maximum file size is 1 MB.')).toBeInTheDocument();
  });

  it('displays file name after upload', () => {
    setup();

    const input = screen.getByLabelText('Browse files');
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('removes file when delete button is clicked', () => {
    const onFilesChange = jest.fn();
    setup({ onFilesChange });

    const input = screen.getByLabelText('Browse files');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: 'Remove file' });
    fireEvent.click(removeButton);

    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('hides upload box when max files reached', () => {
    setup({ maxFiles: 1 });

    const input = screen.getByLabelText('Browse files');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.queryByText('Upload file')).not.toBeInTheDocument();
  });

  it('displays warning when trying to upload more files than max limit at once', () => {
    setup({ maxFiles: 2 });

    const input = screen.getByLabelText('Browse files');
    const file1 = new File(['content'], 'test1.pdf', { type: 'application/pdf' });
    const file2 = new File(['content'], 'test2.pdf', { type: 'application/pdf' });
    const file3 = new File(['content'], 'test3.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file1, file2, file3] } });

    expect(screen.getByText('You can attach a maximum of 2 files.')).toBeInTheDocument();
  });
});
