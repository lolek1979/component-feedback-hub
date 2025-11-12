'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Text, Textarea } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';
import {
  useRequestCSCCategories,
  useUpdateRequestItem,
} from '@/domains/electronic-requests/api/query';
import { useContracts } from '@/domains/electronic-requests/api/query/Contracts/useContracts';
import { RequestItemDetailModel } from '@/domains/electronic-requests/api/services/types';

import { EmptyItemsModalFormFields } from './partials/EmptyItemsModalFormFields';
import { FormData, useEmptyItemsForm } from './partials/useEmptyItemsForm';
import { UploadedFile } from './partials/utils';
import styles from './EmptyItemsModal.module.css';

import { handleFormNavigation } from '@/core';
import { Modal } from '@/design-system';

interface EmptyItemsModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  requestId: string | null;
  modalMode?: 'create' | 'edit';
  itemId?: string;
  inputReadonly: boolean;
  isFromCatalogue?: boolean;
  existingItem?: RequestItemDetailModel;
}

const getTitleKey = (
  modalMode: 'create' | 'edit',
  isFromCatalogue: boolean,
  t: (key: string) => string,
) => {
  if (modalMode === 'create') return t('createTitle');

  return isFromCatalogue ? t('editCatalogueTitle') : t('editEmptyTitle');
};

const ForwardedTextarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof Textarea>
>((props, ref) => <Textarea {...props} ref={ref} />);

ForwardedTextarea.displayName = 'ForwardedTextarea';

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILES: 5,
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/gif'],
};

export const EmptyItemsModal = ({
  isModalVisible,
  setIsModalVisible,
  requestId,
  modalMode = 'create',
  itemId,
  inputReadonly,
  onItemUpdated,
  existingItem,
  isFromCatalogue = false,
}: EmptyItemsModalProps & { onItemUpdated?: () => void }) => {
  const t = useTranslations('requests.requestDetail.tabs.items.emptyItemsModal');
  const tLabels = useTranslations('requests.requestDetail.tabs.items.emptyItemsModal.fieldsLabels');
  const tConfirmModal = useTranslations('requests.requestDetail.tabs.items.requestConfirmModal');
  const tValidationErrors = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.validationErrors',
  );

  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const {
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    uploadedFiles,
    setUploadedFiles,
    handleDateChange,
    calculateTotalPrice,
    getCurrentUnit,
    amountTypes,
    onSubmit,
    isSubmitting,
    isLoading: isSubmittingForm,
  }: ReturnType<typeof useEmptyItemsForm> = useEmptyItemsForm(
    (visible) => {
      setIsModalVisible(visible);
    },
    requestId,
    itemId,
  );

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const contractValue = watch('contract');
  const categoryIdValue = watch('categoryId');

  const { data: categoriesData, isLoading: isLoadingCategories } = useRequestCSCCategories({
    take: 100,
    enabled: isModalVisible,
  });

  const { data: contractsData, isLoading: isLoadingContracts } = useContracts({
    take: 100,
    enabled: isModalVisible,
  });

  const updateRequestItemMutation = useUpdateRequestItem({
    onSuccess: () => {
      setIsModalVisible(false);
      if (onItemUpdated) onItemUpdated();
      toast.success(t('toastMessages.updateItemSuccess'), {
        id: 'toast-update-item-success',
      });
    },
    onError: (error) => {
      console.error('Error updating request item:', error);
      toast.error(t('toastMessages.updateItemError'), {
        id: 'toast-update-item-error',
      });
    },
  });

  useEffect(() => {
    if (modalMode === 'edit' && existingItem?.attachments) {
      const existingFiles: UploadedFile[] = existingItem.attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.fileName || '',
        size: 0,
        type: '',
      }));

      setUploadedFiles(existingFiles);

      setValue(
        'attachments',
        existingItem.attachments.map((att) => ({
          id: att.id,
          name: att.fileName,
        })),
      );
    }
  }, [modalMode, existingItem, setValue, setUploadedFiles]);

  useEffect(() => {
    if (
      contractsData?.items &&
      contractsData.items.length > 0 &&
      isModalVisible &&
      !contractValue
    ) {
      setValue('contract', contractsData.items[0].id.toString());
    }
  }, [contractsData, isModalVisible, setValue, contractValue]);

  useEffect(() => {
    if (
      categoriesData?.payload?.items &&
      categoriesData.payload.items.length > 0 &&
      !categoryIdValue
    ) {
      const firstCategoryId = categoriesData.payload.items[0].id.toString();
      setValue('categoryId', firstCategoryId);
    }
  }, [categoriesData, setValue, categoryIdValue]);

  const handleMainSubmit = handleSubmit((data) => {
    if (modalMode === 'edit' && itemId) {
      const expectedDeliveryDate = data.expectedDeliveryDate;

      const payload = {
        description: data.title ?? '',
        quantity: Number(data.quantity),
        expectedDeliveryDate,
        attachments: (data.attachments || [])
          .map((att) => {
            if (typeof att === 'string') return att;
            if (att?.id && typeof att.id === 'string') return att.id;
            if (att?.id?.id) return att.id.id;

            return undefined;
          })
          .filter(Boolean),
        manualItem: {
          description: data.description ?? '',
          categoryId: data.categoryId,
          supplierArticleNumber: data.supplierNumber ?? '',
          unitOfMeasure: data.measureUnit ?? '',
          unitPrice: data.unitPrice ?? 0,
          contract: data.contract ?? '',
          externalUrl: data.hyperlink ?? '',
        },
        isFromCatalogue,
      };
      updateRequestItemMutation.mutate({ itemId, payload });
    } else {
      const attachmentIds = uploadedFiles.map((file) => file.id).filter(Boolean);

      const dataWithAttachments = {
        ...data,
        attachments: attachmentIds,
      };
      setPendingFormData(dataWithAttachments);
      setIsTestModalVisible(true);
    }
  });

  const handleConfirm = async () => {
    if (pendingFormData) {
      await onSubmit(pendingFormData);
      setPendingFormData(null);
      setIsTestModalVisible(false);
    }
  };

  const handleCancelConfirm = () => {
    setPendingFormData(null);
    setIsTestModalVisible(false);
  };

  const form = {
    control,
    errors,
    watch,
    setValue,
    uploadedFiles,
    setUploadedFiles,
    handleDateChange,
    calculateTotalPrice,
    getCurrentUnit,
    amountTypes,
    modalMode,
    inputReadonly,
    contractsData,
    isLoadingContracts,
    categoriesData,
    isLoadingCategories,
    unitPrice,
    quantity,
  };

  const config = {
    FILE_UPLOAD_CONFIG,
    styles,
  };

  const translations = {
    tLabels,
    tValidationErrors,
  };

  return (
    <>
      <Modal
        id="modal-empty-items"
        size="large"
        title={getTitleKey(modalMode, isFromCatalogue, t)}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        setIsVisible={setIsModalVisible}
        isVisible={isModalVisible}
      >
        <form onSubmit={handleMainSubmit} onKeyDown={handleFormNavigation}>
          <div className={styles.modalContent}>
            <div className={styles.modalContent}>
              <div className={styles.modalContentMain}>
                <EmptyItemsModalFormFields
                  form={form}
                  config={config}
                  translations={translations}
                  isFromCatalogue={isFromCatalogue}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalFooterContent}>
                <Button
                  id="button-modal-cancel"
                  variant="secondary"
                  onClick={() => setIsModalVisible(false)}
                  disabled={isSubmitting || isSubmittingForm}
                >
                  <Text variant="subtitle" selectable={false}>
                    {t('buttons.cancel')}
                  </Text>
                </Button>
                {!inputReadonly && (
                  <Button
                    id="button-modal-confirm"
                    variant="primary"
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isSubmittingForm ||
                      (modalMode === 'edit' && updateRequestItemMutation.isPending)
                    }
                    loading={
                      isSubmitting ||
                      isSubmittingForm ||
                      (modalMode === 'edit' && updateRequestItemMutation.isPending)
                    }
                  >
                    <Text variant="subtitle" selectable={false}>
                      {modalMode === 'create' ? t('buttons.confirm') : t('buttons.saveChanges')}
                    </Text>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        id="modal-empty-items-confirm"
        size="small"
        title={
          <div>
            <Text variant="headline" className={styles.modalTitle}>
              {tConfirmModal('title')}
            </Text>
            <Text variant="caption" color="tertiary" regular>
              {tConfirmModal('subTitle')}
            </Text>
          </div>
        }
        closeOnEsc={false}
        closeOnOverlayClick={false}
        setIsVisible={setIsTestModalVisible}
        isVisible={isTestModalVisible}
      >
        <div className={styles.modalConfirmContent}>
          {pendingFormData?.title && (
            <Text variant="subtitle" regular>
              {`${pendingFormData.title} - ${pendingFormData.quantity} ${pendingFormData.measureUnit}${pendingFormData.numberInSAP ? ` - ${pendingFormData.numberInSAP}` : ''}`}
            </Text>
          )}
        </div>
        <div className={styles.modalConfirmButtons}>
          <Button id="button-modal-cancel" variant="secondary" onClick={handleCancelConfirm}>
            <Text variant="subtitle">{tConfirmModal('cancelButton')}</Text>
          </Button>
          <Button
            id="button-modal-confirm"
            variant="primary"
            onClick={() => {
              handleConfirm();
            }}
            loading={isSubmitting}
          >
            <Text variant="subtitle">{tConfirmModal('confirmButton')}</Text>
          </Button>
        </div>
      </Modal>
    </>
  );
};
