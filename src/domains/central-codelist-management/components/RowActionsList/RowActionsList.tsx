'use client';

import { useTranslations } from 'next-intl';

import ApprovalIcon from '@/core/assets/icons/approval.svg';
import CircleCheck from '@/core/assets/icons/circle_check.svg';
import TrashIcon from '@/core/assets/icons/delete_forever.svg';
import EditIcon from '@/core/assets/icons/edit.svg';
import CopyIcon from '@/core/assets/icons/icon_copy.svg';
import IClose from '@/core/assets/icons/icon-close.svg';
import LinkIcon from '@/core/assets/icons/icon-link.svg';
import StopCircleIcon from '@/core/assets/icons/stop_circle.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { Button, Text } from '@/design-system/atoms';

import useCSCAuth from '../../hooks/useCSCAuth';
import styles from './RowActionsList.module.css';

export type CiselnikStatus = 'Planned' | 'Concept' | 'Active' | 'Expired' | 'WaitingForApproval';
export interface RowActionsListProps {
  status?: CiselnikStatus;
  onItemSelect: (item: string) => void;
  codeListId?: string;
  itemType?: 'csc';
}

export const RowActionsList = ({
  status,
  onItemSelect,
  codeListId,
  itemType = 'csc',
}: RowActionsListProps) => {
  const t = useTranslations('TableActionsMenu');
  const { cscEditor, cscPublisher } = useRoles();

  const { isEditAuth, isPublisherAuth, isLoading } = useCSCAuth(codeListId || '', status);

  if (isLoading) {
    return null;
  }

  const rowActionsListItems = [
    //CSC actions
    { value: 'Publish', label: t('Publish') },
    { value: 'SendForApproval', label: t('Approval') },
    { value: 'Edit', label: t('Edit') },
    { value: 'NewVersion', label: t('NewVersion') },
    { value: 'CancelApproval', label: t('CancelApproval') },
    { value: 'Unpublish', label: t('Unpublish') },
    { value: 'Deactivate', label: t('Deactivate') },
    { value: 'CopyLink', label: t('CopyLink') },
    { value: 'Delete', label: t('Delete') },
  ];

  const handleItemClick = (item: string) => {
    onItemSelect(item);
  };

  const getIcon = (label: string, index: number) => {
    switch (label) {
      case 'Edit':
        return <EditIcon id={'icon-row-actions-edit-' + index} width={24} height={24} />;
      case 'Approval':
        return <ApprovalIcon id={'icon-row-actions-approval-' + index} width={24} height={24} />;
      case 'NewVersion':
        return <CopyIcon id={'icon-row-actions-new-verison-' + index} width={24} height={24} />;
      case 'CancelApproval':
      case 'Unpublish':
        return <IClose id={'icon-row-actions-error-' + index} width={24} height={18} />;
      case 'Deactivate':
        return (
          <StopCircleIcon id={'icon-row-actions-stop-circle-' + index} width={24} height={24} />
        );
      case 'Publish':
      case 'SendForApproval':
        return <CircleCheck id={'icon-row-actions-visibility-' + index} width={24} height={24} />;
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

  const filteredRowActionItems = rowActionsListItems.filter((item) => {
    // Handle CSC statuses
    const cscStatus = status as CiselnikStatus | undefined;

    switch (cscStatus) {
      case 'Concept':
        if (!isPublisherAuth && cscEditor && isEditAuth) {
          return ['SendForApproval', 'Edit', 'CopyLink', 'Delete'].includes(item.value);
        } else if (cscPublisher && isPublisherAuth) {
          return ['Publish', 'Edit', 'CopyLink', 'Delete'].includes(item.value);
        } else return ['CopyLink'].includes(item.value);
      case 'WaitingForApproval':
        if (cscPublisher && isPublisherAuth) {
          return ['Publish', 'CancelApproval', 'CopyLink'].includes(item.value);
        } else return ['CopyLink'].includes(item.value);

      case 'Planned':
        if (cscPublisher && isPublisherAuth) {
          return ['Unpublish', 'CopyLink'].includes(item.value);
        } else return ['CopyLink'].includes(item.value);

      case 'Active':
        if ((cscPublisher && isPublisherAuth) || (cscEditor && isEditAuth)) {
          return ['NewVersion', 'CopyLink'].includes(item.value);
        } else return ['CopyLink'].includes(item.value);

      default:
        return ['CopyLink'].includes(item.value);
    }
  });

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
            {getIcon(item.value, index)}
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
