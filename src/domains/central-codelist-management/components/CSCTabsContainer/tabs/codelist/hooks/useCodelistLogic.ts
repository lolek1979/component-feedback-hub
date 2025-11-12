import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { ColumnType, TableRowType } from '@/design-system/molecules/Table';
import { CodeListByIdResponse } from '@/domains/central-codelist-management/api/services';
import { DraftsByIdResponse } from '@/domains/central-codelist-management/api/services/getDraftsById';
import { DetailsPageContext } from '@/domains/central-codelist-management/DetailPage';
import { useCSCDataStore } from '@/domains/central-codelist-management/stores/cscDataStore';
import {
  convertArrayToObjects,
  extractCodeListData,
} from '@/domains/central-codelist-management/utils';

interface FilterState {
  search: string;
}

interface UseCodelistLogicProps {
  editable?: boolean;
  data: CodeListByIdResponse | DraftsByIdResponse | TableRowType[] | null;
  headers?: string[];
  setHeaders?: React.Dispatch<React.SetStateAction<string[]>>;
  setTableData: (data: TableRowType[]) => void;
  setColumnTypes: (
    types:
      | { [key: string]: ColumnType }
      | ((prev: { [key: string]: ColumnType }) => { [key: string]: ColumnType }),
  ) => void;
  setColumnNames: (columnNames: string[]) => void;
  tableData: TableRowType[];
  columnTypes: { [key: string]: ColumnType };
}

export const useCodelistLogic = ({
  editable,
  data,
  headers,
  setHeaders,
  setTableData,
  setColumnTypes,
  tableData,
  columnTypes,
}: UseCodelistLogicProps) => {
  const t = useTranslations('Table');
  const { updateUnsavedChanges } = useUnsavedChanges();
  const { setIsValid } = useContext(DetailsPageContext);

  const [filter, setFilter] = useState<FilterState>({ search: '' });
  const [emptyHeaders, setEmptyHeaders] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<TableRowType[]>([]);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [confirmModalType, setConfirmModalType] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [cellValidity, setCellValidity] = useState<{ [key: string]: boolean }>({});
  const [, setSortState] = useState<{
    column: string;
    direction: 'asc' | 'desc' | 'none';
  }>({
    column: '',
    direction: 'none',
  });

  const filteredData = useMemo(() => {
    if (editable) return originalData;
    if (!filter.search) return originalData;

    return originalData.filter((row) => {
      const searchLower = filter.search.toLowerCase();

      return Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchLower),
      );
    });
  }, [originalData, filter.search, editable]);

  const emptySearchMessage = useMemo(
    () => (originalData.length > 0 && filter.search ? t('emptySearchMessage') : t('noCSCData')),
    [originalData.length, filter.search, t],
  );

  const confirmModalName = useMemo(() => {
    if (confirmModalType === 'DeleteRow' && selectedRowIndex !== null) {
      return String(selectedRowIndex + 1);
    }
    if (confirmModalType === 'DeleteColumn' && selectedRowIndex !== null) {
      return headers?.[selectedRowIndex] ?? '';
    }

    return '';
  }, [confirmModalType, selectedRowIndex, headers]);

  // Data initialization effect
  useEffect(() => {
    const { keys, rows, fields } = extractCodeListData(data);

    if (!editable || !dataInitialized) {
      let dataObjects: TableRowType[];

      if (keys.length === 0 && rows.length > 0) {
        const normalizedKeys = rows[0] ? rows[0].map((_, i) => `${i + 1}`) : [];
        dataObjects = rows.map((row, id) => ({
          rowId: id,
          ...Object.fromEntries(normalizedKeys.map((key, index) => [key, row[index] ?? ''])),
        }));
        setEmptyHeaders(true);
        // Set normalized keys as headers for read mode to enable table display
        if (!editable && setHeaders) {
          setHeaders(normalizedKeys);
        }
      } else if (keys.length === 0) {
        // For completely new codelist with no keys and no data
        setEmptyHeaders(true);
        dataObjects = convertArrayToObjects<TableRowType>({ keys, data: rows });
      } else {
        setEmptyHeaders(false);
        dataObjects = convertArrayToObjects<TableRowType>({ keys, data: rows });
      }

      const columnDefaultTypes = fields.reduce(
        (acc, field) => {
          if ('name' in field) {
            let valueType = field.valueType as unknown as ColumnType;
            if ((valueType as string) === 'Decimal') {
              valueType = 'Integer' as ColumnType;
            }
            acc[field.name] = valueType;
          }

          return acc;
        },
        {} as { [key: string]: ColumnType },
      );

      // Parse date fields
      dataObjects = dataObjects.map((row) => {
        const parsedRow = { ...row };
        keys.forEach((key) => {
          if (columnDefaultTypes[key] === 'DateTime' && parsedRow[key]) {
            const rawDate = parsedRow[key];
            let formattedDate = '';

            // Handle different date formats
            if (rawDate instanceof Date) {
              formattedDate = rawDate.toLocaleDateString('cs-CZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            } else if (typeof rawDate === 'string') {
              // Handle YYYY-MM-DD format (from API)
              if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
                const [year, month, day] = rawDate.split('-');
                formattedDate = `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`;
              }
              // Handle YYYYMMDD format
              else if (/^\d{8}$/.test(rawDate)) {
                const day = rawDate.slice(0, 2);
                const month = rawDate.slice(2, 4);
                const year = rawDate.slice(4, 8);
                formattedDate = `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`;
              }
              // Handle DD.MM.YYYY format (already correct)
              else if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(rawDate)) {
                formattedDate = rawDate;
              }
              // Try to parse as Date if other formats fail
              else {
                const date = new Date(rawDate);
                if (!isNaN(date.getTime())) {
                  formattedDate = date.toLocaleDateString('cs-CZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                }
              }
            }

            // Only update if we successfully formatted the date
            if (formattedDate) {
              parsedRow[key] = formattedDate.replace(/\s/g, '');
            }
          }
        });

        return parsedRow;
      });

      setOriginalData(dataObjects);

      if (!editable) {
        setTableData(dataObjects);
        setColumnTypes((prevTypes) => {
          if (Object.keys(prevTypes).length > 0) {
            return prevTypes;
          }

          return columnDefaultTypes;
        });
      }

      if (keys.length > 0) {
        setHeaders?.(keys);
      }

      if (dataObjects.length > 0) {
        setHeaders?.(keys);
      } else if (!dataInitialized) {
        setTableData(dataObjects);
        setColumnTypes((prevTypes) => {
          if (Object.keys(prevTypes).length > 0) {
            return prevTypes;
          }

          return columnDefaultTypes;
        });
        setDataInitialized(true);
      }
    }
  }, [data, editable, setColumnTypes, setTableData, dataInitialized, setHeaders]);

  // Filter data effect
  useEffect(() => {
    if (!editable) {
      setTableData(filteredData);
      setCurrentPage(1);
    }
  }, [filteredData, setTableData, setCurrentPage, editable]);

  // Update emptyHeaders when column types change
  useEffect(() => {
    if (editable) {
      const hasDefinedColumnTypes = Object.values(columnTypes).some(
        (type) => type !== 'Null' && type !== undefined,
      );

      if (hasDefinedColumnTypes && emptyHeaders) {
        setEmptyHeaders(false);
      }
    }
  }, [columnTypes, emptyHeaders, editable]);

  // Edit mode effect
  useEffect(() => {
    if (editable) {
      setFilter({ search: '' });
      if (originalData.length > 0) {
        setTableData(originalData);
      } else {
        const { keys, rows } = extractCodeListData(data);
        if (keys.length > 0 && rows.length > 0) {
          const dataObjects = convertArrayToObjects<TableRowType>({ keys, data: rows });
          setTableData(dataObjects);
          setOriginalData(dataObjects);
        } else {
          // Create default structure for new codelist with 2 columns and 5 rows
          // Use internal keys for functionality but display empty names
          const defaultHeaders = ['col_0', 'col_1']; // Internal keys for functionality
          const defaultColumnTypes = {
            col_0: 'Null' as ColumnType,
            col_1: 'Null' as ColumnType,
          };

          // Initialize headers if setter is available
          if (setHeaders) {
            setHeaders(defaultHeaders);
          }

          // Set default column types to Null (inactive)
          setColumnTypes(defaultColumnTypes);

          // Create 5 empty rows with the default columns structure
          const emptyRows: TableRowType[] = Array.from({ length: 5 }, (_, id) => ({
            rowId: id,
            col_0: '',
            col_1: '',
          }));

          const actions = useCSCDataStore.getState().actions;
          const hasAddActions = actions.some((a) => a.type === 'add');
          if (!hasAddActions) {
            emptyRows.map((row) => {
              useCSCDataStore.getState().addAction({
                type: 'add',
                rowId: row.rowId as number,
                payload: { values: { ...row } },
              });
            });
          }

          setTableData(emptyRows);
          setOriginalData(emptyRows);
          setEmptyHeaders(true); // Set to true since display names should be empty
        }
      }
    }
  }, [editable, data, originalData, setTableData, setHeaders, setColumnTypes]);

  const handleFilterChange = useCallback((newFilter: FilterState) => {
    setFilter(newFilter);
  }, []);

  const handleDataChange = useCallback(
    (newData: TableRowType[]) => {
      if (editable) {
        setTableData(newData);
        updateUnsavedChanges(true);
      }
    },
    [editable, setTableData, updateUnsavedChanges],
  );

  const handleOnBlur = useCallback(
    (newRow: TableRowType) => {
      if (editable) {
        useCSCDataStore.getState().addAction({
          type: 'update',
          rowId: newRow.rowId as number,
          payload: { values: newRow },
        });
      }
    },
    [editable],
  );

  const isColumnLocked = useCallback(
    (columnIndex: number): boolean => {
      if (!headers) return false;

      const keys = headers;
      const currentColumnType = columnTypes[keys[columnIndex]];

      if (currentColumnType === 'Null') return false;

      return tableData.some((row) => {
        const value = row[keys[columnIndex]];

        return value !== null && value !== '' && value !== undefined;
      });
    },
    [headers, columnTypes, tableData],
  );

  const isTableCellDisabled = useCallback(
    (columnIndex?: number): boolean => {
      if (columnIndex === undefined || !tableData[0]) return false;

      const keys = headers ?? [];
      const key = keys[columnIndex];

      return columnTypes[key] === 'Null';
    },
    [headers, columnTypes, tableData],
  );

  const isValidDecimal = useCallback((value: string) => {
    if (value === '') return true;
    const decimalRegex = /^(?:-?(?:0|(?:[1-9]\d*(?:\.\d+)?(?:e-?\d+)?)))$/i;

    return decimalRegex.test(value);
  }, []);

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
    (rowIndex: number, columnKey: string, value: string): boolean => {
      const type = columnTypes[columnKey];
      const cellKey = `${rowIndex}-${columnKey}`;

      let isValid = true;
      if (type === 'Integer' && !isValidDecimal(value)) {
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

      setIsValid(isValid);

      return isValid;
    },
    [columnTypes, isValidDecimal, isValidDate, setIsValid],
  );

  const sortData = useCallback(
    (data: TableRowType[], column: string, direction: 'asc' | 'desc' | 'none'): TableRowType[] => {
      if (direction === 'none') {
        return [...data];
      }

      return [...data].sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        const columnType = columnTypes[column];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return direction === 'asc' ? -1 : 1;
        if (bValue == null) return direction === 'asc' ? 1 : -1;

        let comparison = 0;

        // Sort based on column type
        switch (columnType) {
          case 'Integer':
          case 'Decimal': {
            const numA = Number(aValue);
            const numB = Number(bValue);
            comparison = numA - numB;
            break;
          }

          case 'DateTime': {
            // Handle both Date objects and date strings
            let dateA: Date;
            let dateB: Date;

            if (aValue instanceof Date) {
              dateA = aValue;
            } else {
              // Parse Czech date format DD.MM.YYYY
              const dateStrA = String(aValue);
              if (dateStrA.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
                const [day, month, year] = dateStrA.split('.').map(Number);
                dateA = new Date(year, month - 1, day);
              } else {
                dateA = new Date(dateStrA);
              }
            }

            if (bValue instanceof Date) {
              dateB = bValue;
            } else {
              const dateStrB = String(bValue);
              if (dateStrB.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
                const [day, month, year] = dateStrB.split('.').map(Number);
                dateB = new Date(year, month - 1, day);
              } else {
                dateB = new Date(dateStrB);
              }
            }

            comparison = dateA.getTime() - dateB.getTime();
            break;
          }

          default:
            // String comparison
            comparison = String(aValue).localeCompare(String(bValue), 'cs-CZ', {
              numeric: true,
              sensitivity: 'base',
            });
            break;
        }

        return direction === 'asc' ? comparison : -comparison;
      });
    },
    [columnTypes],
  );

  const handleSort = useCallback(
    (column: string, direction: 'asc' | 'desc' | 'none') => {
      setSortState({ column, direction });

      // Sort the current data
      let dataToSort = editable ? tableData : filteredData;
      const sortedData = sortData(dataToSort, column, direction);

      setTableData(sortedData);
    },
    [editable, tableData, filteredData, sortData, setTableData],
  );

  return {
    filter,
    emptyHeaders,
    originalData,
    selectedRowIndex,
    confirmModalType,
    isModalVisible,
    pageSize,
    currentPage,
    cellValidity,
    filteredData,
    emptySearchMessage,
    confirmModalName,
    setEmptyHeaders,
    setSelectedRowIndex,
    setConfirmModalType,
    setIsModalVisible,
    setPageSize,
    setCurrentPage,
    handleFilterChange,
    handleDataChange,
    isColumnLocked,
    isTableCellDisabled,
    validateCell,
    updateUnsavedChanges,
    handleSort,
    handleOnBlur,
  };
};
