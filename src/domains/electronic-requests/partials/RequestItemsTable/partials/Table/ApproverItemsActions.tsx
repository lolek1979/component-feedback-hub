import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import styles from '../../../RequestsDataTable/RequestsDataTable.module.css';
import { ModalType } from '../RequestModalContent';

import { Button, Typography } from '@/design-system';

interface ApproverItemsActionsProps {
  selectedItemsCount: number;
  handleOpenModalWithType: (type: ModalType) => void;
  handleCompleteWithoutPurchaseItems: () => void;
}

export const ApproverItemsActions = ({
  selectedItemsCount,
  handleOpenModalWithType,
  handleCompleteWithoutPurchaseItems,
}: ApproverItemsActionsProps) => {
  const tRequestItemsTable = useTranslations('requests.itemsTable');
  const hasNoSelection = selectedItemsCount === 0;

  const handleApprove = useCallback(() => {
    handleOpenModalWithType('approve');
  }, [handleOpenModalWithType]);

  const handleReject = useCallback(() => {
    handleOpenModalWithType('reject');
  }, [handleOpenModalWithType]);

  return (
    <div className={styles.approverHeaderActions}>
      <div className={styles.actionsRow}>
        <span className={styles.selectedItemsCount}>
          <Typography variant="Caption/Bold">
            {tRequestItemsTable('selectedItems', { count: selectedItemsCount })}
          </Typography>
        </span>
        <Button
          id="button-mark-as-approved-selected-items"
          onClick={() => handleApprove}
          disabled={hasNoSelection}
        >
          {tRequestItemsTable('tableHeaderButtons.markAsApproved')}
        </Button>

        <Button
          id="button-mark-as-declined-selected-items"
          onClick={() => handleReject}
          disabled={hasNoSelection}
        >
          {tRequestItemsTable('tableHeaderButtons.markAsRejected')}
        </Button>

        <Button
          id="button-mark-as-completed-without-purchase-selected-items"
          onClick={handleCompleteWithoutPurchaseItems}
          disabled={hasNoSelection}
        >
          {tRequestItemsTable('tableHeaderButtons.markAsProcessedWithoutPurchase')}
        </Button>

        <Button
          id="button-create-new-request-from-selected-items"
          variant="secondary"
          onClick={() => handleOpenModalWithType('createNew')}
          disabled={hasNoSelection}
        >
          {tRequestItemsTable('tableHeaderButtons.newRequestFromCurrentItem')}
        </Button>
      </div>
    </div>
  );
};
