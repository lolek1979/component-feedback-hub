'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { InteractionType } from '@azure/msal-browser';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from '@azure/msal-react';

import useUserPhoto from '@/core/api/query/useUserPhoto';
import IMax from '@/core/assets/icons/crop_square.svg';
import IClose from '@/core/assets/icons/icon-close.svg';
import IMenu from '@/core/assets/icons/icon-menu.svg';
import VZPLogo from '@/core/assets/icons/logo.svg';
import IMin from '@/core/assets/icons/minimize.svg';
import { getCurrentToken } from '@/core/auth/tokenFetcher';
import { getInitials } from '@/core/auth/utils';
import { ROUTES } from '@/core/config';
import { useAppContext } from '@/core/providers/context';
import { useUserStore } from '@/core/stores/userStore';
import { AppLink, Button, Divider, Text } from '@/design-system/atoms';

import { UserBubble } from '../UserBubble';
import styles from './Header.module.css';
/**
 * Header component for main application navigation and user controls.
 *
 * Renders logo, user info, authentication controls, and menu toggle.
 * Handles login, menu open/close, and desktop app window controls.
 *
 * @returns React component
 */
export const Header = () => {
  const t = useTranslations('Header');
  const tCommon = useTranslations('common');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: photo } = useUserPhoto();

  const { accounts, instance: msalInstance } = useMsal();
  const account = useAccount(accounts[0] || {});
  const isAuthenticated = useIsAuthenticated();

  const setAccount = useUserStore((state) => state.setAccount);

  const { login } = useMsalAuthentication(InteractionType.Silent);
  const onClick = (event: string) => {
    // eslint-disable-next-line no-console
    console.log(event);
  };
  const context = useAppContext();
  const { isSideMenuOpened } = context.state;
  const { setIsSideMenuOpened } = context.actions;
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR';
  const toggleMenu = () => {
    setIsSideMenuOpened(!isSideMenuOpened);
  };

  const { given_name, family_name, name } = account?.idTokenClaims || {};

  const fullName = given_name && family_name ? `${given_name} ${family_name}` : name;

  useEffect(() => {
    if (account) {
      const claims = account.idTokenClaims as Record<string, any> | undefined;

      setAccount({
        name: fullName,
        username: account.username,
        email: claims?.email || claims?.preferred_username,
        tenantId: account.tenantId,
        objectId: claims?.oid,
        idTokenClaims: claims,
      });
    }
  }, [account, fullName, setAccount]);

  const handleLogIn = async () => {
    if (isAuthenticated) {
      setIsMenuOpen(true);
    } else {
      // Login user and set accessToken to localStorage
      await login(InteractionType.Popup);
      await getCurrentToken(msalInstance);
    }
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.logoContainer}>
        <AppLink link={ROUTES.HOME}>
          <VZPLogo id="icon-header-vzp" className={styles.logo} aria-label="Logo" />
        </AppLink>
      </div>
      <div className={styles.controlsContainer} title={t('title')}>
        <div className={styles.rightContainer}>
          <div className={styles.userInfo}>
            <button
              id={'button-header-open-dropdown'}
              className={styles.profileButton}
              onClick={handleLogIn}
              aria-label={isAuthenticated ? account?.name : t('signIn')}
            >
              {photo ? (
                <Image
                  src={photo}
                  alt={tCommon('userPhoto')}
                  id="icon-header-profile-picture"
                  className={styles.profileIcon}
                  width={36}
                  height={36}
                />
              ) : (
                <div className={styles.profileIcon} aria-hidden="true">
                  {getInitials(fullName)}
                </div>
              )}

              <Text variant="subtitle" className={styles.userName}>
                <AuthenticatedTemplate>{fullName}</AuthenticatedTemplate>
                <UnauthenticatedTemplate>{t('signIn')}</UnauthenticatedTemplate>
              </Text>
            </button>
          </div>
          <Button
            id={'button-header-' + (isSideMenuOpened ? 'close' : 'menu')}
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label={isSideMenuOpened ? 'Close menu' : 'Open menu'}
            data-testid={'Menu'}
            variant="unstyled"
          >
            {isSideMenuOpened ? (
              <IClose id="icon-header-close" width={20} height={20} />
            ) : (
              <IMenu id="icon-header-open" width={20} height={20} />
            )}
          </Button>
        </div>
        {userAgent === 'vzp-app-desktop' ? (
          <>
            <Divider className={styles.divider} orientation="vertical" />
            <div className={styles.controls} id="desktop-controls-container">
              <IMin
                id="icon-header-minimalize"
                width={20}
                height={20}
                onClick={() => onClick('Minimalize')}
                aria-label="Minimize window"
              />
              <IMax
                id="icon-header-maximalize"
                width={20}
                height={20}
                onClick={() => onClick('Maximalize')}
                aria-label="Maximize window"
              />
              <IClose
                id="icon-header-close"
                width={16}
                height={16}
                onClick={() => onClick('Close')}
                aria-label="Close window"
              />
            </div>
          </>
        ) : null}
      </div>
      <UserBubble isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </header>
  );
};
