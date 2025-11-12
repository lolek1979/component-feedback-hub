'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import DownloadIcon from '@/core/assets/icons/download.svg';
import IconCrop916 from '@/core/assets/icons/icon_crop9_16.svg';
import IconCrop169 from '@/core/assets/icons/icon_crop16_9.svg';
import PrintIcon from '@/core/assets/icons/icon-print.svg';
import { useFeedBackHub } from '@/core/providers/FeedBackHubProvider';
import { Button, Text } from '@/design-system/atoms';

import { FeesPagePDFProps } from '../FeesPagePDF';
import styles from './DownloadPrintButtons.module.css';

interface PrintOrientation {
  id: 'portrait' | 'landscape';
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface DownloadPrintButtonsProps {
  onDownload: (feesPageProps: FeesPagePDFProps) => void;
  onPrint: (orientation: 'portrait' | 'landscape') => void;
  isLoading?: boolean;
  isDownloading?: boolean;
  className?: string;
  feesPageProps: FeesPagePDFProps;
}

export const DownloadPrintButtons = ({
  onDownload,
  onPrint,
  isLoading = false,
  isDownloading = false,
  className,
  feesPageProps,
}: DownloadPrintButtonsProps) => {
  const t = useTranslations('DownloadPrintButtons');
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const { isFeedBackHubOpen } = useFeedBackHub();

  const handlePrintClick = (orientation: 'portrait' | 'landscape') => {
    onPrint(orientation);
    setIsPrintMenuOpen(false);
  };
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const dropdown = document.querySelector(`.${styles.printMenu}`);
      if (!isFeedBackHubOpen && dropdown && !dropdown.contains(event.target as Node)) {
        setIsPrintMenuOpen(false);
      }
    },
    [isFeedBackHubOpen],
  );

  useEffect(() => {
    if (isPrintMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPrintMenuOpen, handleOutsideClick]);

  const PRINT_ORIENTATIONS: PrintOrientation[] = [
    {
      id: 'portrait',
      label: t('orientation.portrait'),
      icon: IconCrop916,
    },
    {
      id: 'landscape',
      label: t('orientation.landscape'),
      icon: IconCrop169,
    },
  ];

  return (
    <div
      className={`${styles.wrapper} ${className || ''}`}
      role="group"
      aria-label={t('buttonGroup')}
    >
      <Button
        id="button-print-download-1"
        type="button"
        className={styles.button}
        variant="primary"
        onClick={() => onDownload(feesPageProps)}
        disabled={isLoading || isDownloading}
        icon={
          <DownloadIcon
            id="icon-print-buttons-download"
            className={'icon_white'}
            width={24}
            height={24}
          />
        }
        ariaLabel={t('downloadPDF')}
      >
        {t('downloadPDF')}
      </Button>

      <div className={styles.printButtonWrapper}>
        <Button
          className={styles.button}
          id="button-print-download-2"
          type="button"
          variant="secondary"
          onClick={() => setIsPrintMenuOpen(true)}
          disabled={isLoading}
          icon={
            <PrintIcon
              id="icon-print-buttons-print"
              className={'--color-black'}
              width={24}
              height={24}
            />
          }
          ariaLabel={t('print')}
        >
          {t('print')}
        </Button>
        {isPrintMenuOpen && (
          <div className={`${styles.printMenu} primary-shadow`}>
            {PRINT_ORIENTATIONS.map((option) => (
              <button
                id={`button-print-orientation-${option.id}`}
                key={option.id}
                type="button"
                className={styles.printMenuItem}
                onClick={() => handlePrintClick(option.id)}
              >
                <option.icon
                  id={'icon-orientation-' + option.id}
                  className={styles.orientationIcon}
                />
                <Text variant="subtitle" regular>
                  {option.label}
                </Text>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
