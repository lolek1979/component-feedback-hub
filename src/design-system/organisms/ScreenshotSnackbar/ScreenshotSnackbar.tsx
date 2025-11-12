'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { parseAsBoolean, useQueryState } from 'nuqs';

import IScreenshot from '@/core/assets/icons/screenshot.svg';
import { feedbackScreenshotKey } from '@/core/lib/definitions';
import { Button } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';

import styles from './ScreenshotSnackbar.module.css';
/**
 * Configuration for screenshot capture timing.
 *
 * @property screenshotDelayMilliseconds - Delay before capturing the screenshot.
 * @property hideSnackbarInRemainingMilliseconds - When to hide the countdown snackbar before screenshot is taken.
 * @property countdownInterval - Update frequency for the countdown timer (ms).
 *
 * Note: Current delay values may cause the snackbar to be invisible.
 */
const screenshotDelayMilliseconds = 500;
const hideSnackbarInRemainingMilliseconds = 700;
const countdownInterval = 250;

/**
 * ScreenshotSnackbar component for capturing and displaying screenshot countdown.
 *
 * Handles screen capture, countdown timer, error handling, and integration with bug report modal.
 *
 * @returns ReactNode | null
 */
const ScreenshotSnackbar = (): ReactNode => {
  const [, setIsBugReportModalVisible] = useQueryState(
    'bugReport',
    parseAsBoolean.withDefault(false),
  );
  const [isScreenshotSnackbarVisible, setIsScreenshotSnackbar] = useQueryState(
    'captureScreenshot',
    parseAsBoolean.withDefault(false),
  );
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(screenshotDelayMilliseconds);
  const t = useTranslations('Screenshots');

  const handleCancelScreenshot = () => {
    setIsScreenshotSnackbar(null).then(() => {
      setIsBugReportModalVisible(true);
    });
  };

  const startCountdown = async () => {
    try {
      // Options for screen capture - preferring the current tab
      const displayMediaOptions = {
        video: {
          displaySurface: 'browser',
        },
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        audio: false,
      };

      // Request display media (screen sharing)
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      window.screenshotStream = stream;
      setCountdown(screenshotDelayMilliseconds);
      setIsCountingDown(true);
    } catch {
      toast.error(t('failed'), {
        id: 'toast-screenshotSnackbar-startCountdown',
      });
      handleCancelScreenshot();
    }
  };

  const captureScreenshot = async () => {
    try {
      const stream = window.screenshotStream;

      if (!stream) {
        toast.error(t('failed'), {
          id: 'toast-screenshotSnackbar-noStream',
        });

        return;
      }

      const video = document.createElement('video');
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        stream.getTracks().forEach((track) => track.stop());
        setIsScreenshotSnackbar(null);
        toast.error(t('failed'), {
          id: 'toast-screenshotSnackbar-noContext',
        });

        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      localStorage.setItem(feedbackScreenshotKey, dataUrl);

      stream.getTracks().forEach((track) => track.stop());
      setIsCountingDown(false);
      setCountdown(screenshotDelayMilliseconds);
      window.screenshotStream = null;
      setIsScreenshotSnackbar(null).then(() => {
        setIsBugReportModalVisible(true);
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(t('failed'), {
        id: 'toast-screenshotSnackbar-captureError',
      });
      setIsScreenshotSnackbar(null);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - countdownInterval), countdownInterval);
    } else if (isCountingDown && countdown <= 0) {
      captureScreenshot();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCountingDown, countdown]);

  if (
    !isScreenshotSnackbarVisible ||
    (isCountingDown && countdown < hideSnackbarInRemainingMilliseconds)
  )
    return null;

  return (
    <aside className={styles.screenshotSnackbarWrapper}>
      <div
        id="screenshot-snackbar"
        className={`${styles.screenshotSnackbar} ${isCountingDown ? styles.counting : ''}`}
      >
        {isCountingDown ? (
          <div className={styles.countdownText}>
            {t('screenshotIn')}&nbsp;<b>{(countdown / 1000).toFixed(2)}</b>&nbsp;s.
          </div>
        ) : (
          <>
            <Button
              id="button-snackbar-cancel"
              onClick={handleCancelScreenshot}
              variant="tertiary"
              className={styles.snackbarBtn}
            >
              {t('cancelBtn')}
            </Button>
            <Button
              id="button-snackbar-screenshot"
              icon={
                <IScreenshot
                  id="icon-snackbar-screenshot"
                  width={24}
                  height={24}
                  className="icon_white"
                />
              }
              iconAlign="left"
              variant="primary"
              size="medium"
              onClick={startCountdown}
              className={styles.snackbarBtn}
            >
              {t('makeBtn')}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};

// Add TypeScript definition for window object extension
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    screenshotStream: MediaStream | null;
  }
}

export default ScreenshotSnackbar;
