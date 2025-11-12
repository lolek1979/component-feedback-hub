'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import IClose from '@/core/assets/icons/icon-close.svg';
import { Text } from '@/design-system/atoms';

import styles from './Modal.module.css';

/**
 * Props for the Modal component.
 *
 * @property onClose - Optional callback when the modal is closed.
 * @property children - Content to render inside the modal.
 * @property isVisible - Controls modal visibility.
 * @property setIsVisible - Function to set modal visibility.
 * @property size - Modal size ('small', 'medium', 'large', 'xlarge').
 * @property showCloseIcon - Whether to show the close icon.
 * @property title - Modal title (string or React node).
 * @property description - Optional description text.
 * @property subtitle - Optional subtitle text.
 * @property closeOnOverlayClick - Whether clicking the overlay closes the modal.
 * @property closeOnEsc - Whether pressing Escape closes the modal.
 * @property id - Unique identifier for the modal.
 */
export interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCloseIcon?: boolean;
  title?: string | React.ReactNode;
  description?: string;
  subtitle?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  id: string;
}

/**
 * Modal component for displaying content in a dialog overlay.
 *
 * Handles focus trapping, accessibility, and portal rendering.
 *
 * @param props ModalProps
 * @returns React component
 */
export const Modal = ({
  onClose,
  children,
  title,
  description,
  subtitle,
  size,
  isVisible = false,
  setIsVisible,
  showCloseIcon = true,
  closeOnEsc = false,
  closeOnOverlayClick = false,
  id,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('common');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      setIsVisible(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    if ((e.target as HTMLElement).className === styles.modalOverlay) {
      onClose?.();
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (closeOnEsc) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
          setIsVisible(false);
        }
      };

      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [closeOnEsc, onClose, setIsVisible]);

  useEffect(() => {
    setIsMounted(true); // Indicate that the component has mounted on the client
  }, []);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isVisible]);

  const modalWrapperClasses = clsx(styles.modalWrapper, size && styles[size], 'primary-shadow');
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={closeOnOverlayClick ? handleOverlayClick : undefined}
      data-testid="modal"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-body"
      ref={modalRef}
      id={id + '-overlay'}
    >
      <div className={modalWrapperClasses} id={id + '-content-wrapper'}>
        <div className={`${styles.modal}`}>
          {title && (
            <Text variant="headline" tabIndex={0} className={styles.modalTitle} id={id + '-title'}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="subtitle"
              className={styles.modalSubtitle}
              id={id + '-subtitle'}
              regular
              color="secondary"
            >
              {subtitle}
            </Text>
          )}
          {description && (
            <Text
              variant="subtitle"
              className={styles.modalDescription}
              id={id + '-description'}
              regular
              color="primary"
            >
              {description}
            </Text>
          )}
          {showCloseIcon && (
            <button
              onClick={handleCloseClick}
              className={styles.close}
              title={t('close')}
              id={'button-' + id + '-close'}
            >
              <IClose
                id={'icon-' + id + '-close'}
                className={styles.closeIcon}
                width={14}
                height={14}
              />
            </button>
          )}

          <div className="modal-body" id={id + '-body'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isMounted || !isVisible) {
    // Render nothing on the server (or during hydration) until the component is mounted
    return null;
  }

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    return null; // Optional: Handle missing modal root gracefully
  }

  return ReactDOM.createPortal(modalContent, modalRoot);
};
