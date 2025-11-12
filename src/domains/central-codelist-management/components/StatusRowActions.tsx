'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import OptionsIcon from '@/core/assets/icons/more_horiz.svg';
import { Button } from '@/design-system/atoms';
import { Popover } from '@/design-system/molecules';
import { FileType, FileUpload } from '@/design-system/molecules/FileUpload';
import { ConfirmModal } from '@/design-system/molecules/Table/actions/ConfirmModal';
import styles from '@/design-system/molecules/Table/Table.module.css';
import { toast } from '@/design-system/molecules/Toast';

import { usePostCreateCodelistVersion, usePostImportCodelistVersion } from '../api/query';
import {
  deleteCodeListDraft,
  getCodeListsById,
  PostCreateCodelistVersionParams,
  PostCreateCodelistVersionResponse,
  PostImportCodelistVersionParams,
  PostImportCodelistVersionResponse,
  postStateCodeListDraft,
  publishCodeListDraft,
  unPublishCodeListVersion,
} from '../api/services';
import { CSCFormData, CscFormModal } from './CscFormModal';
import { CiselnikStatus, RowActionsList } from './RowActionsList';

interface ActionsProps {
  status?: CiselnikStatus;
  id?: string;
  parentName?: string;
  parentValidFrom?: string;
  parentId?: string;
  state?: string;
  description?: string;
  index?: number;
  itemType?: 'csc';
  onViewItemDetail?: (itemId: string) => void;
}

export const StatusRowActions = ({
  status,
  id,
  parentName,
  parentValidFrom,
  parentId,
  state,
  description,
  index,
  itemType = 'csc',
  onViewItemDetail,
}: ActionsProps) => {
  if (!status) return null;

  return (
    <RowActionsPopover
      status={status}
      id={id}
      parentName={parentName}
      parentValidFrom={parentValidFrom}
      parentId={parentId}
      state={state}
      description={description}
      index={index}
      itemType={itemType}
      onViewItemDetail={onViewItemDetail}
    />
  );
};

const RowActionsPopover = ({
  status = 'Active',
  id,
  parentName,
  parentValidFrom,
  parentId,
  state,
  description,
  index,
  itemType = 'csc',
}: ActionsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [isNewConceptModal, setIsNewConceptModal] = useState(false);
  const [isNewVersionFileUploadModal, setIsNewVersionFileUploadModal] = useState(false);
  const [newVersionFiles, setNewVersionFiles] = useState<File[]>([]);
  const [savedNewVersionFormData, setSavedNewVersionFormData] = useState<CSCFormData | null>(null);

  const [newVersionFileTypes, setNewVersionFileTypes] = useState<Record<string, any>>({});
  const { mutate: postImportNewVersion } = usePostImportCodelistVersion();
  const { mutate: postCreateNewVersion } = usePostCreateCodelistVersion();

  const tToasts = useTranslations('cscToasts');
  const [garants, setGarants] = useState<string[]>([]);
  const [editors, setEditors] = useState<string[]>([]);
  const router = useRouter();
  const t = useTranslations();
  const tRowActions = useTranslations('RowActions');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const handleNewVersionFiles = (files: File[], types: Record<string, FileType>) => {
    setNewVersionFiles(files);
    setNewVersionFileTypes(types);
  };
  const startNewVersionProcessByImport = (formData: CSCFormData) => {
    setSavedNewVersionFormData(formData);
    setIsNewVersionFileUploadModal(true);
  };

  const processNewVersionByManual = (formData: CSCFormData) => {
    const payload: PostCreateCodelistVersionParams = {
      codeListId: parentId ?? '',
      name: formData.cscName,
      description: formData.description,
      validFrom: formData.startDate,
      garants: formData.garants.map((g) => g.id),
      editors: formData.editors.map((e) => e.id),
      versionType: formData.type,
    };

    postCreateNewVersion(payload, {
      onSuccess: (response: PostCreateCodelistVersionResponse) => {
        if (response && response.draftId) {
          toast.success(tToasts('create.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}`,
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
  };

  const processNewVersionByTakeover = (formData: CSCFormData) => {
    const payload: PostCreateCodelistVersionParams = {
      codeListId: parentId ?? '',
      name: formData.cscName,
      description: formData.description,
      validFrom: formData.startDate,
      garants: formData.garants.map((g) => g.id),
      editors: formData.editors.map((e) => e.id),
      versionType: formData.type,
    };

    postCreateNewVersion(payload, {
      onSuccess: (response: PostCreateCodelistVersionResponse) => {
        if (response && response.draftId) {
          toast.success(tToasts('create.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}&autoEdit=true`,
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
  };

  const processNewVersionByImport = () => {
    if (!savedNewVersionFormData || newVersionFiles.length === 0) {
      toast.error('No form data or files selected', {
        id: 'toast-cscDetailPage-noFilesSelected',
      });

      return;
    }

    const dataToSubmit: PostImportCodelistVersionParams = {
      id: parentId ?? '',
      name: savedNewVersionFormData.cscName,
      description: savedNewVersionFormData.description,
      validFrom: savedNewVersionFormData.startDate,
      garants: savedNewVersionFormData.garants.map((g) => g.id),
      editors: savedNewVersionFormData.editors.map((e) => e.id),
      versionType: savedNewVersionFormData.type,
      uploadedFiles: newVersionFiles.map((file) => ({
        file,
        type: newVersionFileTypes[file.name],
      })),
    };

    postImportNewVersion(dataToSubmit, {
      onSuccess: (response: PostImportCodelistVersionResponse) => {
        if (response && response.draftId) {
          toast.success(tToasts('import.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}`,
          );
        }
      },
      onError: (error: Error | AxiosError) => {
        let errorCode = '500';
        if (error instanceof AxiosError && error.response) {
          errorCode = error.response.status?.toString();
        }
        toast.error(tToasts(`import.${errorCode}`), { id: 'toast-cscHeaderButtons-importError' });
      },
    });
  };
  const handleFileUploadBack = () => {
    setIsNewVersionFileUploadModal(false);
    setIsNewConceptModal(true);
  };

  const handleItemSelect = async (value: string) => {
    setIsVisible(false);

    if (itemType === 'csc') {
      if (value === 'CopyLink') {
        navigator.clipboard.writeText(
          location.origin + '/centralni-sprava-ciselniku/' + id + '?parent=' + parentId,
        );
        toast.success(t('common.copyLinkMessage'), {
          id: `toast-statusRowActions-copyLink-${index}`,
        });
      }

      if (status === 'Concept' && value === 'Delete') {
        setModalStatus('Concept');
        setIsConfirmModalVisible(true);
      }
      if (status === 'Concept' && value === 'SendForApproval') {
        setModalStatus('SendForApproval');
        setIsConfirmModalVisible(true);
      }

      if (status === 'WaitingForApproval' && value === 'CancelApproval') {
        setModalStatus('SendForRework');
        setIsConfirmModalVisible(true);
      }
      if (status === 'WaitingForApproval' && value === 'Publish') {
        setModalStatus('ConceptPublish');
        setIsConfirmModalVisible(true);
      }

      if (status === 'Planned' && value === 'Unpublish' && id) {
        setModalStatus('Planned');
        setIsConfirmModalVisible(true);
      }

      if (status === 'Concept' && value === 'Publish' && id) {
        setModalStatus('ConceptPublish');
        setIsConfirmModalVisible(true);
      }

      if (status === 'Concept' && value === 'Edit') {
        router.push(`/centralni-sprava-ciselniku/${id}?parent=${parentId}&autoEdit=true`);
      }

      if (value === 'NewVersion') {
        if (id) {
          const powerUsers = await fetchGarantsEditors(id);
          setGarants(powerUsers.garants);
          setEditors(powerUsers.editors);
          setIsNewConceptModal(true);
        } else {
          console.error('ID is undefined');
        }
        setIsNewConceptModal(true);
      }
    }
  };

  const fetchGarantsEditors = async (
    id: string,
  ): Promise<{ garants: string[]; editors: string[] }> => {
    const response = await getCodeListsById({ id, isCodelist: true });
    if (response && response.payload) {
      const garants = response.payload.garants
        ? response.payload.garants.map((garant) => garant.fullName)
        : [];
      const editors = response.payload.editors
        ? response.payload.editors.map((editor) => editor.fullName)
        : [];

      return { garants, editors };
    }

    return { garants: [], editors: [] };
  };

  const handleFormSubmit = async (
    data: CSCFormData,
    actionType?: 'import' | 'manual' | 'takeover' | '',
  ) => {
    switch (actionType) {
      case 'import':
        startNewVersionProcessByImport(data);

        return;
      case '':
        processNewVersionByManual(data);

        return;
      case 'takeover':
        processNewVersionByTakeover(data);

        return;

      default:
        toast.warning(tToasts('newVersionUnknownMethod'), {
          id: 'toast-cscHeaderButtons-new-version-unknown-method',
        });

        return;
    }
  };

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  const { mutate: deleteConceptMutation } = useMutation({
    mutationFn: deleteCodeListDraft,
    onSuccess: () => {
      toast.success(
        tCommon('deleteConceptSuccess') + parentName + tCommon('deleteConceptSuccess2'),
        {
          onAutoClose: () => {
            queryClient.invalidateQueries({ queryKey: ['codeLists'] });
          },
          onDismiss: () => {
            queryClient.invalidateQueries({ queryKey: ['codeLists'] });
          },
          id: `toast-statusRowActions-deleteConceptSuccess-${index}`,
        },
      );
      setIsConfirmModalVisible(false);
    },
    onError: (error) => {
      console.error('Concept cant be deleted', error);
    },
  });
  const { mutate: sendForApprovalMutation } = useMutation({
    mutationFn: () => postStateCodeListDraft(id ?? '', 'WaitingForApproval'),
    onSuccess: () => {
      toast.success(tCommon('sendForApprovalSuccess'), {
        id: `toast-statusRowActions-sendForApprovalSuccess-${index}`,
      });
      queryClient.invalidateQueries({ queryKey: ['codeLists'] });
    },
    onError: (error) => {
      console.error('Error sending for approval:', error);
      toast.error(tCommon('sendForApprovalError'), {
        id: `toast-statusRowActions-sendForApprovalError-${index}`,
      });
    },
  });

  const handleSendForApproval = () => {
    sendForApprovalMutation();
  };

  // When process for rejected edit from "Editing" to "Rejected"
  const { mutate: reworkMutation } = useMutation({
    mutationFn: () => postStateCodeListDraft(id ?? '', 'Editing'),
    onSuccess: () => {
      toast.success(tCommon('sendForReworkSuccess'), {
        id: `toast-statusRowActions-sendForReworkSuccess-${index}`,
      });
      queryClient.invalidateQueries({ queryKey: ['codeLists'] });
    },
    onError: (error) => {
      console.error('Error sending for rework:', error);
      toast.error(tCommon('sendForReworkError'), {
        id: `toast-statusRowActions-sendForReworkError-${index}`,
      });
    },
  });

  const handleRework = () => {
    reworkMutation();
  };

  const handleDeleteConcept = () => {
    if (id) {
      deleteConceptMutation(id);
    } else {
      console.error('ID is undefined');
    }
  };

  const toastId = `toast-statusRowActions-unPublishPlanned-${index}`;

  const { mutate: handleUnPublishMutation } = useMutation({
    mutationFn: unPublishCodeListVersion,
    onSuccess: () => {
      toast.success(tCommon('unPublishPlanned'), { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['codeLists'] });
    },
    onError: (error) => {
      console.error('Failed to unpublish:', error);
      toast.error(tCommon('unPublishError'), {
        id: `toast-statusRowActions-unPublishError-${index}`,
      });
    },
  });

  const handleUnPublish = () => {
    if (id) {
      handleUnPublishMutation(id);
    } else {
      console.error('ID is undefined');
    }
  };

  const { mutate: handlePublishMutation } = useMutation({
    mutationFn: async () => {
      return publishCodeListDraft(id ?? '');
    },
    onSuccess: (response) => {
      if (response && response.state === 'Failure') {
        const messages = response.messages || [];
        const firstCode = messages[0]?.code;

        const matchingCode =
          firstCode ||
          messages.find((m) =>
            ['ExtraValues', 'PublishToPast', 'NoColumns', 'EmptyContent', 'WrongType'].includes(
              m.code,
            ),
          )?.code;

        switch (matchingCode) {
          case 'ExtraValues':
            toast.error(tCommon('publishConceptErrorStructure'), {
              id: 'toast-cscDetailPage-publishConceptErrorStructure',
            });
            break;
          case 'PublishToPast':
            toast.error(tCommon('publishConceptError'), {
              id: 'toast-cscDetailPage-publishConceptError',
            });
            break;
          case 'NoColumns':
            toast.error(tCommon('publishConceptErrorNoColumns'), {
              id: 'toast-cscDetailPage-publishConceptErrorNoColumns',
            });
            break;
          case 'EmptyContent':
            toast.error(tCommon('publishConceptErrorEmptyContent'), {
              id: 'toast-cscDetailPage-publishConceptErrorEmptyContent',
            });
            break;
          case 'CDL-CodeNotUnique':
            toast.error(tCommon('publishConceptErrorCode'), {
              id: 'toast-cscDetailPage-publishConceptErrorCode',
            });
            break;
          case 'WrongType':
            toast.error(tCommon('publishConceptErrorWrongType'), {
              id: 'toast-cscDetailPage-publishConceptErrorWrongType',
            });
            break;
          default:
            toast.error(tCommon('publishConceptErrorGeneral'), {
              id: 'toast-cscDetailPage-publishConceptErrorGeneral',
            });
            break;
        }

        return;
      }

      toast.success(tCommon('publishConcept'), {
        id: 'toast-cscDetailPage-publishConcept',
        onAutoClose: () => window.location.reload(),
        onDismiss: () => window.location.reload(),
      });

      queryClient.invalidateQueries({ queryKey: ['codeLists'] });
    },
    onError: (error) => {
      if (!String(error.message || '').startsWith('Validation:')) {
        console.error('Failed to publish:', error);
        toast.error(tCommon('publishConceptErrorGeneral'), {
          id: `toast-statusRowActions-publishError-${index}`,
        });
      }
    },
  });

  const handlePublish = () => {
    handlePublishMutation();
  };

  const handleConfirm = () => {
    if (modalStatus === 'Concept') {
      handleDeleteConcept();
    } else if (modalStatus === 'Planned') {
      handleUnPublish();
    } else if (modalStatus === 'SendForRework') {
      handleRework();
    } else if (modalStatus === 'SendForApproval') {
      handleSendForApproval();
    } else if (modalStatus === 'ConceptPublish') {
      handlePublish();
    }
    setIsConfirmModalVisible(false);
  };

  const handleCancel = () => {
    setIsConfirmModalVisible(false);
  };
  /*
  const handleRemoveItem = (itemId?: string) => {
    if (!itemId) {
      console.error('Item ID is undefined');

      return;
    }

    // TODO: Add Remove item API
    toast.success(t('requests.itemActions.removeSuccess'), {
      id: `toast-statusRowActions-removeItem-${index}`,
      onAutoClose: () => {
        queryClient.invalidateQueries({ queryKey: ['requestItems'] });
      },
    });
  };
  */

  return (
    <div>
      <Popover
        content={() => (
          <RowActionsList
            status={status}
            onItemSelect={handleItemSelect}
            codeListId={id}
            itemType="csc"
          />
        )}
        placement="tooltip-bottom-start"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        trigger={
          <Button
            title={tRowActions('RowActionsButton')}
            className={styles.tertiary}
            variant="tertiary"
            onClick={handleButtonClick}
            size="small"
            id={'button-Statusrow-actions-' + index}
          >
            <OptionsIcon id={'icon-status-row-options-' + index} width={24} height={24} />
          </Button>
        }
      />
      <CscFormModal
        isVisible={isNewConceptModal}
        setIsVisible={setIsNewConceptModal}
        onSubmit={handleFormSubmit}
        creationType={'edit'}
        presetName={parentName}
        perviousDate={parentValidFrom}
        state={state}
        description={description}
        parentGarants={garants}
        parentEditors={editors}
      />
      <ConfirmModal
        name={parentName || ''}
        validFrom={parentValidFrom || ''}
        status={modalStatus || 'Concept'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isVisible={isConfirmModalVisible}
        setIsVisible={setIsConfirmModalVisible}
      />
      <FileUpload
        onFilesSelected={handleNewVersionFiles}
        limitLabel={t('CSCDetailPage.fileUploadLimit')}
        dropLabel={t('CSCDetailPage.fileUploadLabel')}
        isVisible={isNewVersionFileUploadModal}
        setIsVisible={() => setIsNewVersionFileUploadModal(false)}
        isUploaded={newVersionFiles.length === 0}
        setIsAbleToContinue={(canContinue) => {
          if (canContinue) {
            processNewVersionByImport();
          } else {
            setIsNewVersionFileUploadModal(!canContinue);
          }
        }}
        onBack={handleFileUploadBack}
        isModal={true}
      />
    </div>
  );
};
