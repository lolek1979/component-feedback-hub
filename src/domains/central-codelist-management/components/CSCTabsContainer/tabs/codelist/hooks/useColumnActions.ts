import { useCallback } from 'react';

import { ColumnType, TableRowType } from '@/design-system/molecules/Table';
import { useCscStructureStore } from '@/domains/central-codelist-management/stores/cscStructureStore';

interface ColumnRenameOptions {
  oldName: string;
  newName: string;
  immediateUpdate?: boolean;
}

interface UseColumnActionsProps {
  headers?: string[];
  setHeaders?: React.Dispatch<React.SetStateAction<string[]>>;
  tableData: TableRowType[];
  setTableData: (data: TableRowType[]) => void;
  columnTypes: { [key: string]: ColumnType };
  setColumnTypes: (
    types:
      | { [key: string]: ColumnType }
      | ((prev: { [key: string]: ColumnType }) => { [key: string]: ColumnType }),
  ) => void;
  setColumnNames: (columnNames: string[]) => void;
  handleDataChange: (newData: TableRowType[]) => void;
  updateUnsavedChanges: (hasChanges: boolean) => void;
  setSelectedRowIndex: (index: number | null) => void;
  setConfirmModalType: (type: string) => void;
  setIsModalVisible: (visible: boolean) => void;
}

export const useColumnActions = ({
  headers,
  setHeaders,
  tableData,
  setTableData,
  columnTypes,
  setColumnTypes,
  setColumnNames,
  handleDataChange,
  updateUnsavedChanges,
  setSelectedRowIndex,
  setConfirmModalType,
  setIsModalVisible,
}: UseColumnActionsProps) => {
  const handleColumnAction = useCallback(
    (action: string, columnIndex: number, options?: ColumnRenameOptions) => {
      if (action === 'delete') {
        setSelectedRowIndex(columnIndex);
        setConfirmModalType('DeleteColumn');
        setIsModalVisible(true);
        updateUnsavedChanges(true);
        useCscStructureStore.getState().removeColumns([columnIndex]);

        return;
      }

      if (action === 'rename' && options && options.oldName && options.newName) {
        const { oldName, newName, immediateUpdate = true } = options;
        if (setHeaders && headers) {
          const newHeaders = [...headers];
          const oldNameIndex = newHeaders.indexOf(oldName);
          if (oldNameIndex !== -1) {
            useCscStructureStore.getState().addColumn({
              index: columnIndex,
              name: newName,
              code: '',
              description: newName,
              valueType: columnTypes[headers[oldNameIndex]] ?? 'Null',
              length: newName.length,
              valueFormat:
                columnTypes[headers[oldNameIndex]] === 'DateTime' ? 'yyyy-MM-dd' : 'String',
              default: '',
              validations: [],
            });
            newHeaders[oldNameIndex] = newName;
            setHeaders(newHeaders);
            setColumnNames(newHeaders);
          }
        }

        if (setColumnTypes && columnTypes[oldName]) {
          setColumnTypes((prev) => {
            const updatedColumnTypes = { ...prev };
            updatedColumnTypes[newName] = updatedColumnTypes[oldName];

            useCscStructureStore.getState().addColumn({
              index: columnIndex,
              name: newName,
              code: '',
              description: newName,
              valueType: updatedColumnTypes[newName] ?? 'Null',
              length: oldName.length,
              valueFormat: updatedColumnTypes[newName] === 'DateTime' ? 'yyyy-MM-dd' : 'String',
              default: '',
              validations: [],
            });

            if (oldName !== newName) {
              delete updatedColumnTypes[oldName];
            }

            return updatedColumnTypes;
          });
        }

        if (immediateUpdate) {
          const updatedData = tableData.map((row, id) => {
            const newRow: TableRowType = { rowId: id };

            [...(headers ?? [])].forEach((header) => {
              if (header === oldName) {
                newRow[newName] = row[oldName];
              } else {
                newRow[header] = row[header];
              }
            });

            return newRow;
          });

          setTableData(updatedData);
          handleDataChange(updatedData);
        }

        return;
      }

      if (action === 'add') {
        const newColumnKey = `col_${headers?.length || 0}`;

        if (setHeaders && headers) {
          const newHeaders = [...headers, newColumnKey];
          setHeaders(newHeaders);
          setColumnNames(newHeaders);
        }

        // Add new column type as Null (inactive)
        setColumnTypes((prev) => ({
          ...prev,
          [newColumnKey]: 'Null' as ColumnType,
        }));

        // Add new column to all rows
        const updatedData = tableData.map((row) => ({
          ...row,
          [newColumnKey]: '',
        }));

        useCscStructureStore.getState().addColumn({
          index: columnIndex,
          name: newColumnKey,
          code: '',
          description: newColumnKey,
          valueType: 'Null',
          length: newColumnKey.length,
          valueFormat: 'String',
          default: '',
          validations: [],
        });

        setTableData(updatedData);
        handleDataChange(updatedData);
        updateUnsavedChanges(true);

        return;
      }

      if (action === 'right') {
        // Add column to the right of the specified column
        const insertIndex = columnIndex + 1;
        const newColumnKey = `col_${Date.now()}_${insertIndex}`;

        if (setHeaders && headers) {
          const newHeaders = [...headers];
          newHeaders.splice(insertIndex, 0, newColumnKey); // newColumnKey is unique for React
          setHeaders(newHeaders);
          setColumnNames(newHeaders);
        }

        // Add new column type as Null (inactive)
        setColumnTypes((prev) => ({
          ...prev,
          [newColumnKey]: 'Null' as ColumnType,
        }));

        // Add new column to all rows
        const updatedData = tableData.map((row) => ({
          ...row,
          [newColumnKey]: '',
        }));

        useCscStructureStore.getState().addColumn({
          index: insertIndex,
          length: newColumnKey.length,
          name: newColumnKey,
          code: '',
          description: newColumnKey,
          valueType: 'Null',
          valueFormat: 'String',
          validations: [],
          default: '',
        });

        setTableData(updatedData);
        handleDataChange(updatedData);
        updateUnsavedChanges(true);

        return;
      }

      if (action === 'left') {
        // Add column to the left of the specified column
        const insertIndex = columnIndex;
        const newColumnKey = `col_${Date.now()}_${insertIndex}`;

        if (setHeaders && headers) {
          const newHeaders = [...headers];
          newHeaders.splice(insertIndex, 0, newColumnKey); // newColumnKey is unique for React
          setHeaders(newHeaders);
          setColumnNames(newHeaders);
        }

        // Add new column type as Null (inactive)
        setColumnTypes((prev) => ({
          ...prev,
          [newColumnKey]: 'Null' as ColumnType,
        }));

        // Add new column to all rows
        const updatedData = tableData.map((row) => ({
          ...row,
          [newColumnKey]: '',
        }));

        useCscStructureStore.getState().addColumn({
          index: insertIndex,
          length: newColumnKey.length,
          name: newColumnKey,
          code: '',
          description: newColumnKey,
          valueType: 'Null',
          valueFormat: 'String',
          validations: [],
          default: '',
        });

        setTableData(updatedData);
        handleDataChange(updatedData);
        updateUnsavedChanges(true);

        return;
      }
    },
    [
      headers,
      setHeaders,
      tableData,
      setTableData,
      columnTypes,
      setColumnTypes,
      setColumnNames,
      handleDataChange,
      updateUnsavedChanges,
      setSelectedRowIndex,
      setConfirmModalType,
      setIsModalVisible,
    ],
  );

  const handleColumnTypeChange = useCallback(
    (columnIndex: number, newType: ColumnType) => {
      if (!headers || columnIndex >= headers.length) return;

      const columnKey = headers[columnIndex];

      // Update column type
      setColumnTypes((prev) => ({
        ...prev,
        [columnKey]: newType,
      }));

      updateUnsavedChanges(true);
    },
    [headers, setColumnTypes, updateUnsavedChanges],
  );

  const handleDeletionModalConfirm = useCallback(
    (
      confirmModalType: string,
      selectedRowIndex: number | null,
      pageSize: number,
      currentPage: number,
      setCurrentPage: (page: number) => void,
    ) => {
      if (confirmModalType === 'DeleteColumn' && selectedRowIndex !== null && headers) {
        const columnToDelete = headers[selectedRowIndex];

        // Remove column from headers
        const newHeaders = headers.filter((_, index) => index !== selectedRowIndex);
        if (setHeaders) {
          setHeaders(newHeaders);
          setColumnNames(newHeaders);
        }

        // Remove column type
        setColumnTypes((prev) => {
          const updated = { ...prev };
          delete updated[columnToDelete];

          return updated;
        });

        // Remove column data from all rows
        const updatedData = tableData.map((row) => {
          const newRow = { ...row };
          delete newRow[columnToDelete];

          return newRow;
        });

        setTableData(updatedData);
        handleDataChange(updatedData);
        updateUnsavedChanges(true);
      }

      if (confirmModalType === 'DeleteRow' && selectedRowIndex !== null) {
        const updatedData = tableData.filter((_, index) => index !== selectedRowIndex);
        setTableData(updatedData);
        handleDataChange(updatedData);
        updateUnsavedChanges(true);

        // Adjust current page if necessary
        const totalPages = Math.ceil(updatedData.length / pageSize);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      }
    },
    [
      headers,
      setHeaders,
      setColumnNames,
      setColumnTypes,
      tableData,
      setTableData,
      handleDataChange,
      updateUnsavedChanges,
    ],
  );

  return {
    handleColumnAction,
    handleColumnTypeChange,
    handleDeletionModalConfirm,
  };
};
