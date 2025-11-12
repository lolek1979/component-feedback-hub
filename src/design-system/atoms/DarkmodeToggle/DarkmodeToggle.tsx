'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import IDark from '@/core/assets/icons/icon-dark-mode.svg';
import ILight from '@/core/assets/icons/icon-light-mode.svg';
import { useLocalStorage } from '@/core/hooks/useLocalStorage';
import { Button } from '@/design-system/atoms';

import styles from './DarkmodeToggle.module.css';

/**
 * DarkmodeToggle component for switching between light and dark themes.
 *
 * Uses localStorage to persist theme preference and toggles the 'dark' class on the body element.
 * Provides two buttons for light and dark mode, with animated visual feedback.
 *
 * @example
 * <DarkmodeToggle />
 *
 * @see {@link useLocalStorage}
 * @see {@link Button}
 */
export const DarkmodeToggle = () => {
  const t = useTranslations('Darkmode');
  const [isDarkModeState, setIsDarkModeState] = useLocalStorage('isDarkTheme', false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkModeState);
  }, [isDarkModeState]);

  return (
    <div className={styles.darkmodeToggle}>
      <div
        className={`${styles.animatedSquare} ${isDarkModeState ? styles.darkPosition : styles.lightPosition}`}
      />
      <Button
        className={`${styles.toggleButton} ${!isDarkModeState ? styles.active : ''}`}
        onClick={() => setIsDarkModeState(false)}
        title={t('light')}
        id="button-dark-mode-switch-1"
        aria-label={t('light')}
        aria-checked={!isDarkModeState}
        variant="unstyled"
        role="switch"
      >
        <ILight
          id="icon-dark-mode-light"
          className={clsx(isDarkModeState ? 'icon_black-50' : 'icon_white', 'icon-scale-150')}
        />
      </Button>
      <Button
        className={`${styles.toggleButton} ${isDarkModeState ? styles.active : ''}`}
        onClick={() => setIsDarkModeState(true)}
        title={t('dark')}
        aria-label={t('dark')}
        id="button-dark-mode-switch-2"
        aria-checked={isDarkModeState}
        role="switch"
        variant="unstyled"
      >
        <IDark
          id="icon-dark-mode-dark"
          className={clsx(!isDarkModeState ? 'icon_black-950' : 'icon_white', 'icon-scale-150')}
        />
      </Button>
    </div>
  );
};
