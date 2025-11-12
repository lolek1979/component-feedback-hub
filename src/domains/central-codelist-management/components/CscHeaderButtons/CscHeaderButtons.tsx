'use client';

import React, { useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useTranslations } from 'use-intl';

import IAdd from '@/core/assets/icons/add.svg';
import { KeyboardShortcut } from '@/core/auth/ShortcutService';
import ComponentShortcutsProvider from '@/core/providers/ComponentShortcutsProvider';
import { useRoles } from '@/core/providers/RolesProvider';
import { Button, Text } from '@/design-system/atoms';
import { FileUpload } from '@/design-system/molecules';
import type { FileType } from '@/design-system/molecules/FileUpload/FileUpload';
import { toast } from '@/design-system/molecules/Toast';

import { usePostCreateCodelist, usePostImportCodelist } from '../../api/query';
import { CSCFormData, CscFormModal } from '../CscFormModal';
import styles from './CscHeaderButtons.module.css';

const initialState = {
  importModalVisible: false,
  createModalVisible: false,
  isUploaded: true,
  isProcessing: false,
  importError: '',
};

type Action =
  | { type: 'setImportModalVisible'; payload: boolean }
  | { type: 'setCreateModalVisible'; payload: boolean }
  | { type: 'setIsUploaded'; payload: boolean }
  | { type: 'setIsProcessing'; payload: boolean }
  | { type: 'setImportError'; payload: string };

const modalReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'setImportModalVisible':
      return { ...state, importModalVisible: action.payload };
    case 'setCreateModalVisible':
      return { ...state, createModalVisible: action.payload };
    case 'setIsUploaded':
      return { ...state, isUploaded: action.payload };
    case 'setIsProcessing':
      return { ...state, isProcessing: action.payload };
    case 'setImportError':
      return { ...state, importError: action.payload };
    default:
      return state;
  }
};

export const CscHeaderButtons = () => {
  const t = useTranslations('CSCHeader');
  const tToasts = useTranslations('cscToasts');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileTypes, setFileTypes] = useState<Record<string, FileType>>({});
  const [savedFormData, setSavedFormData] = useState<CSCFormData | null>(null);
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const router = useRouter();
  const { importModalVisible, createModalVisible, isUploaded, isProcessing, importError } = state;
  const { cscEditor, cscPublisher } = useRoles();
  const hasCreatePermission = cscPublisher || cscEditor;

  const { mutate: importCodeList } = usePostImportCodelist();
  const { mutate: createCodeList } = usePostCreateCodelist();

  const handlePrimaryButtonClick = () => {
    dispatch({ type: 'setCreateModalVisible', payload: true });
  };

  const handleFileUploadBack = () => {
    dispatch({ type: 'setImportModalVisible', payload: false });
    dispatch({ type: 'setCreateModalVisible', payload: true });
    dispatch({ type: 'setImportError', payload: '' });
  };

  const handleImportWithFiles = async () => {
    if (!savedFormData || uploadedFiles.length === 0) {
      console.error('No form data or files to import');

      return;
    }

    dispatch({ type: 'setIsProcessing', payload: true });
    dispatch({ type: 'setImportError', payload: '' });

    const dataToSubmit = {
      codeListId: null,
      name: savedFormData.cscName,
      code: null,
      description: savedFormData.description,
      validFrom: savedFormData.startDate,
      garants: savedFormData.garants.map((g) => g.id),
      editors: savedFormData.editors.map((e) => e.id),
      versionType: savedFormData.type,
      uploadedFiles: uploadedFiles.map((file) => ({
        file,
        type: fileTypes[file.name],
      })),
    };

    importCodeList(dataToSubmit, {
      onSuccess: (response) => {
        if (response && response.draftId) {
          dispatch({ type: 'setImportModalVisible', payload: false });
          dispatch({ type: 'setIsProcessing', payload: false });
          toast.success(tToasts('import.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}`,
          );
        } else {
          dispatch({ type: 'setIsProcessing', payload: false });
          dispatch({ type: 'setImportError', payload: t('importError') });
        }
      },
      onError: (error: Error | AxiosError) => {
        dispatch({ type: 'setIsProcessing', payload: false });
        let errorCode = '500';
        let errorMessage = t('importError');
        if (error instanceof AxiosError && error.response) {
          errorCode = error.response.status?.toString();
          errorMessage = tToasts(`import.${errorCode}`);
        }
        dispatch({ type: 'setImportError', payload: errorMessage });
      },
    });
  };

  const handleImportFiles = (files: File[], types: Record<string, FileType>) => {
    setUploadedFiles(files);
    setFileTypes(types);
    if (state.isUploaded === files.length >= 1) {
      dispatch({ type: 'setIsUploaded', payload: !state.isUploaded });
    }
  };

  const handleFormSubmit = async (
    data: CSCFormData,
    actionType?: 'import' | 'manual' | 'takeover',
  ) => {
    if (actionType === 'import') {
      setSavedFormData(data);
      dispatch({ type: 'setImportModalVisible', payload: true });

      return;
    }

    if (actionType === 'manual') {
      const dataToSubmit = {
        name: data.cscName,
        description: data.description,
        garants: data.garants.map((g) => g.id),
        editors: data.editors.map((e) => e.id),
        validFrom: data.startDate,
        versionType: data.type,
        code: null,
      };
      createCodeList(dataToSubmit, {
        onSuccess: (response) => {
          if (response && response.draftId) {
            toast.success(tToasts('create.204'), {
              id: 'toast-cscDetailPage-importSuccess',
            });
            router.push(
              `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}&mode=edit`,
            );
          }
        },
        onError: (error: Error | AxiosError) => {
          let errorCode = '500';
          if (error instanceof AxiosError && error.response) {
            errorCode = error.response.status?.toString();
          }
          toast.error(tToasts(`create.${errorCode}`), { id: 'toast-cscHeaderButtons-importError' });
        },
      });

      return;
    }
  };

  const shortcuts: KeyboardShortcut[] = [
    {
      actionId: 'createNewCodebook',
      action: handlePrimaryButtonClick,
      defaultShortcut: 'ctrl+n',
    },
  ];

  return (
    <ComponentShortcutsProvider shortcuts={shortcuts}>
      <div className={styles.container}>
        <Text variant="h4" selectable={false}>
          {t('title')}
        </Text>
        <div>
          <Button
            id="button-csc-new-codelist"
            icon={<IAdd id="icon-csc-new-codelist" width={24} height={24} className="icon_white" />}
            iconAlign="left"
            variant="primary"
            size="large"
            onClick={handlePrimaryButtonClick}
            disabled={!hasCreatePermission}
            aria-disabled={!hasCreatePermission}
          >
            {t('ButtonNew')}
          </Button>

          <div>
            <FileUpload
              onFilesSelected={handleImportFiles}
              limitLabel={t('fileUploadLabel')}
              isVisible={importModalVisible}
              setIsVisible={(visible) =>
                dispatch({ type: 'setImportModalVisible', payload: visible })
              }
              isUploaded={isUploaded}
              isProcessing={isProcessing}
              error={importError}
              setIsAbleToContinue={(visible) => {
                if (visible) {
                  handleImportWithFiles();
                } else {
                  dispatch({ type: 'setImportModalVisible', payload: false });
                }
              }}
              onBack={handleFileUploadBack}
              isModal={true}
            />
          </div>
          <CscFormModal
            isVisible={createModalVisible}
            setIsVisible={(visible) =>
              dispatch({ type: 'setCreateModalVisible', payload: visible })
            }
            onSubmit={handleFormSubmit}
            creationType="new"
          />
        </div>
      </div>
    </ComponentShortcutsProvider>
  );
};
