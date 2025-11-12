import { useCallback } from 'react';

import { TableRowType } from '@/design-system/molecules/Table';
import { useCSCDataStore } from '@/domains/central-codelist-management/stores/cscDataStore';

interface UseRowActionsProps {
  headers?: string[];
  tableData: TableRowType[];
  setTableData: (data: TableRowType[]) => void;
  handleDataChange: (newData: TableRowType[]) => void;
  updateUnsavedChanges: (hasChanges: boolean) => void;
  setSelectedRowIndex: (index: number | null) => void;
  setConfirmModalType: (type: string) => void;
  setIsModalVisible: (visible: boolean) => void;
}

export const useRowActions = ({
  headers,
  tableData,
  setTableData,
  handleDataChange,
  updateUnsavedChanges,
  setSelectedRowIndex,
  setConfirmModalType,
  setIsModalVisible,
}: UseRowActionsProps) => {
  const handleRowAction = useCallback(
    (action: string, rowIndex: number) => {
      if (action === 'delete') {
        updateUnsavedChanges(true);
        setSelectedRowIndex(rowIndex);
        setConfirmModalType('DeleteRow');
        setIsModalVisible(true);

        useCSCDataStore.getState().addAction({
          type: 'delete',
          rowId: rowIndex,
          payload: { values: rowIndex },
        });

        return;
      }

      const newData = [...tableData];
      switch (action) {
        case 'above':
        case 'below': {
          updateUnsavedChanges(true);
          const newRow = (headers ?? []).reduce((acc, header) => ({ ...acc, [header]: '' }), {});
          const insertIndex = action === 'below' ? rowIndex + 1 : rowIndex;
          newData.splice(insertIndex, 0, { ...newRow, rowId: insertIndex });
          newData.forEach((row, id) => {
            row.rowId = id;
          });
          useCSCDataStore.getState().addAction({
            type: 'add',
            rowId: insertIndex,
            payload: { values: { ...newRow } },
          });

          break;
        }
      }

      setTableData(newData);
      handleDataChange(newData);
    },
    [
      tableData,
      headers,
      setTableData,
      handleDataChange,
      updateUnsavedChanges,
      setSelectedRowIndex,
      setConfirmModalType,
      setIsModalVisible,
    ],
  );

  return {
    handleRowAction,
  };
};
