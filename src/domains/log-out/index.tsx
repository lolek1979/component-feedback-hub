'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

import VZPLogo from '@/core/assets/icons/logo.svg';
import { loginUser } from '@/core/auth/msalConfig';
import { ROUTES } from '@/core/config';
import { Button } from '@/design-system/atoms';
import { Text } from '@/design-system/atoms';

import styles from './index.module.css';

const LogoutPage = () => {
  const t = useTranslations('LogoutPage');
  const tBtn = useTranslations('Header');
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const { instance: msalInstance, inProgress } = useMsal();

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (isAuthenticated) {
        router.push(ROUTES.HOME);
      }
    }
  }, [inProgress, isAuthenticated, router]);

  const handleLogin = () => {
    loginUser(msalInstance);
  };

  if (inProgress !== InteractionStatus.None || isAuthenticated) return null;

  return (
    <div className={styles.logoutPage}>
      <VZPLogo id="icon-logout-page-vzp" className={styles.logo} width={127} height={127} />
      <Text variant="h4">{t('title')}</Text>
      <Button id="button-logout-page-signin" variant="primary" onClick={handleLogin}>
        {tBtn('signIn')}
      </Button>
    </div>
  );
};

export default LogoutPage;
