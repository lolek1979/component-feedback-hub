'use client';

import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import AddBelowIcon from '@/core/assets/icons/add_row_below.svg';
import { Button } from '@/design-system/atoms/Button';
import { HelperText } from '@/design-system/atoms/HelperText';

import { ColumnType } from '../Table';
import styles from '../Table.module.css';
import { TableCell, TableRow } from './index';

/**
 * Props for the TableBody component.
 *
 * @template T - Type of the table row data.
 * @property data - Array of row data objects.
 * @property headers - Array of column keys.
 * @property onRowAction - Callback when a row action is triggered.
 * @property children - Custom content to render if no headers.
 * @property className - Additional CSS class for tbody.
 * @property setTableData - Callback to update table data.
 * @property tableData - Controlled table data array.
 * @property columnTypes - Object mapping column keys to their types.
 * @property currentPage - Current page number for pagination.
 * @property rowsPerPage - Number of rows per page.
 * @property disabledCell - Function to determine if a cell is disabled.
 * @property editable - Whether the table is in editable mode.
 */
interface TableBodyProps<T> {
  data?: T[];
  headers?: string[];
  onRowAction?: (action: string, rowIndex: number) => void;
  children?: React.ReactNode;
  className?: string;
  setTableData?: (data: T[]) => void;
  tableData?: T[];
  columnTypes?: { [key: string]: ColumnType };
  currentPage?: number;
  rowsPerPage?: number;
  disabledCell?: (columnIndex?: number) => boolean;
  editable?: boolean;
}

/**
 * TableBody renders the body of a table with rows and cells.
 *
 * Handles cell validation, editable mode, pagination, and row actions.
 *
 * @template T - Type of the table row data.
 * @param props TableBodyProps<T>
 * @returns React component
 */
export const TableBody = <T extends object>({
  data = [],
  headers = [],
  onRowAction,
  children,
  className = '',
  setTableData,
  tableData,
  columnTypes = {},
  currentPage,
  rowsPerPage,
  disabledCell,
  editable = false,
}: TableBodyProps<T>) => {
  const [cellValidity, setCellValidity] = useState<{ [key: string]: boolean }>({});
  const rowsToDisplay = data;
  const t = useTranslations('TableErrors');
  const isValidDecimal = useCallback((value: string) => !isNaN(Number(value)) || value === '', []);
  const isValidDate = useCallback((value: string) => {
    if (value === '') return true;
    const datePattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const match = value.match(datePattern);
    if (!match) return false;

    const [_, dayStr, monthStr, yearStr] = match;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, []);

  const validateCell = useCallback(
    (rowIndex: number, columnKey: string, value: string): ReactElement<any> | null => {
      const type = columnTypes[columnKey];
      const cellKey = `${rowIndex}-${columnKey}`;

      let isValid = true;
      if (type === 'Decimal' && !isValidDecimal(value)) {
        isValid = false;
      }
      if (type === 'DateTime' && !isValidDate(value)) {
        isValid = false;
      }

      setCellValidity((prev) => {
        if (prev[cellKey] !== isValid) {
          return { ...prev, [cellKey]: isValid };
        }

        return prev;
      });

      return isValid ? null : (
        <HelperText
          id={
            type === 'Decimal'
              ? 'message-validation-invalidNumber-' + value
              : 'message-validation-invalidDate-' + value
          }
          text={t(type === 'Decimal' ? 'invalidNumber' : 'invalidDate')}
          variant="error"
        />
      );
    },
    [columnTypes, isValidDecimal, isValidDate, t],
  );

  useEffect(() => {
    if (Object.keys(cellValidity).length > 0) {
      setCellValidity((prev) => {
        const newValidity = { ...prev };
        let hasChanges = false;

        Object.keys(newValidity).forEach((key) => {
          const [rowIdx, colKey] = key.split('-');
          const rowIndex = parseInt(rowIdx, 10);

          if (!headers.includes(colKey) || rowIndex >= (tableData?.length || 0)) {
            delete newValidity[key];
            hasChanges = true;
          }
        });

        return hasChanges ? newValidity : prev;
      });
    }
  }, [headers, tableData?.length, cellValidity]);

  const getActualRowIndex = (displayIndex: number): number => {
    if (editable) return displayIndex;

    return (currentPage! - 1) * rowsPerPage! + displayIndex;
  };

  return (
    <tbody className={className}>
      {headers.length > 0
        ? rowsToDisplay.map((item, index) => (
            <TableRow key={index} index={getActualRowIndex(index)} onRowAction={onRowAction}>
              {headers.map((key, columnIndex) => {
                const cellValue = String(item[key as keyof T]);

                return (
                  <TableCell
                    key={key}
                    rowIndex={index}
                    actualRowIndex={getActualRowIndex(index)}
                    columnKey={key}
                    columnIndex={columnIndex}
                    setTableData={setTableData}
                    tableData={tableData}
                    columnType={columnTypes[key]}
                    validateCell={validateCell}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    disabledCell={disabledCell}
                  >
                    {cellValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        : children}
      {editable && tableData && (
        <tr>
          <td className={styles.insertRowButton}>
            <Button
              id="button-table-body-add-below"
              variant="unstyled"
              onClick={() => onRowAction?.('below', tableData.length - 1)}
            >
              <AddBelowIcon id="icon-table-body-add-below" width={24} height={24} />
            </Button>
          </td>
        </tr>
      )}
    </tbody>
  );
};
