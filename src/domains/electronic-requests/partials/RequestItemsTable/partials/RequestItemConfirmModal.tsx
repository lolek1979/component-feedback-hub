import { useTranslations } from 'next-intl';

import { Button, Spinner, Text } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';
import { RequestItemDetailModel } from '@/domains/electronic-requests/api/services/types';

import styles from './RequestItemConfirmModal.module.css';
import { ModalType, RequestModalContent } from './RequestModalContent';

export interface RequestItemConfirmModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  handleCloseCreateModal: () => void;
  handleCreateNewRequest: () => void;
  handleApproveItems: () => void;
  handleRejectItems: () => void;
  handleCompleteWithoutPurchaseItems: () => void;
  handleDeleteSelectedItems: () => void;
  isCreating: boolean;
  isDeleting: boolean;
  isApproving: boolean;
  modalType: ModalType;
  selectedItem?: RequestItemDetailModel | null;
  selectedBatchItems?: RequestItemDetailModel[];
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

export const RequestItemConfirmModal = ({
  isModalVisible,
  setIsModalVisible,
  handleCloseCreateModal,
  handleCreateNewRequest,
  handleApproveItems,
  handleRejectItems,
  handleCompleteWithoutPurchaseItems,
  handleDeleteSelectedItems,
  isCreating,
  isDeleting,
  isApproving,
  modalType,
  selectedItem,
  selectedBatchItems,
  reason,
  onReasonChange,
}: RequestItemConfirmModalProps) => {
  const tDeleteRequestItemsTable = useTranslations('requests.itemsTable.deleteConfirmation');
  const tNewRequestModal = useTranslations('requests.itemsTable.newRequestFromSelectedItems');
  const tApproveModal = useTranslations('requests.itemsTable.approveConfirmation');
  const tRejectModal = useTranslations('requests.itemsTable.declineConfirmation');

  const mapModalContent = () => {
    switch (modalType) {
      case 'createNew':
        return {
          title: tNewRequestModal('title'),
          confirmButton: tNewRequestModal('confirm'),
          cancelButton: tNewRequestModal('cancel'),
        };
      case 'approve':
        return {
          title: tApproveModal('title'),
          confirmButton: tApproveModal('confirm'),
          cancelButton: tApproveModal('cancel'),
        };
      case 'reject':
        return {
          title: tRejectModal('title'),
          confirmButton: tRejectModal('confirm'),
          cancelButton: tRejectModal('cancel'),
        };
      case 'delete':
      default:
        return {
          title: tDeleteRequestItemsTable('title'),
          confirmButton: tDeleteRequestItemsTable('confirm'),
          cancelButton: tDeleteRequestItemsTable('cancel'),
        };
    }
  };

  const { title, confirmButton, cancelButton } = mapModalContent();

  const getConfirmHandler = () => {
    switch (modalType) {
      case 'createNew':
        return handleCreateNewRequest;
      case 'approve':
        return handleApproveItems;
      case 'reject':
        return handleRejectItems;
      case 'completeWithoutPurchase':
        return handleCompleteWithoutPurchaseItems;
      case 'delete':
        return handleDeleteSelectedItems;
      default:
        return handleCloseCreateModal;
    }
  };

  const getIsLoading = () => {
    switch (modalType) {
      case 'createNew':
        return isCreating;
      case 'delete':
        return isDeleting;
      case 'approve':
        return isApproving;
      default:
        return false;
    }
  };

  const isRejectDisabled = modalType === 'reject' && (!reason || reason.trim() === '');

  if (modalType === 'completeWithoutPurchase') {
    return null;
  }

  return (
    <div>
      <Modal
        id={`modal-${modalType}-selected-items`}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onClose={handleCloseCreateModal}
        title={title}
        size="small"
      >
        <RequestModalContent
          modalType={modalType}
          selectedItem={selectedItem}
          selectedBatchItems={selectedBatchItems}
          reason={reason}
          onReasonChange={onReasonChange}
        />
        <div className={styles.actionsModalButtons}>
          <Button
            id="button-cancel-create-request-creation"
            onClick={handleCloseCreateModal}
            variant="tertiary"
          >
            <Text variant="subtitle" selectable={false}>
              {cancelButton}
            </Text>
          </Button>
          <Button
            id="button-confirm-request-creation"
            onClick={getConfirmHandler()}
            disabled={getIsLoading() || isRejectDisabled}
            icon={getIsLoading() ? <Spinner width={24} height={24} /> : undefined}
          >
            <Text variant="subtitle" selectable={false}>
              {confirmButton}
            </Text>
          </Button>
        </div>
      </Modal>
    </div>
  );
};
