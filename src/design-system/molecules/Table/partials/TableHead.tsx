'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import AddRightIcon from '@/core/assets/icons/add_column_right.svg';
import LockIcon from '@/core/assets/icons/lock.svg';
// TODO: Move this type to a shared location in core or domains
import { SortDirection } from '@/core/utils/types';
import { Button, Option, Select, Tooltip } from '@/design-system/atoms';
import selectStyles from '@/design-system/atoms/Select/Select.module.css';
import { toast } from '@/design-system/molecules/Toast';

import { TableColumnActions } from '../actions/TableColumnActions';
import { ColumnType, setColumnTypes, TableContext } from '../Table';
import styles from '../Table.module.css';
import { TableCell, TableRow } from './index';
import { TableSettingsPopover } from './TableSettingsPopover';

const typesOptions = ['String', 'DateTime', 'Integer'];

/**
 * Props for the TableHead component.
 *
 * @property tableSettingKeys - Array of objects for table setting options (label and value).
 * @property onColumnAction - Callback when a column action is triggered.
 * @property children - Custom content to render in the table head.
 * @property hasActions - Whether the table has action columns.
 * @property className - Additional CSS class for thead.
 * @property headers - Array of column keys.
 * @property columnTypes - Object mapping column keys to their types.
 * @property setColumnTypes - Callback to update column types.
 * @property disabledKeys - Array of column keys that are disabled.
 * @property handleOptionsChange - Callback when table setting options change.
 * @property currentPage - Current page number for pagination.
 * @property rowsPerPage - Number of rows per page.
 * @property updateColumnNames - Callback to update column names.
 * @property setSaveKeys - Callback to set keys for saving.
 * @property emptyHeaders - Whether to render empty headers.
 * @property sortDirection - Callback for sorting columns.
 * @property isColumnLocked - Function to determine if a column is locked.
 */
interface TableHeadProps {
  tableSettingKeys?: Array<{
    label: string;
    value: string;
  }>;
  onColumnAction?: (action: string, columnIndex: number, options?: any) => void;
  children?: React.ReactNode;
  hasActions?: boolean;
  className?: string;
  headers?: string[];
  columnTypes?: { [key: string]: ColumnType };
  setColumnTypes?: setColumnTypes;
  disabledKeys?: string[];
  handleOptionsChange?: (keys: string[]) => void;
  currentPage?: number;
  rowsPerPage?: number;
  updateColumnNames?: (columnNames: string[]) => void;
  setSaveKeys?: (saveKeys: string[]) => void;
  emptyHeaders?: boolean;
  sortDirection?: (column: string, direction: SortDirection) => void;
  isColumnLocked?: (columnIndex: number) => boolean;
}

/**
 * TableHead renders the header of a table with column names, types, and actions.
 *
 * Handles editable mode, column type selection, renaming, sorting, and settings popover.
 *
 * @param props TableHeadProps
 * @returns React component
 */
export const TableHead = ({
  children,
  onColumnAction = () => {},
  hasActions,
  className = '',
  headers,
  columnTypes = {},
  setColumnTypes,
  disabledKeys,
  tableSettingKeys,
  handleOptionsChange = () => {},
  currentPage,
  rowsPerPage,
  updateColumnNames,
  setSaveKeys,
  emptyHeaders = false,
  sortDirection,
  isColumnLocked,
}: TableHeadProps) => {
  const { editable } = useContext(TableContext);
  const t = useTranslations('Table');
  const columnTypesOptions = typesOptions.map((type) => ({
    label: t(`columnTypes.${type}`),
    value: type,
  }));

  const [newStructureKeys, setNewStructureKeys] = useState<string[]>(headers || []);
  const prevHeadersRef = useRef<string[]>(headers || []);

  useEffect(() => {
    if (!headers) return;

    const headersChanged = JSON.stringify(prevHeadersRef.current) !== JSON.stringify(headers);
    const localStateOutOfSync = JSON.stringify(newStructureKeys) !== JSON.stringify(headers);

    if (headersChanged && localStateOutOfSync) {
      prevHeadersRef.current = [...headers];
      setNewStructureKeys([...headers]);

      if (setSaveKeys) {
        setSaveKeys([...headers]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers, setSaveKeys]);

  // Notify parent when local headers change
  useEffect(() => {
    if (!newStructureKeys || !updateColumnNames) return;

    const localChanges =
      JSON.stringify(prevHeadersRef.current) !== JSON.stringify(newStructureKeys);

    if (localChanges) {
      updateColumnNames([...newStructureKeys]);

      if (setSaveKeys) {
        setSaveKeys([...newStructureKeys]);
      }

      prevHeadersRef.current = [...newStructureKeys];
    }
  }, [newStructureKeys, updateColumnNames, setSaveKeys]);

  const handleColumnTypeChange = (key: string, value: string) => {
    setColumnTypes &&
      setColumnTypes((prev: { [key: string]: ColumnType }) => ({
        ...prev,
        [key]: value as ColumnType,
      }));
  };

  const handleHeaderInputChange = (index: number, value: string) => {
    if (!newStructureKeys || index < 0 || index >= newStructureKeys.length) return;

    const updatedKeys = [...newStructureKeys];
    const oldKey = updatedKeys[index];

    if (oldKey === value) return;

    if (updatedKeys.includes(value) && updatedKeys.indexOf(value) !== index) {
      toast.dismiss();
      toast.error(t('duplicateColumns') + value, {
        id: `toast-tableHead-duplicateColumns-${index}`,
      });

      return;
    }

    updatedKeys[index] = value;
    setNewStructureKeys(updatedKeys);

    if (updateColumnNames) {
      updateColumnNames(updatedKeys);
    }

    if (setSaveKeys) {
      setSaveKeys(updatedKeys);
    }

    if (onColumnAction) {
      onColumnAction('rename', index, {
        oldName: oldKey,
        newName: value,
        immediateUpdate: true,
      });
    }
  };

  return (
    <thead className={className}>
      {headers ? (
        <>
          {editable ? (
            <>
              <TableRow isHeader noBackground>
                {headers.map((key, index) => (
                  <TableCell
                    key={`actions-${key}`}
                    isHeader
                    align="right"
                    hasActions={editable}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                  >
                    <div className={styles.columnActionsContainer}>
                      {editable && (
                        <div className={styles.columnActions}>
                          {isColumnLocked && isColumnLocked(index) && (
                            <Tooltip
                              id={`tooltip-locked-column-${index}`}
                              placement="tooltipTop"
                              variant="inverse"
                              content={t('lockedColumnsTypeMessage')}
                            >
                              <LockIcon
                                id={'icon-table-head-lock-' + index}
                                width={24}
                                height={24}
                              />
                            </Tooltip>
                          )}

                          <Select
                            id={`select-column-type-${index}`}
                            defaultValue={columnTypes[key] === 'Null' ? '' : columnTypes[key]}
                            onChange={(value) => handleColumnTypeChange(key, value)}
                            placeholder={t('columnTypes.SelectType')}
                            className={selectStyles.tableSelect}
                            disabled={isColumnLocked && isColumnLocked(index)}
                          >
                            {columnTypesOptions?.map(({ label, value }) => (
                              <Option key={value} value={value}>
                                {label}
                              </Option>
                            ))}
                          </Select>

                          <TableColumnActions
                            key={key}
                            index={index}
                            onColumnAction={onColumnAction}
                            columnTypes={columnTypes}
                            setColumnTypes={setColumnTypes}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              <TableRow isHeader>
                {headers.map((key, index) => (
                  <TableCell
                    key={`action-${key}`}
                    isHeader
                    hasActions={hasActions}
                    columnKey={key}
                    columnType={columnTypes[key]}
                    columnIndex={index}
                    onChange={(e) => handleHeaderInputChange(index, e.target.value)}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                  >
                    {!emptyHeaders ? key : null}
                  </TableCell>
                ))}
                <TableCell
                  isHeader
                  align="right"
                  hasActions={editable}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  className={styles.insertColumnButton}
                >
                  <div>
                    <Button
                      id="button-table-head-add-right"
                      variant="unstyled"
                      onClick={() => onColumnAction('right', headers.length - 1)}
                      style={{ display: 'inline-block' }}
                    >
                      <AddRightIcon id={'icon-table-head-add-right'} width={24} height={24} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow isHeader>
              {headers.map((key) => (
                <TableCell
                  key={key}
                  isHeader
                  isSort={!emptyHeaders}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  onClick={(direction) => sortDirection && sortDirection(key, direction)}
                >
                  {!emptyHeaders ? key : null}
                </TableCell>
              ))}

              <TableCell
                isHeader
                align="right"
                hasActions={hasActions}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              >
                {!editable && (
                  <TableSettingsPopover
                    key="settings"
                    onOptionsChange={handleOptionsChange}
                    keys={tableSettingKeys}
                    disabledItems={disabledKeys}
                  />
                )}
                <div></div>
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        children
      )}
    </thead>
  );
};
