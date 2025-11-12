'use client';

import { useState } from 'react';

import OptionsIcon from '@/core/assets/icons/more_horiz.svg';
import { Button } from '@/design-system/atoms';
import { ColumnOptions } from '@/design-system/molecules/ColumnOptions';
import { RowOptions } from '@/design-system/molecules/RowOptions';

import { Popover } from '../../Popover';
import { ColumnType } from '../Table';
import styles from '../Table.module.css';

/**
 * Props for the TableActionsPopover component.
 *
 * @property index - Index of the row or column for which actions are displayed.
 * @property onRowAction - Callback when a row action is triggered. Receives action type and row index.
 * @property onColumnAction - Callback when a column action is triggered. Receives action type and column index.
 * @property isColumn - Whether the popover is for a column (true) or row (false).
 * @property onTypeChange - Callback when the column type is changed.
 */
interface TableActionsPopoverProps {
  index: number;
  onRowAction?: (action: string, rowIndex: number) => void;
  onColumnAction?: (action: string, columnIndex: number) => void;
  isColumn?: boolean;
  onTypeChange?: (key: string, type: ColumnType) => void;
}

/**
 * TableActionsPopover displays a popover with row or column actions for a table.
 *
 * Renders action buttons for adding, deleting, or changing type of rows/columns.
 *
 * @param props TableActionsPopoverProps
 * @returns React component
 */
export const TableActionsPopover = ({
  index,
  onRowAction = () => {},
  onColumnAction = () => {},
  isColumn = false,
  onTypeChange,
}: TableActionsPopoverProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleTypeChange = (type: ColumnType) => {
    setIsVisible(false);
    onTypeChange && onTypeChange(`newColumn${index + 1}`, type);
  };

  const handleRowAction = (action: string) => {
    setIsVisible(false);
    onRowAction(action, index);
  };

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Popover
      placement={isColumn ? 'tooltip-bottom-end' : 'tooltip-left'}
      content={() =>
        isColumn ? (
          <ColumnOptions
            index={index}
            onColumnAction={onColumnAction}
            onTypeChange={handleTypeChange}
          />
        ) : (
          <RowOptions index={index} onRowAction={handleRowAction} />
        )
      }
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      isColumn={isColumn}
      trigger={
        <Button
          id={
            isColumn
              ? `button-table-column-actions-option-${index}`
              : `button-table-row-actions-option-${index}`
          }
          variant="secondary"
          onClick={handleButtonClick}
          size="small"
          className={styles.tableActionsPopover}
        >
          <OptionsIcon
            id={
              isColumn
                ? `icon-table-column-actions-option-${index}`
                : `icon-table-row-actions-option-${index}`
            }
            width={24}
            height={24}
          />
        </Button>
      }
    />
  );
};
