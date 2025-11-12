import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Person, UsersSelect } from '@/design-system/molecules/UserSelect';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { ModalType } from './RequestDetailConfirmModal';
import styles from './RequestDetailConfirmModal.module.css';

import { AvatarWithName, Button, FieldLabel, Spinner, Text, Textarea } from '@/design-system';

type BasicRequestDataItem = { label: string; value: string };

interface RequestDetailConfirmContentProps {
  modalType: ModalType;
  inputLabel?: string;
  inputPlaceholder?: string;
  userLabel?: string;
  item: BasicRequestDataItem;
  requestData: RequestDetailModel | null;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  setIsModalVisible: (isVisible: boolean) => void;
  handleSendRequestForApproval: (reason: string) => void;
  handleCloseSubmitModal: () => void;
  handleDeleteRequest: () => void;
  isDeleting: boolean;
  onReturnRequest?: (reason: string) => void;
}

export const RequestDetailConfirmContent = ({
  modalType,
  inputLabel,
  inputPlaceholder,
  cancelButtonLabel,
  confirmButtonLabel,
  handleCloseSubmitModal,
  handleSendRequestForApproval,
  handleDeleteRequest,
  isDeleting,
  onReturnRequest,
  userLabel,
  item,
  requestData,
}: RequestDetailConfirmContentProps) => {
  const justification = requestData?.justification || '';
  const [reason, setReason] = useState(modalType === 'submit' ? justification : '');
  const tCommon = useTranslations('common');
  const showError = !reason || reason.trim() === '';

  const initialUsers = requestData
    ? [
        {
          displayName: `${requestData.approver?.givenName} ${requestData.approver?.surname}`,
          id: requestData.approver?.id || '',
          mail: requestData.approver?.email || '',
          mobilePhone: requestData.approver?.phoneNumber || '',
          givenName: requestData.approver?.givenName || '',
          surname: requestData.approver?.surname || '',
          jobSite: requestData.createdBy.defaultAddress || '',
        },
      ]
    : [
        {
          displayName: item.value,
          id: '',
          mail: '',
          mobilePhone: '',
          givenName: item.value.split(' ')[0] || '',
          surname: item.value.split(' ')[1] || '',
        },
      ];

  const handleUserChange = (type: 'requester' | 'recipient', selected: Person[]) => {
    if (selected.length > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('userUpdate', {
          detail: { type, users: selected },
        }),
      );
    }
  };

  useEffect(() => {
    if (modalType === 'submit') {
      setReason(justification);
    }
  }, [justification, modalType]);

  switch (modalType) {
    case 'submit':
    case 'returnToApproval':
      return (
        <div className={styles.useSelectContainer}>
          {userLabel && <FieldLabel text={userLabel} required htmlFor={'label-request-cause'} />}
          {userLabel && (
            <UsersSelect
              id="recipient"
              roles={['recipient']}
              onSelectsChange={(selected) => handleUserChange('recipient', selected)}
              initialUsers={initialUsers}
              isMultiUsers={false}
              width={307}
              source="graph"
            />
          )}
          <div className={styles.requestCauseContainer}>
            {inputLabel && (
              <FieldLabel text={inputLabel} required htmlFor={'label-request-cause'} />
            )}
            <Textarea
              className={styles.requestCauseTextarea}
              placeholder={inputPlaceholder}
              id={'textarea-request-cause'}
              onChange={(e) => setReason(e.target.value)}
              value={reason}
              helperText={showError ? tCommon('requiredFieldMessage') : undefined}
              isError={showError}
            />
          </div>
          <div className={styles.submitModalButtons}>
            <Button id="button-cancel-submit" onClick={handleCloseSubmitModal} variant="tertiary">
              <Text variant="subtitle" selectable={false}>
                {cancelButtonLabel}
              </Text>
            </Button>
            <Button
              id="button-confirm-submit"
              onClick={() => handleSendRequestForApproval(reason)}
              disabled={isDeleting || showError}
              icon={isDeleting ? <Spinner width={24} height={24} /> : undefined}
            >
              <Text variant="subtitle" selectable={false}>
                {confirmButtonLabel}
              </Text>
            </Button>
          </div>
        </div>
      );
    case 'returnRequest':
      return (
        <div>
          <div className={styles.requestCauseContainer}>
            <div className={styles.requesterRow}>
              <Text variant="caption">{userLabel}</Text>
              <div className={styles.userContainer}>
                <AvatarWithName name={`${item.value}`} />
                <div className={styles.userInfoColumn}>
                  <Text variant="subtitle" regular className={styles.userText}>
                    {item.value}
                  </Text>
                  {requestData?.createdBy.phoneNumber && (
                    <Text variant="caption" color="secondary">
                      {requestData.createdBy.phoneNumber}
                    </Text>
                  )}
                  {requestData?.createdBy.email && (
                    <Text variant="caption" color="secondary">
                      {requestData.createdBy.email}
                    </Text>
                  )}
                </div>
              </div>
            </div>
            {inputLabel && (
              <FieldLabel text={inputLabel} required htmlFor={'label-request-cause'} />
            )}
            <Textarea
              className={styles.requestCauseTextarea}
              placeholder={inputPlaceholder}
              id={'textarea-request-cause'}
              helperText={showError ? tCommon('requiredFieldMessage') : undefined}
              isError={showError}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className={styles.submitModalButtons}>
            <Button id="button-cancel-submit" onClick={handleCloseSubmitModal} variant="tertiary">
              <Text variant="subtitle" selectable={false}>
                {cancelButtonLabel}
              </Text>
            </Button>
            <Button
              id="button-confirm-submit"
              onClick={() => onReturnRequest?.(reason)}
              disabled={isDeleting || showError}
              icon={isDeleting ? <Spinner width={24} height={24} /> : undefined}
            >
              <Text variant="subtitle" selectable={false}>
                {confirmButtonLabel}
              </Text>
            </Button>
          </div>
        </div>
      );
    case 'cancel':
      return (
        <div className={styles.submitModalButtons}>
          <Button id="button-cancel-submit" onClick={handleCloseSubmitModal} variant="tertiary">
            <Text variant="subtitle" selectable={false}>
              {cancelButtonLabel}
            </Text>
          </Button>
          <Button
            id="button-confirm-submit"
            onClick={handleDeleteRequest}
            disabled={isDeleting}
            icon={isDeleting ? <Spinner width={24} height={24} /> : undefined}
          >
            <Text variant="subtitle" selectable={false}>
              {confirmButtonLabel}
            </Text>
          </Button>
        </div>
      );
    default:
      return null;
  }
};
