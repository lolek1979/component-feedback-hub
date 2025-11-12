'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAccount, useMsal } from '@azure/msal-react';
import clsx from 'clsx';

import useUserPhoto from '@/core/api/query/useUserPhoto';
import { clearLocalStorage } from '@/core/auth/localStorage';
import { logoutUser } from '@/core/auth/msalConfig';
import { getInitials } from '@/core/auth/utils';
import { useFeedBackHub } from '@/core/providers/FeedBackHubProvider';
import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { useUserStore } from '@/core/stores/userStore';
import { Button, Text } from '@/design-system/atoms';

import styles from './UserBubble.module.css';

import { Modal } from '@/design-system';

/**
 * Props for the UserBubble component.
 *
 * @property className - Optional additional CSS class.
 * @property isOpen - Whether the user bubble menu is open.
 * @property setIsOpen - Callback to set the open state.
 */
export interface UserBubbleProps {
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

/**
 * UserBubble component for displaying user info, avatar, and user menu.
 *
 * Renders user name, email, dark mode toggle, and sign out button.
 * Handles unsaved changes warning before sign out.
 *
 * @param props UserBubbleProps
 * @returns React component
 */
export const UserBubble = ({ className = '', isOpen = false, setIsOpen }: UserBubbleProps) => {
  const t = useTranslations('Header');
  const tCommon = useTranslations('common');
  const { hasUnsavedChanges } = useUnsavedChanges();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(isOpen);
  const [isVisible, setIsVisible] = useState<boolean>(hasUnsavedChanges);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const { data: photo } = useUserPhoto();
  const { accounts, instance: msalInstance } = useMsal();
  const { isFeedBackHubOpen } = useFeedBackHub();
  const account = useAccount(accounts[0] || {});
  const userBubbleClassName = clsx(styles.userBubble, className);

  const { given_name, family_name, name } = account?.idTokenClaims || {};

  const fullName = given_name && family_name ? `${given_name} ${family_name}` : name;

  useEffect(() => {
    setIsMenuOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isFeedBackHubOpen &&
        userBubbleRef.current &&
        !userBubbleRef.current.contains(event.target as Node) &&
        !isVisible
      ) {
        setIsMenuOpen(false);
        if (setIsOpen) setIsOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFeedBackHubOpen, isMenuOpen, isVisible, setIsOpen]);

  const handleSignOut = () => {
    logoutUser(msalInstance);
    clearLocalStorage();
    useUserStore.getState().clearAccount();
    setIsMenuOpen(false);
    setIsVisible(false);
  };

  if (!account?.idTokenClaims || !isMenuOpen) return null;

  return (
    <div
      className={userBubbleClassName}
      ref={userBubbleRef}
      role="dialog"
      aria-label={tCommon('userMenu')}
    >
      <div className={styles.userBubbleRow}>
        {photo ? (
          <Image
            src={photo}
            alt={tCommon('userPhoto')}
            className={styles.profileIcon}
            width={36}
            height={36}
            aria-label={tCommon('userPhoto')}
          />
        ) : (
          <div className={styles.profileIcon} aria-hidden="true">
            {getInitials(fullName)}
          </div>
        )}
        <div className={styles.userInfo}>
          <Text variant="subtitle" regular className={styles.text}>
            {fullName}
          </Text>
          <Text variant="caption" regular className={styles.email}>
            {account?.idTokenClaims?.email as ReactNode}
          </Text>
        </div>
      </div>
      {/* <div className={styles.userBubbleRow}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Text variant="body" className={styles.text}>
              Položka menu
            </Text>
          </li>
          <li className={styles.menuItem}>
            <Text variant="body" className={styles.text}>
              Položka menu
            </Text>
          </li>
          <li className={styles.menuItem}>
            <Text variant="body" className={styles.text}>
              Položka menu
            </Text>
          </li>
        </ul>
      </div> */}
      {/*  <div className={`${styles.userBubbleRow} ${styles.settingsRow}`}>
        <DarkmodeToggle />
      </div> */}

      <div className={styles.userBubbleRow}>
        <Button
          id="button-user-bubble-signout"
          variant="unstyled"
          className={styles.logoutBtn}
          onClick={hasUnsavedChanges ? () => setIsVisible(true) : handleSignOut}
          ariaLabel="Sign out"
        >
          <Text variant="subtitle" regular className={styles.text}>
            {t('signOut')}
          </Text>
        </Button>
      </div>

      <Modal
        id="userBBubble-changes-modal"
        size="medium"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        title={t('titleModal')}
      >
        <Text variant="body" regular>
          {t('body')}
        </Text>
        <div className={styles.buttonGroup}>
          <Button
            id="button-header-changes-modal-stay"
            onClick={() => setIsVisible(false)}
            variant="secondary"
          >
            {t('cancel')}
          </Button>
          <Button id="button-header-changes-modal-leave" onClick={handleSignOut} variant="primary">
            {t('leave')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
