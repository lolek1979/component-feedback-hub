'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import Iremove from '@/core/assets/icons/delete_forever.svg';
import IFile from '@/core/assets/icons/icon-file.svg';
import { Button } from '@/design-system/atoms';
import { Typography } from '@/design-system/molecules';

import styles from './AttachmentsUpload.module.css';

interface AttachmentsUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
}

export const AttachmentsUpload = ({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'],
}: AttachmentsUploadProps) => {
  const t = useTranslations('AttachmentsUpload');
  const [files, setFiles] = useState<File[]>([]);
  const [warning, setWarning] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isFileTypeSupported = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    return acceptedFileTypes.some((type) => type.toLowerCase() === `.${fileExtension}`);
  };

  const validateFiles = (newFiles: File[]): { valid: File[]; error: string } => {
    const unsupportedFiles = newFiles.filter((file) => !isFileTypeSupported(file));
    if (unsupportedFiles.length > 0) {
      return { valid: [], error: t('unsupportedFormatError') };
    }

    const largeFiles = newFiles.filter((file) => file.size > maxFileSize * 1024 * 1024);
    if (largeFiles.length > 0) {
      return { valid: [], error: t('maxFileSizeError', { size: maxFileSize }) };
    }

    const totalFiles = files.length + newFiles.length;
    if (totalFiles > maxFiles) {
      return { valid: [], error: t('maxFilesError', { count: maxFiles }) };
    }

    return { valid: newFiles, error: '' };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      const { valid, error } = validateFiles(newFiles);

      if (error) {
        setWarning(error);
      } else {
        const updatedFiles = [...files, ...valid];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
        setWarning('');
        resetFileInput();
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = event.dataTransfer.files;
    const newFiles = Array.from(droppedFiles);
    const { valid, error } = validateFiles(newFiles);

    if (error) {
      setWarning(error);
    } else {
      const updatedFiles = [...files, ...valid];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setWarning('');
      resetFileInput();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    resetFileInput();
    setWarning('');
  };

  return (
    <div className={styles.container}>
      {/* File List */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div className={styles.fileItem} key={`${file.name}-${index}`}>
              <IFile id={`icon-file-${index}`} width={24} height={24} />
              <div className={styles.fileInfo}>
                <Typography variant="Subtitle/Default/Link-inline" className={styles.fileName}>
                  {file.name}
                </Typography>
              </div>
              <Iremove
                id={`icon-remove-${index}`}
                className={styles.removeButton}
                width={24}
                height={24}
                onClick={() => handleRemoveFile(index)}
                role="button"
                aria-label={t('removeFileAriaLabel')}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {files.length < maxFiles && (
        <div
          className={`${styles.uploadBox} ${isDragOver ? styles.dragOver : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            hidden
            id="attachments-upload"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(',')}
            multiple
            aria-label={t('browseFilesAriaLabel')}
          />
          <Button
            id="button-attachments-upload"
            variant="secondary"
            size="large"
            onClick={() => fileInputRef.current?.click()}
          >
            {t('uploadButton')}
          </Button>
          <div className={styles.uploadInfo}>
            <Typography variant="Subtitle/Default/Regular" className={styles.limitLabel}>
              {t('limitLabel1')}
            </Typography>
            <Typography variant="Subtitle/Default/Regular" className={styles.limitLabel}>
              {t('limitLabel2', { maxFiles, maxFileSize })}
            </Typography>
          </div>
          {warning && (
            <Typography variant="Subtitle/Default/Regular" className={styles.warning}>
              {warning}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};
