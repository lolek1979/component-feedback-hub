/**
 * @module components/molecules/Table
 * @group Data Display
 */

'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import Iinfo from '@/core/assets/icons/info.svg';
import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { InlineMessage } from '@/design-system/molecules';

import { ConfirmModal } from './actions/ConfirmModal';
import { TableBody, TableHead } from './partials';
import styles from './Table.module.css';

export const columnTypes = {
  String: 'String',
  DateTime: 'DateTime',
  Decimal: 'Decimal',
  Integer: 'Integer',
  Null: 'Null',
} as const;

/**
 * Type representing possible column data types in the table
 * Can be one of: String, Integer, DateTime, or Null
 * Used to determine sorting and rendering behavior for columns
 */
export type ColumnType = (typeof columnTypes)[keyof typeof columnTypes];

/**
 * Type representing a row of data in the table
 * Keys are column identifiers and values can be string, number, Date, or null
 * @example
 * const row: TableRowType = {
 *   name: 'John Doe',
 *   age: 30,
 *   birthDate: new Date('1993-05-12'),
 *   notes: null
 * };
 */
export type TableRowType = {
  rowId: number;
} & Record<string, string | number | Date | null>;

/**
 * Function type for updating column types in the table
 * @param types - Either an object mapping column names to their types,
 *                or a function that receives previous types and returns updated types
 */
export type setColumnTypes = (
  types:
    | { [key: string]: ColumnType }
    | ((prev: { [key: string]: ColumnType }) => {
        [key: string]: ColumnType;
      }),
) => void;

/**
 * Type representing possible sort directions for table columns
 * - 'asc': Ascending order (A→Z, 0→9)
 * - 'desc': Descending order (Z→A, 9→0)
 * - 'none': No sorting applied (default order)
 */
type SortDirection = 'asc' | 'desc' | 'none';

/**
 * Interface representing the context properties for the Table component
 * Provides shared state and functions to table subcomponents
 */
interface tableContextProps {
  /** Whether table is in editable mode allowing content modifications */
  editable: boolean;
  /** Whether table rows can have action buttons */
  hasRowActions: boolean;
  /** Whether table has general action capabilities */
  hasActions: boolean;
  /** Current options state for column visibility and settings */
  options: { [key: string]: boolean };
  /** Function to update options configuration */
  setOptions: (options: { [key: string]: boolean }) => void;
  /** Number of rows to display per page */
  pageSize: number;
  /** Function to change the number of rows per page */
  setPageSize: (size: number) => void;
  /** Current active page number */
  currentPage: number;
  /** Function to change the current page */
  setCurrentPage: (page: number) => void;
}

export const TableContext = createContext<tableContextProps>({
  editable: false,
  hasRowActions: false,
  hasActions: false,
  options: {},
  setOptions: () => {},
  pageSize: 5,
  setPageSize: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
});

interface ColumnRenameOptions {
  oldName: string;
  newName: string;
  immediateUpdate?: boolean;
}

/**
 * A highly customizable table component with sorting, pagination, and editing capabilities.
 *
 * @remarks
 * This table component supports:
 * - Client-side sorting
 * - Pagination
 * - Row and column editing
 * - Custom theming
 * - Type-safe column definitions
 * - Context-based configuration
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Table
 *   data={users}
 *   columnTypes={{
 *     id: 'Decimal',
 *     name: 'String',
 *     createdAt: 'DateTime'
 *   }}
 *   footer
 * />
 * ```
 *
 * @example
 * Editable table:
 * ```tsx
 * const [data, setData] = useState<TableRowType[]>(initialData);
 *
 * <Table
 *   data={data}
 *   editable
 *   setTableData={setData}
 *   columnTypes={columnTypes}
 *   setColumnTypes={setColumnTypes}
 * />
 * ```
 *
 * @param props - {@link TableProps} Component properties
 * @param props.data - Array of data objects to display in the table
 * @param props.children - Custom content to display when no data is available
 * @param props.theme - Custom theme configuration for the table
 * @param props.className - Additional CSS class for the table container
 * @param props.editable - Enables editing capabilities
 * @param props.setTableData - Callback when table data changes (required for editable tables)
 * @param props.columnTypes - Object mapping column names to their types
 * @param props.footer - Whether to show the footer with pagination controls
 * @param props.hasSettings - Whether to show column settings
 * @param props.emptyHeaders - Whether to hide column headers
 *
 * @typeParam T - The type of row data, must extend TableRowType
 *
 * @category Data Display
 * @public
 */
export interface TableProps<T extends TableRowType> {
  data?: T[];
  headers?: string[];
  setHeaders?: React.Dispatch<React.SetStateAction<string[]>>;
  onDataChange?: (newData: any[]) => void;
  children?: React.ReactNode;
  className?: string;
  editable?: boolean;
  columnTypes?: { [key: string]: ColumnType };
  hasFooter?: boolean;
  hasRowActions?: boolean;
  setColumnTypes?: setColumnTypes;
  setColumnNames?: (columnNames: string[]) => void;
  disabledKeys?: string[];
  emptyHeaders?: boolean;
  setEmptyHeaders?: (emptyheaders: boolean) => void;
  emptySearchMessage?: string;
}

export const Table = <T extends TableRowType>({
  data = [],
  headers = [],
  setHeaders,
  onDataChange = () => {},
  children,
  className = '',
  editable = false,
  setColumnNames,
  columnTypes = {},
  hasRowActions = false,
  setColumnTypes,
  disabledKeys,
  setEmptyHeaders,
  emptyHeaders = false,
  emptySearchMessage,
}: TableProps<T>) => {
  const { updateUnsavedChanges } = useUnsavedChanges();
  const t = useTranslations('Table');
  const [tableData, setTableData] = useState<any[]>([]);

  const [pageSize, setPageSize] = useState(5);
  const [saveKeys, setSaveKeys] = useState<string[]>(headers || []);
  const [newColumnNames, setNewColumnNames] = useState<string[]>(headers || []);
  const hasActions = data.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const [excludedKeys, setExcludedKeys] = useState<string[]>([]);
  const [isImportRemap, setIsImportRemap] = useState(false);

  const handleOptionsChange = useCallback(
    (keys: string[]) => {
      setExcludedKeys && setExcludedKeys(keys);
    },
    [setExcludedKeys],
  );

  const [sortedData, setSortedData] = useState(tableData);
  const [hydrated, setHydrated] = useState(false);
  const [options, setOptions] = useState<{ [key: string]: boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [confirmModalType, setConfirmModalType] = useState<string>('');
  const filteredObjectKeys = [...headers].filter((key) => !excludedKeys.includes(key)) || [];

  const confirmModalName = (() => {
    if (confirmModalType === 'DeleteRow' && selectedRowIndex !== null) {
      return String(selectedRowIndex + 1);
    }
    if (confirmModalType === 'DeleteColumn' && selectedRowIndex !== null) {
      return headers[selectedRowIndex] || '';
    }

    return '';
  })();

  const handleCellDataChange = (newData: any[]) => {
    setTableData(newData);
    onDataChange(newData);
  };

  useEffect(() => {
    if (editable) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [editable]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      let initialHeaders: string[];
      if (headers && headers.length > 0) {
        initialHeaders = headers;
      } else {
        const timestamp = Date.now();
        const dataKeys = Object.keys(data[0] || {});
        initialHeaders = dataKeys.map((_, idx) => `col_${timestamp}_${idx + 1}`);
      }
      setIsImportRemap(true);
      setHeaders && setHeaders(initialHeaders);
      setColumnNames && setColumnNames(initialHeaders);
      setNewColumnNames(initialHeaders);
      setSaveKeys(initialHeaders);
      // Only set column types to 'String' if initialHeaders are auto-generated
      if (initialHeaders.every((header) => /^col_\d+_\d+$/.test(header))) {
        setColumnTypes &&
          setColumnTypes(
            initialHeaders.reduce(
              (acc, header) => {
                acc[header] = 'String';

                return acc;
              },
              {} as { [key: string]: ColumnType },
            ),
          );
      }

      if (editable || isEditing) {
        setEmptyHeaders && setEmptyHeaders(false);
      }
      setTableData(
        data.map((row) => {
          const dataValues = Object.values(row);

          return initialHeaders.reduce((acc, header, idx) => {
            acc[header] = dataValues[idx] ?? null;

            return acc;
          }, {} as any);
        }),
      );
    }
  }, [
    data,
    editable,
    headers,
    isEditing,
    setHeaders,
    setColumnNames,
    setColumnTypes,
    setEmptyHeaders,
  ]);

  useEffect(() => {
    if (setColumnNames && newColumnNames && newColumnNames.length > 0) {
      const latestHeaders = [...newColumnNames];
      setColumnNames(latestHeaders);
    }
  }, [newColumnNames, setColumnNames]);

  useEffect(() => {
    if (headers && headers.length > 0 && setNewColumnNames) {
      setNewColumnNames(headers);
    }
  }, [headers, setNewColumnNames]);

  useEffect(() => {
    if (!editable && !isImportRemap && JSON.stringify(data) !== JSON.stringify(tableData)) {
      setTableData(data);
      setSortedData(data);
    }

    if (
      editable &&
      !isImportRemap &&
      tableData.length === 0 &&
      (!newColumnNames || newColumnNames.length === 0) &&
      (!headers || headers.length === 0)
    ) {
      const timestamp = Date.now();
      const initialKeys = [`col_${timestamp}_1`, `col_${timestamp}_2`];

      setTableData((prevData) => {
        if (prevData.length === 0) {
          const initialRows = [];
          for (let i = 0; i < 5; i++) {
            const newRow: Record<string, any> = {};
            initialKeys.forEach((key) => {
              newRow[key] = '';
            });
            initialRows.push(newRow as T);
          }

          return initialRows;
        }

        return prevData;
      });

      setSaveKeys(initialKeys);
      setHeaders && setHeaders(initialKeys);
      setColumnNames && setColumnNames(initialKeys);

      if (setColumnTypes) {
        setColumnTypes((prevTypes) => {
          if (Object.keys(prevTypes).length > 0) {
            return prevTypes;
          }
          const initialColumnTypes: { [key: string]: ColumnType } = {
            [initialKeys[0]]: 'Null',
            [initialKeys[1]]: 'Null',
          };

          return initialColumnTypes;
        });
      }
    } else if (editable && tableData.length === 0 && headers) {
      setTableData((prevData) => {
        if (prevData.length === 0) {
          return Array.from(
            { length: 5 },
            () =>
              headers.reduce((acc, key) => {
                (acc as any)[key] = null;

                return acc;
              }, {} as T) || ({} as T),
          );
        }

        return prevData;
      });

      setSaveKeys(headers);
      setHeaders && setHeaders(headers);
      setColumnNames && setColumnNames(headers);
    }

    if (!editable) {
      setSortedData(tableData);
    }
  }, [
    data,
    editable,
    headers,
    isImportRemap,
    newColumnNames,
    setColumnNames,
    setColumnTypes,
    setHeaders,
    setTableData,
    t,
    tableData,
  ]);

  useEffect(() => {
    const startIndex = editable ? 0 : (currentPage - 1) * pageSize;
    const endIndex = editable ? tableData.length : startIndex + pageSize;
    setSortedData((prevData) => {
      const newData = tableData.slice(startIndex, endIndex);
      if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
        return newData;
      }

      return prevData;
    });
  }, [currentPage, pageSize, tableData, editable]);

  const tableSettingKeys = useMemo(
    () =>
      data.length > 0
        ? headers.map((key) => ({
            label: key,
            value: key,
          }))
        : [],
    [data.length, headers],
  );

  const isTableCellDisabled = (columnIndex?: number): boolean => {
    if (columnIndex === undefined || !tableData[0]) return false;

    const key = headers[columnIndex];

    return columnTypes[key] === 'Null';
  };

  /**
   * Handles adding a new row to the table
   *
   * @param index - The index where to add the row
   * @param position - Whether to add 'above' or 'below' the index
   * @remarks
   * This method automatically populates new rows with default values
   * based on the column types.
   * @internal
   */

  /**
   * Handles row deletion with confirmation modal
   *
   * @remarks When called without an index after confirmation, uses the selectedRowIndex
   * @internal
   * @param action
   * @param rowIndex
   */

  const handleRowAction = (action: string, rowIndex: number) => {
    if (action === 'delete') {
      updateUnsavedChanges(true);
      setSelectedRowIndex(rowIndex);
      setConfirmModalType('DeleteRow');
      setIsModalVisible(true);

      return;
    }

    const newData = [...tableData];
    switch (action) {
      case 'above':
      case 'below': {
        updateUnsavedChanges(true);
        const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
        const insertIndex = action === 'below' ? rowIndex + 1 : rowIndex;
        newData.splice(insertIndex, 0, newRow);
        break;
      }
    }

    setTableData(newData);
    onDataChange(newData);
  };

  const handleColumnAction = (
    action: string,
    columnIndex: number,
    options?: ColumnRenameOptions,
  ) => {
    if (action === 'delete') {
      setSelectedRowIndex(columnIndex);
      setConfirmModalType('DeleteColumn');
      setIsModalVisible(true);

      return;
    }

    if (action === 'rename' && options && options.oldName && options.newName) {
      const { oldName, newName, immediateUpdate = true } = options;

      if (oldName === newName) return;
      updateUnsavedChanges(true);

      if (setHeaders && headers) {
        const newHeaders = [...headers];
        const oldNameIndex = newHeaders.indexOf(oldName);
        if (oldNameIndex !== -1) {
          newHeaders[oldNameIndex] = newName;
          setHeaders(newHeaders);

          setNewColumnNames(newHeaders);
          setSaveKeys(newHeaders);
        }
      }

      if (setColumnTypes && columnTypes[oldName]) {
        setColumnTypes((prev) => {
          const updatedColumnTypes = { ...prev };
          updatedColumnTypes[newName] = updatedColumnTypes[oldName];

          if (oldName !== newName) {
            delete updatedColumnTypes[oldName];
          }

          return updatedColumnTypes;
        });
      }

      if (immediateUpdate) {
        const updatedData = tableData.map((row) => {
          const newRow: Record<string, any> = {};

          headers.forEach((header) => {
            if (header === oldName) {
              newRow[newName] = row[oldName];
            } else {
              newRow[header] = row[header];
            }
          });

          return newRow;
        });

        setTableData(updatedData);
        onDataChange(updatedData);
      }

      return;
    }

    if (!saveKeys) return;
    updateUnsavedChanges(true);

    switch (action) {
      case 'right':
      case 'left': {
        const newHeaders = [...headers];
        const timestamp = new Date().getTime();
        const newColumnName = `col_${timestamp}_${Math.floor(Math.random() * 1000)}`;
        const insertIndex = action === 'right' ? columnIndex + 1 : columnIndex;

        newHeaders.splice(insertIndex, 0, newColumnName);

        const newData = tableData.map((row) => {
          const newRow = { ...row };

          const entries = Object.entries(newRow);
          entries.splice(insertIndex, 0, [newColumnName, '']);

          return Object.fromEntries(entries);
        });

        if (setColumnTypes) {
          setColumnTypes((prev) => ({
            ...prev,
            [newColumnName]: 'Null',
          }));
        }

        if (setHeaders) {
          setHeaders(newHeaders);
        }

        setNewColumnNames(newHeaders);
        setSaveKeys(newHeaders);
        setTableData(newData);
        onDataChange(newData);
        break;
      }
    }
  };

  const handleDeletionModalConfirm = () => {
    if (confirmModalType === 'DeleteRow' && selectedRowIndex !== null) {
      const startIndex = (currentPage - 1) * pageSize;
      const globalIndex = startIndex + selectedRowIndex;
      const updatedData = tableData.filter((_, i) => i !== globalIndex);
      setTableData(updatedData as T[]);
      onDataChange(updatedData);

      const totalRows = updatedData.length;
      const totalPages = Math.ceil(totalRows / pageSize);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    } else if (confirmModalType === 'DeleteColumn' && selectedRowIndex !== null) {
      updateUnsavedChanges(true);

      const columnToDelete = saveKeys ? saveKeys[selectedRowIndex] : null;
      if (!columnToDelete) {
        setSelectedRowIndex(null);
        setIsModalVisible(false);

        return;
      }

      const updatedKeys = saveKeys?.filter((_, i) => i !== selectedRowIndex);
      setHeaders && setHeaders(updatedKeys || []);
      setNewColumnNames(updatedKeys || []);
      setSaveKeys(updatedKeys || []);

      const updatedData = tableData.map((row) => {
        const newRow = { ...row };
        delete newRow[columnToDelete];

        return newRow;
      });

      if (setColumnTypes && columnToDelete) {
        const updatedColumnTypes = { ...columnTypes };
        delete updatedColumnTypes[columnToDelete];
        setColumnTypes(updatedColumnTypes);
      }

      setTableData(updatedData as T[]);
      onDataChange(updatedData);
    }

    setSelectedRowIndex(null);
    setIsModalVisible(false);
  };

  /**
   * Cancels the deletion action and closes the modal
   *
   * @internal
   */
  const handleDeletionModalCancel = () => {
    setIsModalVisible(false);
  };

  /**
   * Sorts table data by a specific column
   *
   * @param column - The column name to sort by
   * @param direction - Sort direction ('asc', 'desc', or 'none')
   *
   * @remarks
   * Handles special sorting for different data types:
   * - Numbers for Decimal/Integer columns
   * - Dates for DateTime columns
   * - Case-insensitive strings for String columns
   *
   * @internal
   */
  const sortData = (column: string, direction: SortDirection) => {
    if (direction === 'none') {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setSortedData(tableData.slice(startIndex, endIndex));

      return;
    }

    const sorted = [...tableData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (
        (aValue === null || aValue === undefined || aValue === '') &&
        (bValue === null || bValue === undefined || bValue === '')
      ) {
        return 0;
      }
      const isABlank = aValue === null || aValue === undefined || aValue === '';
      const isBBlank = bValue === null || bValue === undefined || bValue === '';

      if (isABlank && !isBBlank) return 1;
      if (!isABlank && isBBlank) return -1;

      if (columnTypes[column] === 'Decimal') {
        return direction === 'asc'
          ? Number(aValue || 0) - Number(bValue || 0)
          : Number(bValue || 0) - Number(aValue || 0);
      }

      if (columnTypes[column] === 'DateTime') {
        const dateA = aValue ? new Date(aValue as string).getTime() : 0;
        const dateB = bValue ? new Date(bValue as string).getTime() : 0;

        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const strA = String(aValue || '');
      const strB = String(bValue || '');

      const compareResult = strA.localeCompare(strB, 'cs', { sensitivity: 'base' });

      return direction === 'asc' ? compareResult : -compareResult;
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setSortedData(sorted.slice(startIndex, endIndex));
  };

  /**
   * Checks if a column has any non-empty values
   *
   * @param columnIndex - The index of the column to check
   * @returns True if the column has at least one non-empty value
   * @internal
   */
  const isColumnHasValue = (columnIndex: number): boolean => {
    if (!saveKeys) return false;

    const keys = headers;
    const currentColumnType = columnTypes[keys[columnIndex]];

    if (currentColumnType === 'Null') return false;

    return tableData.some((row) => {
      const value = row[keys[columnIndex]];

      return value !== null && value !== '' && value !== undefined;
    });
  };

  if (!hydrated) return null;

  return (
    <TableContext.Provider
      value={{
        editable,
        hasActions,
        options,
        setOptions,
        hasRowActions,
        pageSize,
        setPageSize,
        currentPage,
        setCurrentPage,
      }}
    >
      <div
        className={`${styles.tableContainer} ${className} ${editable ? 'TableContext-edit' : ''}`}
      >
        <div className={styles.tableContentWrapper}>
          <table
            className={`${styles.table} ${
              data.length > 0 || (editable && tableData.length > 0)
                ? styles.dataProvided
                : styles.noData
            }`}
            role="table"
            aria-label="Data Table"
          >
            {data.length > 0 || (editable && tableData.length > 0) ? (
              <>
                <TableHead
                  headers={editable ? headers : filteredObjectKeys}
                  onColumnAction={handleColumnAction}
                  disabledKeys={disabledKeys}
                  tableSettingKeys={tableSettingKeys}
                  handleOptionsChange={handleOptionsChange}
                  columnTypes={columnTypes}
                  setColumnTypes={setColumnTypes}
                  rowsPerPage={pageSize}
                  updateColumnNames={setNewColumnNames}
                  setSaveKeys={setSaveKeys}
                  emptyHeaders={emptyHeaders}
                  sortDirection={sortData}
                  isColumnLocked={isColumnHasValue}
                />
                <TableBody
                  data={sortedData.length > 0 ? sortedData : tableData}
                  onRowAction={handleRowAction}
                  tableData={tableData}
                  setTableData={handleCellDataChange}
                  headers={editable ? headers : filteredObjectKeys}
                  columnTypes={columnTypes}
                  rowsPerPage={pageSize}
                  disabledCell={isTableCellDisabled}
                  editable={editable}
                />
                <ConfirmModal
                  name={confirmModalName}
                  status={confirmModalType}
                  onCancel={handleDeletionModalCancel}
                  onConfirm={handleDeletionModalConfirm}
                  isVisible={isModalVisible}
                  setIsVisible={setIsModalVisible}
                />
              </>
            ) : !children ? (
              <tbody>
                <tr>
                  <td colSpan={100} className={styles.tableNoData}>
                    <InlineMessage
                      id="inline-message-table-no-data"
                      icon={
                        <Iinfo
                          id="icon-table-inline-message-info"
                          className={styles.inlineMessage}
                          width={20}
                          height={20}
                        />
                      }
                      message={emptySearchMessage || t('noCSCData')}
                      variant="info"
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              children
            )}
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
};
