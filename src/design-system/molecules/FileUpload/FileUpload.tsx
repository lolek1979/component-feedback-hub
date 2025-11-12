'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { IError, IInfo } from '@/core/assets/icons';
import ICancel from '@/core/assets/icons/cancel.svg';
import Iremove from '@/core/assets/icons/delete_forever.svg';
import IFile from '@/core/assets/icons/icon-file.svg';
import IProgress from '@/core/assets/icons/progress_activity.svg';
import { getFileExtension } from '@/core/utils/file';
import { Badge, Button, Text } from '@/design-system/atoms';

import { Modal } from '../Modal';
import styles from './FileUpload.module.css';

import { InlineMessage } from '@/design-system';

/**
 * Possible values for aria-live attribute.
 */
type AriaLive = 'polite' | 'off' | 'assertive';

/**
 * Supported file types for upload.
 */
export type FileType = 'DataFile' | 'StructureFile' | 'StructureAndDataFile';

/**
 * Default mapping of file extensions to FileType.
 */
export const DEFAULT_FILE_TYPE_MAPPING: Record<string, FileType> = {
  xls: 'StructureAndDataFile',
  xml: 'StructureFile',
  xlsx: 'StructureAndDataFile',
  json: 'StructureAndDataFile',
  csv: 'DataFile',
};

/**
 * Props for the FileUpload component.
 */
export interface UploadProps {
  /**
   * Callback when files are selected.
   * @param files Array of selected files.
   * @param fileTypes Mapping of file names to their FileType.
   */
  onFilesSelected: (files: File[], fileTypes: Record<string, FileType>) => void;
  /** Optional icon to display on upload button. */
  icon?: React.ReactNode;
  /** Label for the drop area. */
  dropLabel?: string;
  /** Label for file size/limit. */
  limitLabel: string;
  /** Optional width for the upload area. */
  width?: string;
  /** Optional height for the upload area. */
  height?: string;
  /** Aria-live attribute value. */
  ariaLive?: AriaLive;
  /** Callback for back button. */
  onBack?: () => void;
  /** Controls modal visibility. */
  isVisible?: boolean;
  /** Sets modal visibility. */
  setIsVisible: (isVisible: boolean) => void;
  /** Indicates if files are uploaded. */
  isUploaded?: boolean;
  /** Sets ability to continue after upload. */
  setIsAbleToContinue: (isAbleToContinue: boolean) => void;
  /** Renders upload in a modal. */
  isModal?: boolean;
  /** Indicates if upload is processing. */
  isProcessing?: boolean;
  /** Error message to display. */
  error?: string;
}

const acceptedFileTypes = ['.csv', '.xml', '.xlsx'];

/**
 * FileUpload component for uploading and validating files.
 * Supports drag-and-drop, file type validation, and accessibility features.
 *
 * @param props UploadProps
 * @returns React component
 */
export const FileUpload = ({
  onFilesSelected,
  icon,
  width,
  height,
  dropLabel,
  limitLabel,
  ariaLive = 'polite',
  isVisible = false,
  setIsVisible,
  setIsAbleToContinue,
  onBack,
  isModal = false,
  isProcessing = false,
  error,
}: UploadProps) => {
  const t = useTranslations('FileUpload');
  const tH = useTranslations('CSCHeader');
  const [files, setFiles] = useState<File[]>([]);
  const [warning, setWarning] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // For keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [fileTypes, setFileTypes] = useState<Record<string, FileType>>({});

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDefaultFileType = (fileName: string): FileType => {
    const extension = getFileExtension(fileName) || '';

    return DEFAULT_FILE_TYPE_MAPPING[extension] || 'DATA';
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      const unsupportedFiles = newFiles.filter((file) => !isFileTypeSupported(file));
      const largeFiles = newFiles.filter((file) => file.size > 20 * 1024 * 1024); // 20 MB in bytes

      if (unsupportedFiles.length > 0) {
        setWarning(t('errorNotSupported'));
      } else if (largeFiles.length > 0) {
        setWarning(t('warningAboveDataLimit'));
      } else {
        const newFileTypes = { ...fileTypes };
        newFiles.forEach((file) => {
          newFileTypes[file.name] = getDefaultFileType(file.name);
        });
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setFileTypes(newFileTypes);
        setWarning('');
        resetFileInput();
      }
    }
  };

  useEffect(() => {
    onFilesSelected(files, fileTypes);
  }, [files, fileTypes, onFilesSelected]);

  const isFileTypeSupported = (file: File) => {
    const fileExtension = getFileExtension(file.name);

    return acceptedFileTypes.includes(`.${fileExtension}`);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = event.dataTransfer.files;
    const newFiles = Array.from(droppedFiles);
    const unsupportedFiles = newFiles.filter((file) => !isFileTypeSupported(file));
    if (unsupportedFiles.length > 0) {
      setWarning(t('errorNotSupported'));
    } else {
      const newFileTypes = { ...fileTypes };
      newFiles.forEach((file) => {
        newFileTypes[file.name] = getDefaultFileType(file.name);
      });
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setFileTypes(newFileTypes);
      setWarning('');
      resetFileInput();
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
        document.getElementById('browse')?.click();
        break;
      default:
        break;
    }
  };

  const handleFileListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
        break;
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
        break;
      case 'Delete':
      case 'Backspace':
        if (focusedIndex >= 0) {
          handleRemoveFile(focusedIndex);
          setFocusedIndex(-1);
        }
        break;
      default:
        break;
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFocusedIndex(-1);
    resetFileInput();
  };

  const wrapperClasses = [styles.fileUpload].filter(Boolean).join(' ');

  const FILE_TYPES: Record<FileType, string> = {
    DataFile: t('data'),
    StructureFile: t('structure'),
    StructureAndDataFile: t('dataAndStructure'),
  };

  const renderStyledInstruction = () => {
    const hasAnyFiles = files.length > 0;
    const hasCSVorXML = files.some((file) => {
      const extension = getFileExtension(file.name);

      return extension === 'csv' || extension === 'xml';
    });

    const text =
      hasAnyFiles && hasCSVorXML ? t('fileUploadInstructionWithFiles') : t('fileUploadInstruction');

    const normalWords = ['nahrajte', 'nebo', 'a'];

    const words = text.split(/(\s+)/);

    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
      const isNormal = normalWords.includes(cleanWord);

      return (
        <Text
          key={index}
          variant="subtitle"
          className={isNormal ? styles.normalWord : styles.boldWord}
        >
          {word}
        </Text>
      );
    });
  };

  const hasRequiredFilesForImport = () => {
    if (files.length === 0) return false;

    const hasErrors = getInfoMessage() !== null;
    if (hasErrors) return false;

    const hasXlsxFile = files.some((file) => {
      const extension = getFileExtension(file.name);

      return extension === 'xlsx';
    });

    if (hasXlsxFile) return true;

    const hasCSV = files.some((file) => {
      const extension = getFileExtension(file.name);

      return extension === 'csv';
    });

    const hasXML = files.some((file) => {
      const extension = getFileExtension(file.name);

      return extension === 'xml';
    });

    return hasCSV && hasXML;
  };

  const getInfoMessage = () => {
    if (files.length === 0) return null;

    const fileTypeCounts = {
      data: 0,
      structure: 0,
      both: 0,
    };

    files.forEach((file) => {
      const fileType = fileTypes[file.name];
      if (fileType === 'DataFile') {
        fileTypeCounts.data++;
      } else if (fileType === 'StructureFile') {
        fileTypeCounts.structure++;
      } else if (fileType === 'StructureAndDataFile') {
        fileTypeCounts.both++;
      }
    });

    const hasDuplicateData = fileTypeCounts.data > 1;
    const hasDuplicateStructure = fileTypeCounts.structure > 1;
    const hasDuplicateBoth = fileTypeCounts.both > 1;
    const hasStructureConflict = fileTypeCounts.structure > 0 && fileTypeCounts.both > 0;
    const hasDataConflict = fileTypeCounts.data > 0 && fileTypeCounts.both > 0;

    if (
      hasDuplicateData ||
      hasDuplicateStructure ||
      hasDuplicateBoth ||
      hasStructureConflict ||
      hasDataConflict
    ) {
      return t('errorDuplicateFileType');
    }

    if (fileTypeCounts.both > 0) return null;

    if (fileTypeCounts.structure > 0 && fileTypeCounts.data === 0) {
      return t('errorMissingDataFile');
    }

    if (fileTypeCounts.data > 0 && fileTypeCounts.structure === 0) {
      return t('errorMissingStructureFile');
    }

    return null;
  };

  const isErrorMessage = () => {
    const message = getInfoMessage();

    return message === t('errorDuplicateFileType');
  };

  const renderLoadingContent = () => (
    <div className={styles.renderContent}>
      <Text variant="h4">{tH('importTitle')}</Text>
      <div className={styles.loadingContent}>
        <IProgress
          id="loading-progress-icon"
          width={64}
          height={64}
          className={`icon_brand ${styles.spinningIcon}`}
        />
        <Text variant="headline">{t('processing')}</Text>
        <Text variant="subtitle" regular>
          {t('processingSubtitle')}
        </Text>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className={styles.renderContent}>
      <Text variant="h4"> {tH('importTitle')}</Text>
      {!hasRequiredFilesForImport() && (
        <>
          <Text variant="subtitle" regular>
            {renderStyledInstruction()}
          </Text>
          <div className={wrapperClasses}>
            <section className={styles.dragDrop} style={{ width, height }}>
              <div
                className={`${styles.uploadBox} ${files.length > 0 ? styles.active : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragOver(false)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label={dropLabel}
              >
                {!isModal ? (
                  <input
                    type="file"
                    hidden
                    id="browse"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={acceptedFileTypes.join(',')}
                    multiple
                    aria-label="Browse files"
                    disabled={isDragOver}
                  />
                ) : null}
                <Button
                  id="button-fileupload-upload"
                  icon={icon}
                  variant="primary"
                  size="large"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  ariaLabel={t('UploadBtn')}
                >
                  {t('UploadBtn')}
                </Button>
                <div className={styles.uploadInfo}>
                  <Text variant="subtitle" regular>
                    {dropLabel}
                  </Text>
                  <Text variant="subtitle" regular>
                    {limitLabel}
                  </Text>
                </div>
                {warning && <p className={styles.warning}>{warning}</p>}
              </div>
            </section>
          </div>
        </>
      )}
      {files.length > 0 && (
        <div
          className={styles.fileList}
          aria-live={ariaLive}
          tabIndex={0}
          role="listbox"
          onKeyDown={handleFileListKeyDown}
        >
          {files.map((file, index) => (
            <div
              className={`${styles.fileItem} ${focusedIndex === index ? styles.focused : ''}`}
              key={index}
              tabIndex={-1}
              role="option"
              aria-selected={focusedIndex === index}
            >
              <IFile id="icon-file-upload-file" width={24} height={24} />
              <div className={styles.fileInfo}>
                <p>{file.name}</p>
              </div>
              <div className={styles.fileType}>
                <Badge color="lightBlue" size="large">
                  {FILE_TYPES[fileTypes[file.name]] || t('selectFileType')}
                </Badge>
              </div>
              <Iremove
                id="icon-file-upload-remove"
                data-testid="remove_icon"
                className={styles.removeButton}
                style={{ cursor: 'pointer' }}
                width={24}
                height={24}
                onClick={() => handleRemoveFile(index)}
                role="button"
                aria-label={t('removeFile')}
              />
            </div>
          ))}
        </div>
      )}
      {getInfoMessage() && (
        <InlineMessage
          id="inline-message-file-upload-info"
          className={styles.inlineMessage}
          icon={
            isErrorMessage() ? (
              <IError
                id="icon-file-upload-info-error"
                width={24}
                height={24}
                className="icon_brand"
              />
            ) : (
              <IInfo id="icon-file-upload-info" width={24} height={24} className="icon_blue-600" />
            )
          }
          message={getInfoMessage()!}
          variant={isErrorMessage() ? 'error' : 'info'}
        />
      )}
      {error ? (
        <InlineMessage
          id="inline-message-file-upload-error"
          className={styles.inlineMessage}
          icon={
            <ICancel id="icon-file-upload-error" width={24} height={24} className="icon_brand" />
          }
          message={error || t('importError')}
          variant="error"
        />
      ) : null}
      {isModal ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'end' }}>
          <Button
            id="button-fileupload-close"
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                setIsVisible(false);
              }
            }}
            variant="secondary"
            ariaLabel={tH('CloseBtn')}
          >
            {tH('CloseBtn')}
          </Button>
          <Button
            id="button-fileupload-continue"
            disabled={!hasRequiredFilesForImport() || isProcessing}
            onClick={() => setIsAbleToContinue(true)}
            variant={hasRequiredFilesForImport() && !isProcessing ? 'primary' : 'tertiary'}
            aria-label={tH('ContinueBtn')}
          >
            {isProcessing ? t('processing') : tH('ContinueBtn')}
          </Button>
        </div>
      ) : null}
    </div>
  );

  return isModal ? (
    <div>
      <input
        type="file"
        hidden
        id="browse"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(',')}
        multiple
        aria-label="Browse files"
        disabled={isDragOver}
      />
      <Modal
        id="file-upload-modal"
        size="large"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
      >
        {isProcessing ? renderLoadingContent() : renderContent()}
      </Modal>
    </div>
  ) : (
    <div>{renderContent()}</div>
  );
};
