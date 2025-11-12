'use client';

import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import ISwap from '@/core/assets/icons/swap_vert.svg';
import ISwapDown from '@/core/assets/icons/swap_vert_down.svg';
import ISwapUp from '@/core/assets/icons/swap_vert_up.svg';
import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { Checkbox, Text, Tooltip } from '@/design-system/atoms';

import { TableContext } from '../Table';
import styles from '../Table.module.css';

const COLUMN_PATTERN = /^col_\d+(_\d+)?$/;

/**
 * Theme options for table cell styling.
 *
 * @property headerBgColor - Background color for header cells.
 * @property headerTextColor - Text color for header cells.
 * @property bodyBgColor - Background color for body cells.
 * @property bodyTextColor - Text color for body cells.
 * @property borderColor - Border color for cells.
 */
export interface TableTheme {
  headerBgColor?: string;
  headerTextColor?: string;
  bodyBgColor?: string;
  bodyTextColor?: string;
  borderColor?: string;
}

/**
 * Props for the TableCell component.
 *
 * @template T - Type of the table row data.
 * @property children - Content to render inside the cell.
 * @property isHeader - Whether the cell is a header cell.
 * @property isSort - Whether the cell supports sorting.
 * @property isChecked - Whether the cell's checkbox is checked.
 * @property onCheckChange - Callback when checkbox state changes.
 * @property align - Text alignment ('left', 'center', 'right').
 * @property className - Additional CSS class for the cell.
 * @property onClick - Callback when sort state changes.
 * @property hasActions - Whether the cell contains action buttons.
 * @property rowIndex - Index of the row.
 * @property actualRowIndex - Actual index in the data array (for pagination).
 * @property columnKey - Key of the column.
 * @property setTableData - Callback to update table data.
 * @property tableData - Controlled table data array.
 * @property columnType - Type of the column.
 * @property validateCell - Function to validate cell value.
 * @property onChange - Callback when cell value changes.
 * @property currentPage - Current page number for pagination.
 * @property rowsPerPage - Number of rows per page.
 * @property columnIndex - Index of the column.
 * @property disabledCell - Function to determine if a cell is disabled.
 */
interface TableCellProps<T> {
  children?: React.ReactNode;
  isHeader?: boolean;
  isSort?: boolean;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
  onClick?: (sortState: 'asc' | 'desc' | 'none') => void;
  hasActions?: boolean;
  rowIndex?: number;
  actualRowIndex?: number;
  columnKey?: string;
  setTableData?: (data: T[]) => void;
  tableData?: T[];
  columnType?: string;
  validateCell?: (rowIndex: number, columnKey: string, value: string) => ReactElement<any> | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage?: number;
  rowsPerPage?: number;
  columnIndex?: number;
  disabledCell?: (columnIndex?: number) => boolean;
}

/**
 * TableCell renders a table cell with support for editable mode, sorting, validation, and custom styling.
 *
 * Handles input changes, checkbox selection, sorting icons, and cell validation.
 *
 * @template T - Type of the table row data.
 * @param props TableCellProps<T>
 * @returns React component
 */
export const TableCell = <T extends object>({
  children,
  isHeader = false,
  align = 'left',
  className = '',
  hasActions,
  rowIndex,
  actualRowIndex,
  columnKey,
  setTableData,
  tableData,
  columnType,
  isSort = false,
  isChecked = false,
  onCheckChange,
  onClick,
  validateCell,
  onChange,
  currentPage = 1,
  rowsPerPage = 5,
  columnIndex,
  disabledCell,
}: TableCellProps<T>) => {
  const t = useTranslations('Table');
  const theme: TableTheme = {};
  const { updateUnsavedChanges } = useUnsavedChanges();
  const { editable } = useContext(TableContext);
  const [sortState, setSortState] = useState<'asc' | 'desc' | 'none'>('asc');
  const [error, setError] = useState<ReactElement<any> | null>(null);
  const isDisabled = disabledCell && disabledCell(columnIndex);

  const initialValue = useRef(children?.valueOf() as string);
  const [inputValue, setInputValue] = useState(initialValue.current);

  useEffect(() => {
    if (validateCell && rowIndex !== undefined && columnKey && inputValue !== undefined) {
      const validationError = validateCell(rowIndex, columnKey, inputValue || '');
      setError(validationError);
    }
  }, [validateCell, rowIndex, columnKey, inputValue]);

  useEffect(() => {
    const newValue = children?.valueOf() as string;
    if (initialValue.current !== newValue) {
      initialValue.current = newValue;
      if (inputValue !== newValue) {
        setInputValue(newValue);
      }
    }
  }, [children, inputValue]);

  useEffect(() => {
    if (rowIndex === undefined || !columnKey || !tableData || tableData.length === 0) {
      return;
    }

    const actualIdx =
      actualRowIndex !== undefined ? actualRowIndex : (currentPage - 1) * rowsPerPage + rowIndex;

    if (actualIdx < 0 || actualIdx >= tableData.length) {
      return;
    }

    const row = tableData[actualIdx];
    if (!row || Array.isArray(row)) {
      return;
    }

    const cellValue = (row as Record<string, any>)[columnKey];
    let formattedValue = '';

    if (cellValue instanceof Date) {
      formattedValue = cellValue.toLocaleString('cs-CZ');
    } else if (cellValue != null) {
      formattedValue = String(cellValue);
    }

    if (inputValue !== formattedValue) {
      setInputValue(formattedValue);
    }
  }, [tableData, rowIndex, actualRowIndex, columnKey, currentPage, rowsPerPage, inputValue]);

  const themeColor = () => {
    const isDarkMode = document.body.classList.contains('dark');

    return isDarkMode ? 'var(--color-black-950)' : 'var(--color-white)';
  };

  const style = {
    textAlign: align,
    backgroundColor:
      isHeader && hasActions && className !== styles.insertColumnButton
        ? themeColor()
        : isHeader
          ? theme?.headerBgColor
          : theme?.bodyBgColor,
    color: isHeader ? theme?.headerTextColor : theme?.bodyTextColor,
    fontWeight: 400,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    updateUnsavedChanges(true);

    if (onChange) {
      onChange(event);
    } else if (setTableData && tableData && rowIndex !== undefined && columnKey) {
      const actualIdx =
        actualRowIndex !== undefined ? actualRowIndex : (currentPage - 1) * rowsPerPage + rowIndex;

      const updatedData = [...tableData];
      if (actualIdx >= 0 && actualIdx < updatedData.length) {
        updatedData[actualIdx] = {
          ...updatedData[actualIdx],
          [columnKey]: newValue,
        };
        setTableData(updatedData);
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckChange?.(e.target.checked);
    if ((children as React.ReactElement<any>).props.onChange) {
      (children as React.ReactElement<any>).props.onChange(e);
    }
  };

  const handleSortClick = () => {
    const newSortState = sortState === 'none' ? 'asc' : sortState === 'asc' ? 'desc' : 'none';
    setSortState(newSortState);
    if (onClick) {
      onClick(newSortState);
    }
  };

  const renderTableCellValue = (text: string | undefined) => {
    if (!text) {
      return <span></span>;
    }

    if (isHeader && text.match(/^col_\d+_\d+$/)) {
      return <span></span>;
    }

    return text.length > 25 ? (
      <Tooltip
        placement="tooltipRight"
        variant="inverse"
        content={text}
        id={`tooltip-table-truncated-text-${columnKey}`}
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
  };

  const renderInput = (title: string) => {
    const displayValue = inputValue ?? '';
    // For autogenerated headers, show empty input
    if (isHeader && inputValue?.match(/^col_\d+_\d+$/)) {
      return (
        <input
          className={styles.editInputCell}
          value=""
          placeholder={t('columnHeaderPlaceholder')}
          name={`${title}-${inputValue}`}
          type="text"
          aria-label={title}
          disabled={isDisabled}
          id={`input-table-cell-header-${columnIndex}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
            updateUnsavedChanges(true);
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            if (onChange && e.target.value !== children) {
              onChange({
                ...e,
                target: e.target,
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
        />
      );
    }

    const inputProps = {
      className: styles.editInputCell,
      value: displayValue,
      placeholder: isHeader
        ? t('columnHeaderPlaceholder')
        : columnType === 'DateTime'
          ? 'DD.MM.YYYY'
          : '',
      name: `${title}-${displayValue}`,
      type: columnType === 'Integer' && !isHeader ? 'number' : 'text',
      'aria-label': title,
      disabled: isDisabled,
      id: isHeader
        ? `input-table-cell-header-${rowIndex}-${columnIndex}`
        : `input-table-cell-body-${rowIndex}-${columnIndex}`,
      ...(isHeader
        ? {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setInputValue(e.target.value);
              updateUnsavedChanges(true);
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
              if (onChange && e.target.value !== children) {
                onChange({
                  ...e,
                  target: e.target,
                } as React.ChangeEvent<HTMLInputElement>);
              }
            },
          }
        : {
            onChange: handleChange,
          }),
    };

    return isDisabled ? (
      <Tooltip
        placement="tooltipTopEnd"
        variant="inverse"
        content={t('missedColumnTypeMessage')}
        id={`tooltip-table-disabled-input-${rowIndex}-${columnIndex}`}
      >
        <input {...inputProps} />
      </Tooltip>
    ) : (
      <input {...inputProps} />
    );
  };

  if (children && React.isValidElement(children) && children.type === Checkbox) {
    return isHeader ? (
      <th style={style} className={`${className} is-checked ${styles.checkboxColumn}`}>
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange}
          id={`checkbox-header-${columnIndex || 0}`}
          label={`checkbox-header-${columnIndex || 0}`}
          isMultiselect={true}
        />
      </th>
    ) : (
      <td style={{ ...style }} className={className}>
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange}
          id={`checkbox-row-${rowIndex || 0}-${columnIndex || 0}`}
          label={`checkbox-row-${rowIndex || 0}`}
        />
      </td>
    );
  }

  return isHeader ? (
    <th style={style} className={`${className}${isChecked ? ' is-checked' : ''}`}>
      {editable ? (
        !hasActions ? (
          renderInput('header cell')
        ) : (
          children
        )
      ) : isSort ? (
        <div style={{ justifyContent: align }} className={styles.isSortHeader}>
          {typeof children === 'string' && COLUMN_PATTERN.test(children)
            ? ''
            : typeof children === 'string'
              ? renderTableCellValue(children)
              : children}
          {sortState === 'asc' && (
            <ISwapUp
              id={'icon-table-cell-sort-up-' + columnIndex}
              width={20}
              height={20}
              onClick={handleSortClick}
            />
          )}
          {sortState === 'desc' && (
            <ISwapDown
              id={'icon-table-cell-sort-down-' + columnIndex}
              width={20}
              height={20}
              onClick={handleSortClick}
            />
          )}
          {sortState === 'none' && (
            <ISwap
              id={'icon-table-cell-sort-default-' + columnIndex}
              width={20}
              height={20}
              onClick={handleSortClick}
            />
          )}
        </div>
      ) : typeof children === 'string' && COLUMN_PATTERN.test(children) ? (
        ''
      ) : typeof children === 'string' ? (
        renderTableCellValue(children)
      ) : (
        children
      )}
    </th>
  ) : (
    <td style={style} className={className}>
      {editable ? renderInput('body cell') : renderTableCellValue(inputValue)}
      {error}
    </td>
  );
};
