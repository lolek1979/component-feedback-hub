// RejectionModal.test.tsx
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { RejectionModal } from './RejectionModal';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <UnsavedChangesProvider> {component}</UnsavedChangesProvider>
    </NextIntlClientProvider>,
  );

describe('RejectionModal', () => {
  const mockSetIsVisible = jest.fn();
  const mockOnClick = jest.fn();
  const mockOnChangeInput = jest.fn();
  const mockOnChangeExternal = jest.fn();
  const mockOnChangeInternal = jest.fn();

  const defaultProps = {
    isVisible: true,
    setIsVisible: mockSetIsVisible,
    onClick: mockOnClick,
    onChangeInput: mockOnChangeInput,
    onChangeExternal: mockOnChangeExternal,
    onChangeInternal: mockOnChangeInternal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('renders modal with correct fields and buttons', () => {
    renderWithIntl(<RejectionModal {...defaultProps} />);

    expect(screen.getByText('Zamítnutí reklamace')).toBeInTheDocument();
    expect(screen.getByText('Číslo jednací')).toBeInTheDocument();
    expect(screen.getByText('Externí komentář')).toBeInTheDocument();
    expect(screen.getByText('Interní komentář')).toBeInTheDocument();
    expect(screen.getByText('Zrušit')).toBeInTheDocument();
    expect(screen.getByText('Zamítnout')).toBeInTheDocument();
  });

  it('calls setIsVisible(false) when cancel button is clicked', () => {
    renderWithIntl(<RejectionModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Zrušit'));
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
  });

  it('calls onClick when reject button is clicked', () => {
    renderWithIntl(<RejectionModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Zamítnout'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('calls input and textarea change handlers', () => {
    renderWithIntl(<RejectionModal {...defaultProps} />);

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '123' },
    });
    expect(mockOnChangeInput).toHaveBeenCalled();

    const textareas = screen.getAllByRole('textbox');
    fireEvent.change(textareas[1], { target: { value: 'external comment' } });
    expect(mockOnChangeExternal).toHaveBeenCalled();

    fireEvent.change(textareas[2], { target: { value: 'internal comment' } });
    expect(mockOnChangeInternal).toHaveBeenCalled();
  });
});
