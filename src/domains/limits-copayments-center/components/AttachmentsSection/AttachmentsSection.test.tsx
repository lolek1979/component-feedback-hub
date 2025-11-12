import React from 'react';
import { render, screen } from '@testing-library/react';

import { AttachmentsSection } from './AttachmentsSection';

jest.mock('../AttachmentsUpload', () => ({
  AttachmentsUpload: () => <div data-testid="attachments-upload">AttachmentsUpload</div>,
}));

describe('AttachmentsSection', () => {
  const mockOnFilesChange = jest.fn();

  it('renders without title and description', () => {
    render(<AttachmentsSection onFilesChange={mockOnFilesChange} />);
    expect(screen.getByTestId('attachments-upload')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<AttachmentsSection title="Attachments" onFilesChange={mockOnFilesChange} />);
    expect(screen.getByText('Attachments')).toBeInTheDocument();
  });

  it('renders with title and badge showing zero files', () => {
    render(<AttachmentsSection title="Attachments" onFilesChange={mockOnFilesChange} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with optional text', () => {
    render(
      <AttachmentsSection
        title="Attachments"
        optionalText="Optional"
        onFilesChange={mockOnFilesChange}
      />,
    );
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <AttachmentsSection
        title="Attachments"
        description="Upload your files"
        onFilesChange={mockOnFilesChange}
      />,
    );
    expect(screen.getByText('Upload your files')).toBeInTheDocument();
  });

  it('renders AttachmentsUpload component', () => {
    render(<AttachmentsSection onFilesChange={mockOnFilesChange} />);
    expect(screen.getByTestId('attachments-upload')).toBeInTheDocument();
  });
});
