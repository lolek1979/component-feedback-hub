'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMsal } from '@azure/msal-react';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { useSendFeedbackHubMutation } from '@/core/api/query/useSendFeedbackHubMutation';
import { SendFeedbackHubParams } from '@/core/api/services/sendFeedbackHub';
import IDelete from '@/core/assets/icons/delete_forever.svg';
import IScreenshot from '@/core/assets/icons/Vector.svg';
import { getFromLocalStorage, setToLocalStorage } from '@/core/auth/localStorage';
import {
  getBreadcrumb,
  getBrowserInfo,
  getOSInfo,
  getOSVersion,
  removeMultipleQueryParameters,
} from '@/core/auth/utils';
import { feedbackScreenshotKey } from '@/core/lib/definitions';
import ConsoleInterceptor from '@/core/providers/consoleInterceptor';
import { Button, Text, Textarea } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';

import styles from './BugReportModal.module.css';

/**
 * Validation error structure for API responses.
 *
 * @property field - Field name with error.
 * @property errors - Array of error messages for the field.
 */
interface ValidationError {
  field: string;
  errors: string[];
}

/**
 * API error structure for error handling.
 *
 * @property response - Optional response object with validation errors.
 * @property message - Error message.
 * @property code - Optional error code.
 */
interface APIError {
  response?: {
    data?: {
      validationErrors?: ValidationError[];
    };
    status?: number;
    statusText?: string;
  };
  message: string;
  code?: string;
}

/**
 * System information collected for bug report.
 *
 * @property url - Current page URL.
 * @property userAgent - Browser user agent string.
 * @property browser - Browser name.
 * @property os - Operating system name.
 * @property consoleLog - Array of console log messages.
 */
interface SystemInfo {
  url: string;
  userAgent: string;
  browser: string;
  os: string;
  consoleLog: string[];
}

/**
 * Form data for bug report submission.
 *
 * @property description - User-provided bug description.
 * @property systemInfo - System information object.
 */
interface FormData {
  description: string;
  systemInfo: SystemInfo;
}

/**
 * BugReportModal component for submitting bug reports with system info and screenshot.
 *
 * Collects user description, system/browser info, console logs, and optional screenshot.
 * Handles validation, error display, and feedback submission.
 *
 * @returns React component
 */
export const BugReportModal = () => {
  const t = useTranslations('bugReport');
  const { accounts } = useMsal();
  const description = getFromLocalStorage('FHDes');
  const [formData, setFormData] = useState<FormData>({
    description: description,
    systemInfo: {
      url: '',
      userAgent: '',
      browser: '',
      os: '',
      consoleLog: [],
    },
  });
  const [isVisible, setIsVisible] = useQueryState('bugReport', parseAsBoolean.withDefault(false));
  const [isCapturing, setIsCapturing] = useQueryState(
    'captureScreenshot',
    parseAsBoolean.withDefault(false),
  );
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const sendFeedbackMutation = useSendFeedbackHubMutation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ConsoleInterceptor.getInstance();
      } catch {
        console.error('Failed to initialize ConsoleInterceptor');
      }
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const url = window.location.href;
      const cleanedUrl = removeMultipleQueryParameters(url, ['bugReport', 'captureScreenshot']);

      const systemInfo: SystemInfo = {
        url: cleanedUrl,
        userAgent: navigator.userAgent,
        browser: getBrowserInfo(),
        os: getOSInfo(),
        consoleLog: [],
      };

      setFormData((prev) => ({
        ...prev,
        systemInfo,
      }));
    }
  }, [isVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id === 'textarea-bugreport-description-input' ? 'description' : id;
    setToLocalStorage('FHDes', value);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const collectConsoleLog = async () => {
    if (typeof window === 'undefined') return '';

    try {
      const interceptor = ConsoleInterceptor.getInstance();
      const logs = interceptor.getLogs();

      const priorityLogs = logs.filter(
        (log) =>
          log.message.includes('Error:') ||
          log.message.includes('Warning:') ||
          log.type.toLowerCase() === 'error' ||
          log.type.toLowerCase() === 'warn',
      );

      const formattedLogs = priorityLogs
        .slice(-10)
        .map((log) => {
          let message = log.message;

          if (message.includes('Error:') || message.includes('Warning:')) {
            const lines = message.split('\n');
            const errorMessage = lines[0].trim();

            const stack = lines
              .filter((line) => line.includes('at '))
              .slice(0, 5)
              .map((line) => {
                const match = line.match(/at\s+([^(\s]+)\s*(\([^)]+\))?/);

                return match ? `at ${match[1]}` : line.trim();
              })
              .join('\n');

            return JSON.stringify(
              {
                type: message.includes('Warning:') ? 'REACT_WARNING' : 'REACT_ERROR',
                message: errorMessage,
                stack,
                timestamp: log.timestamp,
              },
              null,
              1,
            );
          }

          try {
            const errorObj = JSON.parse(message);
            if (errorObj.message) {
              return JSON.stringify(
                {
                  type: 'API_ERROR',
                  message: errorObj.message,
                  code: errorObj.code,
                  status: errorObj.status,
                  timestamp: log.timestamp,
                },
                null,
                1,
              );
            }
          } catch {
            return JSON.stringify(
              {
                type: log.type.toUpperCase(),
                message: message.substring(0, 200),
                timestamp: log.timestamp,
              },
              null,
              1,
            );
          }
        })
        .filter(Boolean);

      const regularLogs = logs
        .filter((log) => !log.message.includes('Error:') && !log.message.includes('Warning:'))
        .slice(-2)
        .map((log) =>
          JSON.stringify(
            {
              type: log.type.toUpperCase(),
              message: log.message.substring(0, 100),
              timestamp: log.timestamp,
            },
            null,
            1,
          ),
        );

      const allLogs = [...formattedLogs, ...regularLogs].filter(Boolean).join('\n\n');

      return allLogs.length > 2500 ? allLogs.substring(0, 2497) + '...' : allLogs;
    } catch (error: unknown) {
      toast.error(t('failedToCollectLogs', { error: error as string }), {
        id: 'toast-bugReportModal-failedToCollectLogs',
      });

      return 'Failed to collect console logs';
    }
  };

  const getBrowserVersion = (userAgent: string): string => {
    let version = 'Unknown';

    if (formData.systemInfo.browser === 'Chrome') {
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      if (match) version = match[1];
    } else if (formData.systemInfo.browser === 'Firefox') {
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) version = match[1];
    } else if (formData.systemInfo.browser === 'Safari') {
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      if (match) version = match[1];
    } else if (formData.systemInfo.browser === 'Edge') {
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      if (match) version = match[1];
    }

    return version;
  };

  const handleSubmit = async () => {
    try {
      const consoleLog = await collectConsoleLog();
      const screenshotData = screenshot ? [screenshot] : [];
      const osVersion = await getOSVersion();
      const location = getBreadcrumb();

      const feedbackData: SendFeedbackHubParams = {
        Title: '',
        ReportTime: new Date().toISOString(),
        UserIdentifier: accounts[0]?.idTokenClaims?.email as string,
        Description: description,
        FeedBackData: consoleLog,
        Url: formData.systemInfo.url,
        Attachments: screenshotData,
        Browser: formData.systemInfo.browser,
        BrowserVersion: getBrowserVersion(formData.systemInfo.userAgent),
        OperatingSystem: formData.systemInfo.os,
        VersionOfOperatingSystem: osVersion,
        FrontendUrl: location,
        UserName: accounts[0]?.name as string,
      };

      await sendFeedbackMutation.mutateAsync(feedbackData);

      setIsVisible(false);
      deleteScreenshot();
      setFormData({
        description: '',
        systemInfo: {
          url: '',
          userAgent: '',
          browser: '',
          os: '',
          consoleLog: [],
        },
      });
      localStorage.removeItem('FHDes');

      toast.success(t('submitSuccess'), {
        id: 'toast-bugReportModal-submitSuccess',
      });
    } catch (error: unknown) {
      const apiError = error as APIError;

      if (apiError.response?.data?.validationErrors) {
        const validationErrors = apiError.response.data.validationErrors;
        const descriptionError = validationErrors.find(
          (err: ValidationError) => err.field === 'Description',
        );
        const attachmentsError = validationErrors.find(
          (err: ValidationError) => err.field === 'Attachments',
        );
        if (descriptionError) {
          toast.error(t('descriptionError'), {
            id: 'toast-bugReportModal-descriptionError',
          });
        } else if (attachmentsError) {
          toast.error(t('attachmentsError'), {
            id: 'toast-bugReportModal-attachmentsError',
          });
        } else {
          toast.error(t('submitError'), {
            id: 'toast-bugReportModal-submitError',
          });
        }
      } else {
        toast.error(t('submitError'), {
          id: 'toast-bugReportModal-submitError',
        });
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    deleteScreenshot();
    localStorage.removeItem('FHDes');
  };

  const handleCaptureScreenshot = () => {
    setIsCapturing(true).then(() => {
      setIsVisible(false);
    });
  };

  const deleteScreenshot = () => {
    localStorage.removeItem(feedbackScreenshotKey);
    setScreenshot(null);
  };

  useEffect(() => {
    if (!isCapturing) {
      setScreenshot(localStorage.getItem(feedbackScreenshotKey));
    }
  }, [isVisible, isCapturing]);

  return (
    <Modal
      id="bug-report-modal"
      title={t('modalTitle')}
      size="medium"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      closeOnEsc={true}
      onClose={handleClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.formField}>
          <Text variant="subtitle" className={styles.descriptionLabel}>
            {t('descriptionLabel')}
          </Text>
          <Textarea
            id="textarea-bugreport-description-input"
            value={description}
            initialValue={description}
            onChange={handleInputChange}
            placeholder={t('descriptionPlaceholder')}
            required
            ariaLabel={t('descriptionLabel')}
            maxLength={1000}
          />
        </div>
        {!screenshot && (
          <div className={styles.screenshotSection}>
            <Button
              id="button-bug-report-capture"
              onClick={handleCaptureScreenshot}
              variant="secondary"
              disabled={isCapturing}
              icon={<IScreenshot id="icon-bug-report-capture" />}
              iconAlign="left"
            >
              {t('captureScreenshot')}
            </Button>
          </div>
        )}
        {typeof screenshot === 'string' && (
          <div className={styles.screenshotSection}>
            <div className={styles.screenshotPreviewContainer}>
              <Image
                id="icon-bug-report-modal-screen-shot"
                src={screenshot}
                alt={t('screenshotAlt')}
                fill
                className={styles.screenshotPreviewImage}
              />
            </div>
            <Button
              id="button-bug-report-delete"
              variant="tertiary"
              onClick={deleteScreenshot}
              className={styles.deleteButton}
            >
              <IDelete id="icon-bug-report-delete" className={styles.deleteIcon} />
            </Button>
          </div>
        )}
        <div className={styles.buttonGroup}>
          <Button id="button-bug-report-close" onClick={handleClose} variant="secondary">
            {t('cancel')}
          </Button>
          <Button
            id="button-bug-report-submit"
            onClick={handleSubmit}
            disabled={!formData.description}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
