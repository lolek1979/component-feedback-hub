'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import Iremove from '@/core/assets/icons/delete_forever.svg';
import IFile from '@/core/assets/icons/icon-file.svg';
import { Button, Text } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';

import styles from './SingleFileUpload.module.css';

type AriaLive = 'polite' | 'off' | 'assertive';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export interface SingleFileUploadProps {
  onFileSelected: (file: File | null) => void;
  icon?: React.ReactNode;
  dropLabel?: string;
  limitLabel: string;
  width?: string;
  height?: string;
  ariaLive?: AriaLive;
  id?: string;
}

const acceptedFileTypes = ['.pdf'];

export const SingleFileUpload = ({
  onFileSelected,
  icon,
  width,
  height,
  dropLabel,
  limitLabel,
  ariaLive = 'polite',
  id,
}: SingleFileUploadProps) => {
  const t = useTranslations('FileUpload');
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];

      if (!isFileTypeSupported(selectedFile)) {
        toast.error(t('warningNotSupported'), {
          id: 'file-type-error',
        });
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(t('warningAboveDataLimit'), {
          id: 'file-size-error',
        });
      } else {
        setFile(selectedFile);
      }
    }
  };

  useEffect(() => {
    onFileSelected(file);
  }, [file, onFileSelected]);

  const isFileTypeSupported = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    return fileExtension === 'pdf';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];

      if (!isFileTypeSupported(droppedFile)) {
        toast.error(t('warningNotSupported'), {
          id: 'file-type-error',
        });
      } else if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error(t('warningAboveDataLimit'), {
          id: 'file-size-error',
        });
      } else {
        setFile(droppedFile);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        document.getElementById('browse-single')?.click();
        break;
      default:
        break;
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const wrapperClasses = [styles.singleFileUpload].filter(Boolean).join(' ');

  const renderContent = () => (
    <div className={styles.renderContent} id={id}>
      <div className={wrapperClasses}>
        {!file ? (
          <section className={styles.dragDrop} style={{ width, height }}>
            <div
              className={styles.uploadBox}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragOver(false)}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="button"
              aria-label={dropLabel}
            >
              <input
                type="file"
                hidden
                id="browse-single"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedFileTypes.join(',')}
                aria-label="Browse file"
                disabled={isDragOver}
              />
              <Button
                id="button-single-fileupload-upload"
                icon={icon}
                variant="primary"
                size="large"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                ariaLabel={t('UploadBtn')}
              >
                <Text variant="subtitle">{t('UploadBtn')}</Text>
              </Button>
              <div className={styles.uploadInfo}>
                <Text variant="subtitle" regular>
                  {dropLabel}
                </Text>
                <Text variant="subtitle" regular>
                  {limitLabel}
                </Text>
              </div>
            </div>
          </section>
        ) : (
          // Show only the uploaded file
          <div className={styles.fileDisplay} aria-live={ariaLive}>
            <div className={styles.fileItem}>
              <IFile id="icon-single-file-upload-file" width={24} height={24} />
              <div className={styles.fileInfo}>
                <Text variant="subtitle" regular>
                  {file.name}
                </Text>
              </div>
              <Iremove
                id="icon-single-file-upload-remove"
                data-testid="remove_single_file_icon"
                style={{ cursor: 'pointer' }}
                width={24}
                height={24}
                onClick={handleRemoveFile}
                role="button"
                aria-label={t('removeFile')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <div>{renderContent()}</div>;
};
