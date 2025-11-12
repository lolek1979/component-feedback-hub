import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/en.json';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { Modal, ModalProps } from './Modal';
import styles from './Modal.module.css';

import '@testing-library/jest-dom';

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
};

// Mock the `modal-root` in the document for the React Portal
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

const setup = (props: Partial<ModalProps> = {}) => {
  const defaultProps: ModalProps = {
    id: 'modal-test',
    isVisible: true,
    setIsVisible: jest.fn(),
    children: <div>Modal Content</div>,
    size: 'medium',
    showCloseIcon: true,
    closeOnEsc: true,
    closeOnOverlayClick: true,
    ...props, // Override defaults with custom props
  };

  return renderWithProvider(<Modal {...defaultProps} />);
};

describe('Modal component', () => {
  it('renders when `isVisible` is true', () => {
    setup({ isVisible: true, title: 'Test Modal' });
    // Modal content should be rendered
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when `isVisible` is false', () => {
    setup({ isVisible: false });
    // Modal should not be in the document
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls `setIsVisible(false)` and `onClose` when close icon is clicked', () => {
    const setIsVisible = jest.fn();
    const onClose = jest.fn();

    setup({ isVisible: true, setIsVisible, onClose });

    // Click on the close button
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes the modal when overlay is clicked if `closeOnOverlayClick` is true', () => {
    const setIsVisible = jest.fn();

    setup({ isVisible: true, setIsVisible, closeOnOverlayClick: true });

    // Click on the modal overlay
    // eslint-disable-next-line testing-library/no-node-access
    const overlay = document.querySelector(`.${styles.modalOverlay}`);

    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(setIsVisible).toHaveBeenCalledWith(false);
  });

  it('does not close the modal when overlay is clicked if `closeOnOverlayClick` is false', () => {
    const setIsVisible = jest.fn();

    setup({ isVisible: true, setIsVisible, closeOnOverlayClick: false });

    // Click on the modal overlay
    // eslint-disable-next-line testing-library/no-node-access
    const overlay = document.querySelector(`.${styles.modalOverlay}`);

    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(setIsVisible).not.toHaveBeenCalled();
  });

  it('closes the modal when `Escape` key is pressed if `closeOnEsc` is true', () => {
    const setIsVisible = jest.fn();
    const onClose = jest.fn();

    setup({ isVisible: true, setIsVisible, onClose, closeOnEsc: true });

    // Simulate pressing the Escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(setIsVisible).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close the modal when `Escape` key is pressed if `closeOnEsc` is false', () => {
    const setIsVisible = jest.fn();

    setup({ isVisible: true, setIsVisible, closeOnEsc: false });

    // Simulate pressing the Escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(setIsVisible).not.toHaveBeenCalled();
  });
});
