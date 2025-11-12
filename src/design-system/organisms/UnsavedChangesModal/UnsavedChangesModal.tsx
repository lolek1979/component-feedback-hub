'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { Button, Text } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';

import styles from './UnsavedChangesModal.module.css';
/**
 * UnsavedChangesModal component for warning users about unsaved changes before navigation.
 *
 * Listens for navigation and page unload events, and displays a modal dialog
 * if there are unsaved changes. Allows users to stay on the page or leave and discard changes.
 *
 * @returns React component
 */
const UnsavedChangesModal = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const t = useTranslations('unsavedChangesModal');
  const { hasUnsavedChanges, updateUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle beforeunload event for page refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';

        return '';
      }
    };

    const handleNavigation = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor &&
        anchor.getAttribute('href') &&
        !anchor.getAttribute('href')?.startsWith('#') &&
        !anchor.getAttribute('target')
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();

        setPendingUrl(anchor.href);
        setIsModalVisible(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleNavigation, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleNavigation, true);
    };
  }, [hasUnsavedChanges]);

  const handleStay = () => {
    setIsModalVisible(false);
    setPendingUrl(null);
  };

  const handleLeave = () => {
    queryClient.clear();
    updateUnsavedChanges(false);
    setIsModalVisible(false);
    if (pendingUrl) {
      const isExternalLink =
        !pendingUrl.startsWith('/') && !pendingUrl.includes(window.location.host);
      if (isExternalLink) {
        window.location.href = pendingUrl;
      } else {
        const url = pendingUrl.includes(window.location.host)
          ? pendingUrl.split(window.location.host)[1]
          : pendingUrl;
        router.push(url);
      }
    }
  };

  return (
    <Modal
      id="unsaved-changes-modal"
      size="medium"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      setIsVisible={setIsModalVisible}
      isVisible={isModalVisible}
      title={t('title')}
    >
      <Text>{t('body')}</Text>
      <div className={styles.buttonGroup}>
        <Button id="button-unsaved-changes-modal-stay" onClick={handleStay} variant="secondary">
          {t('cancel')}
        </Button>
        <Button id="button-unsaved-changes-modal-leave" onClick={handleLeave} variant="primary">
          {t('leave')}
        </Button>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;
