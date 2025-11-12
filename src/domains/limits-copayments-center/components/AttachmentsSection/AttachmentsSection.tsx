'use client';

import { useCallback, useState } from 'react';

import { Badge, BadgeColors } from '@/design-system/atoms/Badge/Badge';
import { Typography } from '@/design-system/molecules';

import { AttachmentsUpload } from '../AttachmentsUpload';
import styles from './AttachmentsSection.module.css';

interface AttachmentsSectionProps {
  title?: string;
  badgeColor?: BadgeColors;
  optionalText?: string;
  description?: string;
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
}

export const AttachmentsSection = ({
  title,
  badgeColor = 'gray',
  optionalText,
  description,
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'],
}: AttachmentsSectionProps) => {
  const [filesCount, setFilesCount] = useState(0);

  const handleFilesChange = useCallback(
    (files: File[]) => {
      setFilesCount(files.length);
      onFilesChange(files);
    },
    [onFilesChange],
  );

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Typography variant="Headline/Bold" component="h2">
              {title}
            </Typography>
            <Badge color={badgeColor} size="small">
              {filesCount}
            </Badge>
            {optionalText && (
              <Typography variant="Subtitle/Default/Regular" className={styles.optionalText}>
                {optionalText}
              </Typography>
            )}
          </div>
          {description && (
            <Typography variant="Subtitle/Default/Regular" className={styles.description}>
              {description}
            </Typography>
          )}
        </div>
      )}

      <AttachmentsUpload
        onFilesChange={handleFilesChange}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        acceptedFileTypes={acceptedFileTypes}
      />
    </div>
  );
};
