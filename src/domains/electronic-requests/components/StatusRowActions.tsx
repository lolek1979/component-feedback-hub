'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import OptionsIcon from '@/core/assets/icons/more_horiz.svg';
import { Button } from '@/design-system/atoms';
import { Popover } from '@/design-system/molecules';
import styles from '@/design-system/molecules/Table/Table.module.css';
import { toast } from '@/design-system/molecules/Toast';
import { RequestItemWorkflowState } from '@/domains/electronic-requests/api/services/types';

import { RowActionsList } from './RowActionsList';

interface ActionsProps {
  status?: RequestItemWorkflowState;
  id?: string;
  parentName?: string;
  parentValidFrom?: string;
  parentId?: string;
  state?: string;
  description?: string;
  index?: number;
  itemType?: 'request' | 'requestItem';
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
  itemType = 'request',
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
  status = RequestItemWorkflowState['Draft'],
  id,
  parentId,
  index,
  itemType = 'request',
  onViewItemDetail,
}: ActionsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const t = useTranslations();
  const tRowActions = useTranslations('RowActions');

  const handleItemSelect = async (value: string) => {
    setIsVisible(false);

    if (itemType === 'request') {
      if (value === 'CopyLink') {
        navigator.clipboard.writeText(location.origin + `/e-zadanky/${id}?parent=${parentId}`);
        toast.success(t('common.copyLinkMessage'), {
          id: `toast-statusRowActions-copyLink-${index}`,
        });
      }

      return;
    }
  };
  const handleButtonClick = () => {
    setIsVisible(!isVisible);
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
            itemType={itemType}
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
    </div>
  );
};
