'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

import AddBelowIcon from '@/core/assets/icons/add_row_below.svg';
import { Button, Text, Tooltip } from '@/design-system/atoms';
import { ColumnType, TableRowType } from '@/design-system/molecules/Table';
import { TableRowActions } from '@/design-system/molecules/Table/actions/TableRowActions';
import VirtualTableBody from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableBody';
import VirtualTableCell from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableCell';
import VirtualTableRow from '@/design-system/molecules/VirtualTable/VirtualComponents/VirtualTableRow';

import styles from '../CodelistTab.module.css';
import { INDEX_COLUMN_WIDTH } from '../constants';

interface CodelistTableBodyProps {
  editable?: boolean;
  headers?: string[];
  tableData: TableRowType[];
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
  emptyHeaders: boolean;
  isTableCellDisabled: (index?: number) => boolean;
  validateCell: (rowIndex: number, columnKey: string, value: string) => boolean;
  onDataChange: (newData: TableRowType[]) => void;
  onBlur: (newRow: TableRowType) => void;
  onRowAction: (action: string, rowIndex: number) => void;
  columnTypes: { [key: string]: ColumnType }; // Add this prop
}

export const CodelistTableBody = ({
  editable,
  headers,
  tableData,
  rowVirtualizer,
  columnVirtualizer,
  emptyHeaders,
  isTableCellDisabled,
  validateCell,
  onDataChange,
  onRowAction,
  onBlur,
  columnTypes, // Add this prop
}: CodelistTableBodyProps) => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const t = useTranslations('CSCTabsContainer.codelistTab');

  const renderCellContent = (row: VirtualItem, col: VirtualItem) => {
    const rowData = tableData[row.index];
    const columnKey = headers?.[col.index] ?? `col-${col.index}`;
    const value = rowData && columnKey ? rowData[columnKey] : '';
    const columnType = columnTypes[columnKey];
    const cellKey = `${row.index}-${columnKey}`;
    const hasError = validationErrors[cellKey];

    if (!editable) {
      const text =
        value instanceof Date
          ? value.toLocaleDateString('cs-CZ')
          : value !== null && value !== undefined
            ? value.toString()
            : '';

      return text.length > 25 ? (
        <Tooltip
          placement="tooltipRight"
          variant="inverse"
          content={text}
          id={`tooltip-table-truncated-text-${row.index}-${col.index}`}
        >
          <Text variant="body" regular>
            {text.slice(0, 25)}...
          </Text>
        </Tooltip>
      ) : (
        <Text variant="body" regular>
          {text}
        </Text>
      );
    }

    const getPlaceholder = () => {
      switch (columnType) {
        case 'Integer':
          return t('placeholders.enterNumber');
        case 'DateTime':
          return t('placeholders.dateFormat');
        case 'String':
          return t('placeholders.enterText');
        default:
          return '';
      }
    };

    const formatDisplayValue = () => {
      if (value instanceof Date) {
        return value.toLocaleDateString('cs-CZ');
      }

      // Handle date strings in various formats for DateTime columns
      if (columnType === 'DateTime' && value && typeof value === 'string') {
        // Check if it's already in DD.MM.YYYY format
        if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(value)) {
          return value;
        }

        // Check if it's in YYYY-MM-DD format (from API)
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const [year, month, day] = value.split('-');

          return `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`;
        }

        // Check if it's in YYYYMMDD format
        if (/^\d{8}$/.test(value)) {
          const day = value.slice(0, 2);
          const month = value.slice(2, 4);
          const year = value.slice(4, 8);

          return `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`;
        }
      }

      return value !== null && value !== undefined ? value.toString() : '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Validate the input based on column type
      const isValid = validateCell(row.index, columnKey, newValue);

      // Update validation error state
      setValidationErrors((prev) => ({
        ...prev,
        [cellKey]: !isValid,
      }));

      // Update table data
      const newTableData = [...tableData];
      if (!newTableData[row.index]) {
        newTableData[row.index] = { rowId: row.index };
      }
      // Process value based on column type
      let processedValue: any = newValue;

      if (columnType === 'Integer' && newValue !== '') {
        if (!isNaN(Number(newValue))) {
          processedValue = newValue;
        }
      } else if (columnType === 'DateTime' && newValue !== '') {
        // Keep as string in DD.MM.YYYY format for display
        processedValue = newValue;
      }

      newTableData[row.index] = {
        ...newTableData[row.index],
        rowId: row.index,
        [columnKey]: processedValue,
      };
      onDataChange(newTableData);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // For DateTime columns, format input as DD.MM.YYYY
      if (columnType === 'DateTime') {
        const target = e.target as HTMLInputElement;
        const currentValue = target.value;

        // Auto-add dots for date formatting
        if (/^\d$/.test(e.key)) {
          if (currentValue.length === 2 || currentValue.length === 5) {
            target.value = currentValue + '.' + e.key;
            e.preventDefault();

            // Trigger change event manually
            const changeEvent = new Event('input', { bubbles: true });
            target.dispatchEvent(changeEvent);
          }
        }
      }
    };
    const handleBlur = (_e: React.FocusEvent<HTMLInputElement, Element>) => {
      const updatedRow = tableData[row.index] ?? { id: row.index };
      onBlur(updatedRow);
    };

    return (
      <input
        type="text"
        id={`input-table-cell-content-${row.index}-${col.index}`}
        value={formatDisplayValue()}
        placeholder={getPlaceholder()}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isTableCellDisabled(col.index) || emptyHeaders}
        className={`${styles.editInputCell} ${hasError ? styles.errorInput : ''}`}
        style={{
          borderColor: hasError ? '#ef4444' : undefined,
          backgroundColor: hasError ? '#fef2f2' : undefined,
        }}
      />
    );
  };

  return (
    <VirtualTableBody
      rowVirtualizer={rowVirtualizer}
      columnVirtualizer={columnVirtualizer}
      className={styles.bodyContainer}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: `${columnVirtualizer.getTotalSize()}px`,
        transform: `translateY(${editable ? 54 : 19}px)`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((row: VirtualItem) => (
        <VirtualTableRow key={row.key} row={row} className={styles.bodyRow}>
          {/* Index column with row numbering */}
          {editable && (
            <div className={`${styles.indexColumn} ${styles.indexColumnCell}`}>{row.index + 1}</div>
          )}

          {columnVirtualizer.getVirtualItems().map((col: VirtualItem) => {
            // Consistent rounding to prevent overlaps
            const offset = editable ? INDEX_COLUMN_WIDTH : 0;
            const startPos = Math.round(col.start + offset);
            const endPos = Math.round(col.start + col.size + offset);
            const width = endPos - startPos;

            return (
              <VirtualTableCell
                key={col.key}
                style={{
                  transform: `translateX(${startPos}px)`,
                  width: `${width}px`,
                }}
                className={`${styles.bodyCell} ${styles.virtualCell} ${editable ? styles.editableCell : ''}`}
              >
                {renderCellContent(row, col)}
              </VirtualTableCell>
            );
          })}

          {/* Row actions */}
          {columnVirtualizer.getVirtualItems().length > 0 &&
            editable &&
            (() => {
              // Use the last virtual item for consistent positioning
              const virtualItems = columnVirtualizer.getVirtualItems();
              const lastVirtualItem = virtualItems[virtualItems.length - 1];

              return (
                <VirtualTableCell
                  key="row-actions"
                  style={{
                    position: 'absolute',
                    left: `${lastVirtualItem.start + lastVirtualItem.size + INDEX_COLUMN_WIDTH}px`,
                    top: 0,
                    zIndex: 999,
                    minWidth: '66px',
                  }}
                  className={styles.rowActionButtons}
                >
                  <TableRowActions index={row.index ?? 0} onRowAction={onRowAction} />
                </VirtualTableCell>
              );
            })()}
        </VirtualTableRow>
      ))}

      {/* Add row button */}
      {editable &&
        tableData.length > 0 &&
        (() => {
          const lastRowIndex = tableData.length - 1;
          const lastRowVirtualItem = rowVirtualizer
            .getVirtualItems()
            .find((item: VirtualItem) => item.index === lastRowIndex);
          const lastRowOffset = lastRowVirtualItem?.start ?? lastRowIndex * 55;
          const lastRowSize = lastRowVirtualItem?.size ?? 54;

          return (
            <VirtualTableRow
              key="add-row"
              row={{
                index: tableData.length,
                start: lastRowOffset + lastRowSize,
                size: 54,
                key: 'add-row',
                end: lastRowOffset + lastRowSize + 54,
                lane: 0,
              }}
              className={styles.bodyRow}
            >
              {/* Index column with add button */}
              <div
                className={`${styles.indexColumn} ${styles.indexColumnCell}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Button
                  id="button-table-body-add-below"
                  variant="unstyled"
                  onClick={() => onRowAction('below', lastRowIndex)}
                  className={styles.rowActionButton}
                >
                  <AddBelowIcon id="icon-table-body-add-below" width={20} height={20} />
                </Button>
              </div>

              {/* Empty cells for data columns */}
              {columnVirtualizer.getVirtualItems().map((col: VirtualItem) => {
                // Consistent rounding to prevent overlaps
                const startPos = Math.round(col.start + INDEX_COLUMN_WIDTH);
                const endPos = Math.round(col.start + col.size + INDEX_COLUMN_WIDTH);
                const width = endPos - startPos;

                return (
                  <VirtualTableCell
                    key={col.key}
                    style={{
                      transform: `translateX(${startPos}px)`,
                      width: `${width}px`,
                    }}
                    className={`${styles.bodyCell} ${styles.virtualCell} ${editable ? styles.editableCell : ''}`}
                    children={null}
                  />
                );
              })}
            </VirtualTableRow>
          );
        })()}
    </VirtualTableBody>
  );
};
