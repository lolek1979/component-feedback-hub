/**
 * @fileoverview Toast notification component based on the Sonner library
 * @module Toast
 */

'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { toast, Toaster, useSonner } from 'sonner';

import ErrorIcon from '@/core/assets/icons/block.svg';
import SuccessIcon from '@/core/assets/icons/icon-success.svg';
import InfoIcon from '@/core/assets/icons/info.svg';
import WarningIcon from '@/core/assets/icons/info.svg';

import styles from './Toast.module.css';

/**
 * Toast notification component that provides a centralized toast notification system
 * for the application. This component uses the Sonner library for toast functionality
 * and provides consistent styling and behavior across all toast notifications.
 *
 * @example
 * ```tsx
 * // In your layout or app component
 * import { Toast } from '@/components/molecules/Toast';
 *
 * function Layout() {
 *   return (
 *     <div>
 *       {children}
 *       <Toast />
 *     </div>
 *   );
 * }
 *
 * // In any component where you want to show toast
 * import { toast } from '@/components/molecules/Toast/Toast';
 *
 * function MyComponent() {
 *   const handleSuccess = () => {
 *     toast.success('Operation completed successfully!', {
 *       id: 'success-toast-1'
 *     });
 *   };
 *
 *   const handleError = () => {
 *     toast.error('Something went wrong!', {
 *       id: 'error-toast-1'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSuccess}>Show Success</button>
 *       <button onClick={handleError}>Show Error</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {JSX.Element} The Toast component that renders the Sonner Toaster
 *
 * @remarks
 * This component should be placed once in your application layout (typically in the root layout).
 * It provides:
 * - Four toast types: success, error, info, warning
 * - Consistent positioning (top-right)
 * - Internationalized close button labels
 * - Custom styling via CSS modules
 * - 4-second duration by default
 * - Custom icons for each toast type
 *
 * @since 1.0.0
 * @author VZP Frontend Team
 */
const Toast = () => {
  /** Translation function for internationalized text */
  const t = useTranslations('common');

  /** Get current toasts to track their IDs */
  const { toasts } = useSonner() || { toasts: [] };

  /**
   * Effect to add custom IDs to toast DOM elements.
   * Since Sonner doesn't natively support HTML id attributes,
   * we use a MutationObserver to watch for new toast elements
   * and add the corresponding id attribute from the toast data.
   */
  useEffect(() => {
    const addIdsToToasts = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]');

      toastElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;

        if (htmlElement.id) return;

        const index = parseInt(htmlElement.getAttribute('data-index') || '0', 10);
        const correspondingToast = toasts[index];

        if (correspondingToast && correspondingToast.id) {
          htmlElement.id = String(correspondingToast.id);
        }
      });
    };

    let idTimeout: ReturnType<typeof setTimeout> | null = null;
    const scheduleUpdateIds = () => {
      if (idTimeout) clearTimeout(idTimeout);
      idTimeout = setTimeout(addIdsToToasts, 10);
    };

    addIdsToToasts();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                element.hasAttribute('data-sonner-toast') ||
                element.querySelector('[data-sonner-toast]')
              ) {
                scheduleUpdateIds();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (idTimeout) clearTimeout(idTimeout);
      observer.disconnect();
    };
  }, [toasts]);

  return (
    <>
      <Toaster
        position="top-right"
        duration={4000}
        offset={{ top: '80px', right: '16px', left: '16px' }}
        gap={8}
        style={{ width: '620px' }}
        icons={{
          success: (
            <SuccessIcon id="icon-toast-success" className={clsx(styles.icon, styles.success)} />
          ),
          error: <ErrorIcon id="icon-toast-error" className={clsx(styles.icon, styles.error)} />,
          info: <InfoIcon id="icon-toast-info" className={clsx(styles.icon, styles.info)} />,
          warning: (
            <WarningIcon id="icon-toast-warning" className={clsx(styles.icon, styles.warning)} />
          ),
        }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: styles.toast,
            closeButton: styles.closeButton,
            actionButton: styles.actionButton,
            success: styles.successToast,
            error: styles.errorToast,
            info: styles.infoToast,
            warning: styles.warningToast,
            content: styles.toastContent,
          },
          closeButtonAriaLabel: t('closeToast'),
          closeButton: true,
        }}
        expand
      />
    </>
  );
};

/**
 * Re-exported toast function from the Sonner library for creating toast notifications.
 *
 * @example
 * ```tsx
 * import { toast } from '@/components/molecules/Toast/Toast';
 *
 * // Success toast
 * toast.success('Data saved successfully!', {
 *   id: 'save-success'
 * });
 *
 * // Error toast
 * toast.error('Failed to save data', {
 *   id: 'save-error'
 * });
 *
 * // Info toast
 * toast.info('Please check your email', {
 *   id: 'email-info'
 * });
 *
 * // Warning toast
 * toast.warning('Your session will expire soon', {
 *   id: 'session-warning'
 * });
 *
 * // Dismiss all toasts
 * toast.dismiss();
 * ```
 *
 * @namespace toast
 * @property {Function} success - Shows a success toast notification
 * @property {Function} error - Shows an error toast notification
 * @property {Function} info - Shows an info toast notification
 * @property {Function} warning - Shows a warning toast notification
 * @property {Function} dismiss - Dismisses toast notifications
 */
export { Toast, toast };
