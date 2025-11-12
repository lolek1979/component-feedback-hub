import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { ApprovalModal } from './ApprovalModal';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <UnsavedChangesProvider>{component}</UnsavedChangesProvider>
    </NextIntlClientProvider>,
  );
describe('ApprovalModal', () => {
  const defaultProps = {
    isVisible: true,
    setIsVisible: jest.fn(),
    onClick: jest.fn(),
    onChangeInputCurrency: jest.fn(),
    onChangeInput: jest.fn(),
    onChangeExternal: jest.fn(),
    onChangeInternal: jest.fn(),
    demandedAmount: '1000',
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

  it('renders modal with correct title and demanded amount', () => {
    renderWithIntl(<ApprovalModal {...defaultProps} />);
    expect(screen.getByText('Schválení reklamace')).toBeInTheDocument();
    expect(screen.getByText('1000 Kč')).toBeInTheDocument();
  });

  it('calls setIsVisible(false) when cancel button is clicked', () => {
    renderWithIntl(<ApprovalModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Zrušit'));
    expect(defaultProps.setIsVisible).toHaveBeenCalledWith(false);
  });

  it('calls onClick when approve button is clicked', () => {
    renderWithIntl(<ApprovalModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Schválit'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
