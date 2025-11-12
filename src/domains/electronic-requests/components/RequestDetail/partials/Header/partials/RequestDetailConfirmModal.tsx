import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import { Modal } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import { useSubmitRequestForApproval } from '@/domains/electronic-requests/api/query';
import { useReturnRequest } from '@/domains/electronic-requests/api/query/useReturnRequest';
import { useUpdateRequest } from '@/domains/electronic-requests/api/query/useUpdateRequest';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { RequestDetailConfirmContent } from './RequestDetailConfirmContent';
export type ModalType = 'submit' | 'cancel' | 'returnRequest' | 'returnToApproval';
interface RequestDetailConfirmModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  handleCloseSubmitModal: () => void;
  handleSendRequestForApproval: () => void;
  handleDeleteRequest: () => void;
  isDeleting: boolean;
  modalType: ModalType;
  requestStatus?: string;
  requestData?: RequestDetailModel | null;
  requestId: string;
}

export const RequestDetailConfirmModal = ({
  isModalVisible,
  setIsModalVisible,
  handleCloseSubmitModal,
  handleSendRequestForApproval,
  handleDeleteRequest,
  isDeleting,
  modalType,
  requestStatus,
  requestId,
  requestData,
}: RequestDetailConfirmModalProps) => {
  const tRequestSubmitModal = useTranslations('requests.submitForApprovalModal');
  const tCancelRequestModal = useTranslations('requests.cancelRequestModal');
  const tReturnRequestModal = useTranslations('requests.returnRequestModal');
  const tReturnToApprovalModal = useTranslations('requests.itemsTable.returnToApprover');

  const { mutate: returnRequest } = useReturnRequest();
  const { mutate: updateRequest } = useUpdateRequest();
  const { mutate: submitForApproval } = useSubmitRequestForApproval();
  const t = useTranslations('requests.newRequestModal.fieldsLabels');
  const queryClient = useQueryClient();

  let item = { label: '', value: '' };
  if (requestData) {
    if (modalType === 'returnRequest') {
      item = {
        label: t('recipient'),
        value: `${requestData.createdBy.givenName} ${requestData.createdBy.surname}`,
      };
    } else if (modalType === 'submit') {
      item = {
        label: t('requestCause'),
        value: requestData.justification || '-',
      };
    } else if (modalType === 'returnToApproval') {
      item = {
        label: t('requestCause'),
        value: requestData.justification || '-',
      };
    }
  }

  const mapModalContent = () => {
    if (modalType === 'submit') {
      return {
        title: tRequestSubmitModal('title'),
        description: tRequestSubmitModal('description'),
        inputLabel: tRequestSubmitModal('requestCause'),
        confirmButton: tRequestSubmitModal('confirmButton'),
        cancelButton: tRequestSubmitModal('cancelButton'),
      };
    }
    if (modalType === 'returnRequest') {
      return {
        title: tReturnRequestModal('title'),
        userLabel: tReturnRequestModal('requester'),
        inputLabel: tReturnRequestModal('inputLabel'),
        inputPlaceholder: tReturnRequestModal('inputPlaceholder'),
        confirmButton: tReturnRequestModal('confirmButton'),
        cancelButton: tReturnRequestModal('cancelButton'),
      };
    }
    if (modalType === 'returnToApproval') {
      return {
        title: tReturnToApprovalModal('title'),
        inputLabel: tReturnToApprovalModal('reason'),
        inputPlaceholder: tReturnToApprovalModal('placeholder'),
        confirmButton: tReturnToApprovalModal('confirm'),
        cancelButton: tReturnToApprovalModal('cancel'),
        userLabel: tReturnToApprovalModal('approver'),
      };
    }

    return {
      title: tCancelRequestModal('title'),
      description: tCancelRequestModal('description'),
      confirmButton: tCancelRequestModal('confirmButton'),
      cancelButton: tCancelRequestModal('cancelButton'),
    };
  };

  const {
    title,
    description,
    inputLabel,
    inputPlaceholder,
    confirmButton,
    cancelButton,
    userLabel,
  } = mapModalContent();
  const showDescription =
    modalType === 'cancel' && ['PendingApprove2', 'PendingApprove1'].includes(requestStatus ?? '');

  const handleReturnRequest = (reason: string) => {
    if (!requestId) return;
    returnRequest(
      {
        requestId,
        body: {
          //TODO: Implement return request logic when it's ready
          level: 4,
          returnReason: reason,
        },
      },
      {
        onSuccess: () => {
          setIsModalVisible(false);
          toast.success(tReturnRequestModal('successMessage'));
        },
        onError: () => {
          toast.error(tReturnRequestModal('errorMessage'));
        },
      },
    );
  };

  const handleSubmitConfirm = (reason: string) => {
    if (!requestId || !requestData) return;
    updateRequest(
      {
        requestId,
        payload: {
          recipientId: requestData.recipient?.id ?? '',
          description: requestData.description ?? '',
          justification: reason,
          deliveryAddress: requestData.deliveryAddress ?? '',
        },
      },
      {
        onSuccess: () => {
          submitForApproval(requestId, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['request', requestId] });
              setIsModalVisible(false);
            },
          });
        },
      },
    );
  };

  return (
    <div>
      <Modal
        id="modal-submit-for-approval"
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onClose={handleCloseSubmitModal}
        title={title}
        description={showDescription ? description : ''}
        size="small"
      >
        <RequestDetailConfirmContent
          modalType={modalType}
          inputLabel={inputLabel}
          inputPlaceholder={inputPlaceholder}
          cancelButtonLabel={cancelButton}
          confirmButtonLabel={confirmButton}
          handleSendRequestForApproval={
            modalType === 'submit' ? handleSubmitConfirm : handleSendRequestForApproval
          }
          setIsModalVisible={setIsModalVisible}
          userLabel={modalType === 'submit' ? undefined : userLabel}
          handleCloseSubmitModal={handleCloseSubmitModal}
          handleDeleteRequest={handleDeleteRequest}
          isDeleting={isDeleting}
          onReturnRequest={modalType === 'returnRequest' ? handleReturnRequest : undefined}
          item={item}
          requestData={requestData ?? null}
        />
      </Modal>
    </div>
  );
};
