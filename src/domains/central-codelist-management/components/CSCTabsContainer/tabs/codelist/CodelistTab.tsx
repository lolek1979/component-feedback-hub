'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { IInfo } from '@/core/assets/icons';
import { codeListMode, CodeListStatus } from '@/core/lib/definitions';
import { Text } from '@/design-system/atoms';
import { InlineMessage, VirtualTable } from '@/design-system/molecules';
import { ColumnType, TableRowType } from '@/design-system/molecules/Table';
import { ConfirmModal } from '@/design-system/molecules/Table/actions/ConfirmModal';
import { CodeListByIdResponse } from '@/domains/central-codelist-management/api/services';
import { DraftsByIdResponse } from '@/domains/central-codelist-management/api/services/getDraftsById';

import { CSCSimpleFilter } from '../../../CSCSimpleFilter/CSCSimpleFilter';
import { CodelistTableBody } from './components/CodelistTableBody';
import { CodelistTableHeader } from './components/CodelistTableHeader';
import { useCodelistLogic } from './hooks/useCodelistLogic';
import { useColumnActions } from './hooks/useColumnActions';
import { useRowActions } from './hooks/useRowActions';
import { useVirtualization } from './hooks/useVirtualization';
import styles from './CodelistTab.module.css';

interface CodelistTabProps {
  status?: CodeListStatus;
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
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const CodelistTab = ({
  editable,
  data,
  headers,
  setHeaders,
  setTableData,
  setColumnTypes,
  setColumnNames,
  tableData,
  columnTypes,
}: CodelistTabProps) => {
  const t = useTranslations('Table');

  // Main logic hook
  const {
    filter,
    emptyHeaders,
    selectedRowIndex,
    confirmModalType,
    isModalVisible,
    confirmModalName,
    setSelectedRowIndex,
    setConfirmModalType,
    setIsModalVisible,
    handleFilterChange,
    handleDataChange,
    isColumnLocked,
    isTableCellDisabled,
    validateCell,
    updateUnsavedChanges,
    handleSort,
    handleOnBlur,
  } = useCodelistLogic({
    editable,
    data,
    headers,
    setHeaders,
    setTableData,
    setColumnTypes,
    setColumnNames,
    tableData,
    columnTypes,
  });

  // Virtualization hook
  const {
    pageSize,
    currentPage,
    parentRef,
    rowVirtualizer,
    columnVirtualizer,
    headerRow,
    headerRow2,
    setCurrentPage,
  } = useVirtualization({
    headers,
    tableData,
    editable,
    setTableData,
  });

  // Column actions hook
  const { handleColumnAction, handleColumnTypeChange, handleDeletionModalConfirm } =
    useColumnActions({
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
    });

  // Row actions hook
  const { handleRowAction } = useRowActions({
    headers,
    tableData,
    setTableData,
    handleDataChange,
    updateUnsavedChanges,
    setSelectedRowIndex,
    setConfirmModalType,
    setIsModalVisible,
  });

  const onConfirmDelete = () => {
    handleDeletionModalConfirm(
      confirmModalType,
      selectedRowIndex,
      pageSize,
      currentPage,
      setCurrentPage,
    );
    setSelectedRowIndex(null);
    setIsModalVisible(false);
  };
  const [mode, setMode] = useQueryState(
    'mode',
    parseAsStringLiteral(Object.values(codeListMode)).withDefault(codeListMode.read),
  );

  useEffect(() => {
    if (mode !== codeListMode.edit) return;

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    // If the page was reloaded, temporarily switch to 'read' mode
    if (navEntry.type === 'reload') {
      let isMounted = true;

      setMode('read');

      const container = parentRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && isMounted) {
            setMode('edit');
            observer.disconnect();
          }
        },
        {
          root: null,
          threshold: 0.5,
        },
      );

      observer.observe(container);

      return () => {
        isMounted = false;
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {editable && <Text variant="h4">{t('dataEdit')}</Text>}
      {!editable && (
        <div className={styles.filterContainer}>
          <CSCSimpleFilter
            onFilterChange={handleFilterChange}
            initialValues={filter}
            editable={editable}
          />
        </div>
      )}

      <VirtualTable
        ref={parentRef}
        tableHeight={typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500}
        className={(headers && headers.length > 2) || editable ? styles.overflow : undefined}
      >
        {!editable && tableData.length === 0 ? (
          Object.values(filter).some(Boolean) ? (
            <InlineMessage
              id="inlineMessage-table-no-search-data"
              message={t('emptySearchMessage')}
              variant="info"
              icon={
                <IInfo
                  width={24}
                  height={24}
                  className="icon_blue-500"
                  id="icon-table-no-search-data"
                />
              }
            />
          ) : (
            <InlineMessage
              id="inlineMessage-table-no-data"
              message={t('noCSCData')}
              variant="info"
              icon={
                <IInfo width={24} height={24} className="icon_blue-500" id="icon-table-no-data" />
              }
            />
          )
        ) : (
          <>
            <CodelistTableHeader
              editable={editable}
              headers={headers}
              columnVirtualizer={columnVirtualizer}
              headerRow={headerRow}
              headerRow2={headerRow2}
              columnTypes={columnTypes}
              emptyHeaders={emptyHeaders}
              isColumnLocked={isColumnLocked}
              isTableCellDisabled={isTableCellDisabled}
              onColumnAction={handleColumnAction}
              onColumnTypeChange={handleColumnTypeChange}
              onSort={handleSort}
            />

            <CodelistTableBody
              editable={editable}
              headers={headers}
              tableData={tableData}
              rowVirtualizer={rowVirtualizer}
              columnVirtualizer={columnVirtualizer}
              emptyHeaders={emptyHeaders}
              isTableCellDisabled={isTableCellDisabled}
              validateCell={validateCell}
              onDataChange={handleDataChange}
              onRowAction={handleRowAction}
              onBlur={handleOnBlur}
              columnTypes={columnTypes}
            />
          </>
        )}
      </VirtualTable>

      <ConfirmModal
        name={confirmModalName}
        status={confirmModalType}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={onConfirmDelete}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
    </div>
  );
};
