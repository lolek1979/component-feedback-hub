'use client';

import { useTranslations } from 'next-intl';

import ApprovalIcon from '@/core/assets/icons/approval.svg';
import TrashIcon from '@/core/assets/icons/delete_forever.svg';
import IClose from '@/core/assets/icons/icon-close.svg';
import LinkIcon from '@/core/assets/icons/icon-link.svg';
import { Button, Text } from '@/design-system/atoms';

import { RequestItemWorkflowState } from '../../api/services/types';
import styles from './RowActionsList.module.css';

export interface RowActionsListProps {
  status?: RequestItemWorkflowState;
  onItemSelect: (item: string) => void;
  codeListId?: string;
  itemType?: 'request' | 'requestItem';
}

export const RowActionsList = ({
  status,
  onItemSelect,
  codeListId,
  itemType = 'request',
}: RowActionsListProps) => {
  const tRequests = useTranslations('requests');
  const tItemsRowActions = useTranslations('requests.requestDetail.tabs.items.tableRowActions');

  const rowActionsListItems = [
    // Request actions
    { value: 'ApproveRequest', label: tRequests('actions.approve') },
    { value: 'RejectRequest', label: tRequests('actions.reject') },
    { value: 'CancelRequest', label: tRequests('actions.cancel') },
    // Request item  actions
    {
      value: 'ViewItemDetail',
      label: tItemsRowActions('showDetails'),
    },
    { value: 'RemoveItem', label: tItemsRowActions('deleteItem') },
    {
      value: 'CreateNewRequest',
      label: tItemsRowActions('createNewItem'),
    },
  ];

  const handleItemClick = (item: string) => {
    onItemSelect(item);
  };

  const getIcon = (label: string, index: number) => {
    switch (label) {
      case 'ApproveRequest':
        return <ApprovalIcon id={'icon-row-actions-approval-' + index} width={24} height={24} />;
      case 'CancelApproval':
      case 'CancelRequest':
      case 'RejectRequest':
        return <IClose id={'icon-row-actions-error-' + index} width={24} height={18} />;
      case 'CopyLink':
        return <LinkIcon id={'icon-row-actions-link-' + index} width={24} height={24} />;
      case 'Delete':
        return (
          <TrashIcon
            id={'icon-row-actions-trash-' + index}
            width={24}
            height={24}
            className={'icon_red-500'}
          />
        );
      default:
        return null;
    }
  };

  const isWFState =
    status !== undefined && Object.values(RequestItemWorkflowState).includes(status);

  const filteredRowActionItems = rowActionsListItems.filter((item) => {
    // For request items
    if (itemType === 'requestItem') {
      return ['ViewItemDetail', 'RemoveItem', 'CreateNewRequest'].includes(item.value);
    }

    // For regular requests
    if (itemType === 'request') {
      return ['Details', 'CopyLink'].includes(item.value);
    }

    return ['CopyLink'].includes(item.value);
  });

  const shouldShowIcon = () => {
    if (itemType === 'request' || itemType === 'requestItem' || isWFState) {
      return false;
    }

    return true;
  };

  return (
    <div className={styles.rowActionsList} data-testid="actions-list-test">
      {filteredRowActionItems.map((item, index) => (
        <div
          role="button"
          key={item.value}
          className={`${item.value === 'Delete' ? styles.deleteListItem : ''} ${styles.rowActionsListItem}`}
          id={item.value + index}
          onClick={() => handleItemClick(item.value)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {shouldShowIcon() && getIcon(item.value, index)}
            <Button
              id={'button-rowlist-item-' + index}
              className={`${item.value === 'Delete' ? styles.delete : ''} ${styles.rowActionsItemButton}`}
              variant="unstyled"
            >
              <Text variant="subtitle" regular>
                {item.label}
              </Text>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
