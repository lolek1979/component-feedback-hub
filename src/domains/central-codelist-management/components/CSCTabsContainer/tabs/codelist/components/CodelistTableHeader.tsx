'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

import AddRightIcon from '@/core/assets/icons/add_column_right.svg';
import LockIcon from '@/core/assets/icons/lock.svg';
import ISwap from '@/core/assets/icons/swap_vert.svg';
import ISwapDown from '@/core/assets/icons/swap_vert_down.svg';
import ISwapUp from '@/core/assets/icons/swap_vert_up.svg';
import { Button, Option, Select, Tooltip } from '@/design-system/atoms';
import { ColumnType } from '@/design-system/molecules/Table';
import { TableColumnActions } from '@/design-system/molecules/Table/actions/TableColumnActions';
import VirtualTableCell from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableCell';
import VirtualTableHeader from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableHeader';
import VirtualTableRow from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableRow';

import styles from '../CodelistTab.module.css';
import { INDEX_COLUMN_WIDTH } from '../constants';

interface CodelistTableHeaderProps {
  editable?: boolean;
  headers?: string[];
  columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
  headerRow: VirtualItem;
  headerRow2: VirtualItem;
  columnTypes: { [key: string]: ColumnType };
  emptyHeaders: boolean;
  isColumnLocked: (index: number) => boolean;
  isTableCellDisabled: (index?: number) => boolean;
  onColumnAction: (action: string, columnIndex: number, options?: any) => void;
  onColumnTypeChange: (columnIndex: number, newType: ColumnType) => void;
  onSort?: (columnKey: string, direction: 'asc' | 'desc' | 'none') => void;
}

const typesOptions = ['String', 'DateTime', 'Integer'];

export const CodelistTableHeader = ({
  editable,
  headers,
  columnVirtualizer,
  headerRow,
  headerRow2,
  columnTypes,
  emptyHeaders,
  isColumnLocked,
  onColumnAction,
  onColumnTypeChange,
  onSort,
}: CodelistTableHeaderProps) => {
  const t = useTranslations('Table');
  const [sortStates, setSortStates] = useState<{ [key: string]: 'asc' | 'desc' | 'none' }>({});
  const [localHeaderValues, setLocalHeaderValues] = useState<{ [key: number]: string }>({});
  const timeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // Initialize local state when headers change
  useEffect(() => {
    if (headers && headers.length > 0) {
      const newLocalValues: { [key: number]: string } = {};
      headers.forEach((header, index) => {
        // If header is a technical name (col_0, col_1, etc.) or auto-generated name, display empty string
        // Otherwise display the actual header name
        const isTechnicalName = /^col_\d+$/.test(header) || /^col_\d+_\d+$/.test(header);
        newLocalValues[index] = isTechnicalName ? '' : header || '';
      });
      setLocalHeaderValues(newLocalValues);
    }
  }, [headers, emptyHeaders]);

  // Debounced function to call onColumnAction
  const debouncedColumnAction = useCallback(
    (index: number, oldName: string, newName: string) => {
      if (timeoutRef.current[index]) {
        clearTimeout(timeoutRef.current[index]);
      }

      timeoutRef.current[index] = setTimeout(() => {
        onColumnAction('rename', index, { oldName, newName });
        delete timeoutRef.current[index];
      }, 1500); // 1500ms (1.5 seconds) debounce
    },
    [onColumnAction],
  );

  const columnTypesOptions = typesOptions.map((type) => ({
    label: t(`columnTypes.${type}`),
    value: type,
  }));

  const handleSortClick = (columnKey: string) => {
    const currentState = sortStates[columnKey] || 'none';
    const newState = currentState === 'none' ? 'asc' : currentState === 'asc' ? 'desc' : 'none';

    setSortStates((prev) => ({
      ...prev,
      [columnKey]: newState,
    }));

    if (onSort) {
      onSort(columnKey, newState);
    }
  };

  return (
    <VirtualTableHeader columnVirtualizer={columnVirtualizer} className={styles.header}>
      {editable && (
        <VirtualTableRow
          row={headerRow2}
          className={`${styles.actionRow}`}
          style={{
            width: `${columnVirtualizer.getTotalSize() + INDEX_COLUMN_WIDTH}px`,
          }}
        >
          <div className={`${styles.indexColumn} ${styles.invisibleCell}`}>
            {/* Empty - no row number for action row */}
          </div>

          {columnVirtualizer.getVirtualItems().map((col: VirtualItem) => {
            const key = headers?.[col.index] ?? `col-${col.index}`;
            // Consistent rounding to prevent overlaps
            const startPos = Math.round(col.start + INDEX_COLUMN_WIDTH);
            const endPos = Math.round(col.start + col.size + INDEX_COLUMN_WIDTH);
            const width = endPos - startPos;

            return (
              <VirtualTableCell
                style={{
                  transform: `translateX(${startPos}px)`,
                  width: `${width}px`,
                  minWidth: `${width}px`,
                }}
                key={`actions-${key}`}
                className={styles.virtualCell}
              >
                <div className={styles.columnActionsContainer}>
                  <div className={styles.columnActions}>
                    {isColumnLocked(col.index) && (
                      <Tooltip
                        id={`tooltip-locked-column-${col.index}`}
                        placement="tooltipTop"
                        variant="inverse"
                        content={t('lockedColumnsTypeMessage')}
                      >
                        <LockIcon id={'icon-table-head-lock-' + col.index} width={24} height={24} />
                      </Tooltip>
                    )}

                    <Select
                      id={`select-column-type-${col.index}`}
                      defaultValue={columnTypes[key] === 'Null' ? '' : columnTypes[key]}
                      onChange={(value) => onColumnTypeChange(col.index, value as ColumnType)}
                      placeholder={t('columnTypes.SelectType')}
                      className={styles.tableSelect}
                      disabled={isColumnLocked(col.index)}
                      compact
                    >
                      {columnTypesOptions?.map(({ label, value }) => (
                        <Option key={value} value={value}>
                          {label}
                        </Option>
                      ))}
                    </Select>

                    <TableColumnActions
                      key={key}
                      index={col.index}
                      onColumnAction={onColumnAction}
                      columnTypes={columnTypes}
                      setColumnTypes={(newTypes) => {
                        // TableColumnActions passes the entire columnTypes object
                        // but we need to find which column changed and call onColumnTypeChange
                        const currentColumnKey = headers?.[col.index] ?? `col-${col.index}`;
                        const newType = newTypes[currentColumnKey];
                        if (newType && newType !== columnTypes[currentColumnKey]) {
                          onColumnTypeChange(col.index, newType);
                        }
                      }}
                    />
                  </div>
                </div>
              </VirtualTableCell>
            );
          })}

          {/* Add column button */}
          {columnVirtualizer.getVirtualItems().length > 0 &&
            (() => {
              // Use the last virtual item for consistent positioning
              const virtualItems = columnVirtualizer.getVirtualItems();
              const lastVirtualItem = virtualItems[virtualItems.length - 1];

              return (
                <VirtualTableCell
                  key="add-column-placeholder"
                  style={{
                    position: 'absolute',
                    left: `${lastVirtualItem.start + lastVirtualItem.size + INDEX_COLUMN_WIDTH}px`,
                    top: 0,
                    zIndex: 10,
                  }}
                  className={styles.addColumnRightPlaceholder}
                >
                  {''}
                </VirtualTableCell>
              );
            })()}
        </VirtualTableRow>
      )}
      <VirtualTableRow
        row={headerRow}
        style={
          editable
            ? {
                transform: `translateY(53px)`,
                width: `${columnVirtualizer.getTotalSize() + INDEX_COLUMN_WIDTH}px`,
              }
            : {
                width: `${columnVirtualizer.getTotalSize() + INDEX_COLUMN_WIDTH}px`,
              }
        }
        className={styles.headerRow}
      >
        {editable && (
          <div className={`${styles.indexColumn} ${styles.indexColumnHeader}`}>
            {/* Empty - no row number for header row */}
          </div>
        )}

        {columnVirtualizer.getVirtualItems().map((col: VirtualItem) => {
          const key = headers?.[col.index] ?? `col-${col.index}`;
          // Consistent rounding to prevent overlaps
          const offset = editable ? INDEX_COLUMN_WIDTH : 0;
          const startPos = Math.round(col.start + offset);
          const endPos = Math.round(col.start + col.size + offset);
          const width = endPos - startPos;
          const sortState = sortStates[key] || 'none';

          return (
            <VirtualTableCell
              key={col.key}
              style={{
                transform: `translateX(${startPos}px)`,
                width: `${width}px`,
              }}
              className={`${styles.headerCell} ${styles.virtualCell}`}
            >
              {editable ? (
                <input
                  type="text"
                  id={`input-table-cell-header-${col.index}`}
                  value={
                    localHeaderValues[col.index] ??
                    (emptyHeaders ? '' : ((headers ?? [])[col.index] ?? ''))
                  }
                  placeholder={emptyHeaders ? `Sloupec ${col.index + 1}` : undefined}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    // Immediately update local state for responsive UI
                    setLocalHeaderValues((prev) => ({ ...prev, [col.index]: newValue }));

                    // Debounce the parent callback to prevent excessive re-renders
                    const oldName = emptyHeaders
                      ? `col-${col.index}`
                      : ((headers ?? [])[col.index] ?? '');
                    debouncedColumnAction(col.index, oldName, newValue);
                  }}
                  disabled={false}
                  className={styles.editInputCell}
                />
              ) : !emptyHeaders ? (
                <div className={styles.isSortHeader} style={{ justifyContent: 'left' }}>
                  {(headers ?? [])[col.index]}
                  {sortState === 'asc' && (
                    <ISwapUp
                      id={`icon-virtual-table-sort-up-${col.index}`}
                      width={20}
                      height={20}
                      onClick={() => handleSortClick(key)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {sortState === 'desc' && (
                    <ISwapDown
                      id={`icon-virtual-table-sort-down-${col.index}`}
                      width={20}
                      height={20}
                      onClick={() => handleSortClick(key)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {sortState === 'none' && (
                    <ISwap
                      id={`icon-virtual-table-sort-default-${col.index}`}
                      width={20}
                      height={20}
                      onClick={() => handleSortClick(key)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              ) : (
                String(col.index + 1)
              )}
            </VirtualTableCell>
          );
        })}

        {/* Add column button */}
        {columnVirtualizer.getVirtualItems().length > 0 &&
          editable &&
          (() => {
            // Use the last virtual item for consistent positioning
            const virtualItems = columnVirtualizer.getVirtualItems();
            const lastVirtualItem = virtualItems[virtualItems.length - 1];

            return (
              <VirtualTableCell
                key="add-column"
                style={{
                  position: 'absolute',
                  left: `${lastVirtualItem.start + lastVirtualItem.size + INDEX_COLUMN_WIDTH}px`,
                  top: 0,
                  zIndex: 10,
                }}
                className={styles.addColumnRight}
              >
                <Button
                  id="button-table-head-add-right"
                  variant="unstyled"
                  onClick={() => onColumnAction('right', virtualItems.length - 1)}
                  style={{ display: 'inline-block' }}
                >
                  <AddRightIcon id={'icon-table-head-add-right'} width={24} height={24} />
                </Button>
              </VirtualTableCell>
            );
          })()}
      </VirtualTableRow>
    </VirtualTableHeader>
  );
};
