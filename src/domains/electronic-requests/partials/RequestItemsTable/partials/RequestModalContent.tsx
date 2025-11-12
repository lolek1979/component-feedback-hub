import { useTranslations } from 'next-intl';

import { RequestItemDetailModel } from '@/domains/electronic-requests/api/services/types';

import styles from './RequestItemConfirmModal.module.css';

import { FieldLabel, Text, Textarea } from '@/design-system';

export const MODAL_TYPES = {
  CREATE_NEW: 'createNew',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  COMPLETE_WITHOUT_PURCHASE: 'completeWithoutPurchase',
} as const;

export type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

interface RequestModalContentProps {
  modalType: ModalType;
  selectedItem?: RequestItemDetailModel | null;
  selectedBatchItems?: RequestItemDetailModel[];
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

export const RequestModalContent = ({
  modalType,
  selectedBatchItems,
  selectedItem,
  reason,
  onReasonChange,
}: RequestModalContentProps) => {
  const tRejectModal = useTranslations('requests.itemsTable.declineConfirmation');

  switch (modalType) {
    case 'delete':
      if (selectedBatchItems && selectedBatchItems.length > 1) {
        return (
          <div>
            <div className={styles.itemsList}>
              {selectedBatchItems.map((item) => (
                <div key={item.id}>
                  <Text className={styles.itemDetails} variant="subtitle" regular>
                    {item.description ?? item.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (selectedItem) {
        const description = selectedItem.description;
        const sapNumber =
          selectedItem.catalogueItem?.sapNumber || selectedItem.manualItem?.sapNumber || '';
        const quantity = selectedItem.quantity;

        const detailsArr = [description, quantity, sapNumber].filter(
          (v) => v !== '' && v !== undefined,
        );
        const detailsStr = detailsArr.join(' - ');

        return <Text className={styles.itemDetails}>{detailsStr}</Text>;
      }

      return null;
    case 'createNew':
      return (
        <div className={styles.itemsList}>
          {selectedBatchItems?.map((item) => (
            <div key={item.id}>
              <Text className={styles.itemDetails} variant="subtitle" regular>
                {item.description ?? item.description}
              </Text>
            </div>
          ))}
        </div>
      );
    case 'approve':
      return (
        <div className={styles.itemsList}>
          {selectedBatchItems?.map((item) => (
            <div key={item.id}>
              <Text className={styles.itemDetails} variant="subtitle" regular>
                {item.description}
                {item.description && ' - '}
                {item.quantity} Ks
                {item.manualItem?.sapNumber ? ` - ${item.manualItem.sapNumber}` : ''}
              </Text>
            </div>
          ))}
        </div>
      );
    case 'reject': {
      let items: RequestItemDetailModel[] = [];
      if (selectedBatchItems?.length) {
        items = selectedBatchItems;
      } else if (selectedItem) {
        items = [selectedItem];
      }

      const showError = !reason || reason.trim() === '';

      return (
        <div>
          <div className={styles.rejectConfirmContent}>
            {items.map((item) => {
              return (
                <Text key={item.id} className={styles.itemDetails} variant="subtitle" regular>
                  {item.description}
                  {item.description && ' - '}
                  {item.quantity} Ks
                  {item.manualItem?.sapNumber ? ` - ${item.manualItem.sapNumber}` : ''}
                </Text>
              );
            })}
            <div>
              <FieldLabel text={tRejectModal('label')} htmlFor="reject-reason" required />
              <Textarea
                id="reject-reason"
                placeholder={tRejectModal('placeholder')}
                value={reason ?? ''}
                onChange={(e) => onReasonChange?.(e.target.value)}
                helperText={showError ? tRejectModal('requiredFieldMessage') : undefined}
                isError={showError}
              />
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
