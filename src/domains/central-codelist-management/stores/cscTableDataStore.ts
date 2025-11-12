import { createStore } from 'zustand';

import { ColumnType, TableRowType } from '@/design-system/molecules/Table';

export type TableDataType = {
  tableData: TableRowType[];
  headers: string[];
  columnTypes: { [key: string]: ColumnType };
};

export type TableDataActions = {
  setHeaders: (headers: string[]) => void;
  setTableData: (tableData: TableRowType[]) => void;
  setColumnTypes: (columnTypes: { [key: string]: ColumnType }) => void;
  clearActions: () => void;
};
export type TableDataStore = TableDataActions & TableDataType;

export const defaultInitState: TableDataType = {
  tableData: [],
  headers: [],
  columnTypes: {},
};

/**
 * Creates a custom store for managing table data state.
 *
 * @param initialState - The initial state for the table data store. Defaults to `defaultInitState`.
 * @returns A store instance with actions for managing table headers, data, and column types.
 *
 * @typedoc
 * ### Actions
 * - `setHeaders`: Updates the headers in the store.
 * - `setTableData`: Updates the table data in the store.
 * - `setColumnTypes`: Updates the column types in the store.
 * - `clearActions`: Clears all headers, column types, and table data in the store.
 *
 * @example
 * ```typescript
 * const tableStore = useTableDataStore();
   tableStore.setState({ tableData: tableData });
   tableStore.getState().clearActions();
 * ```
 */
export const useTableDataStore = (initialState: TableDataType = defaultInitState) => {
  return createStore<TableDataStore>()((set) => ({
    ...initialState,
    setHeaders: () => set((state) => ({ headers: state.headers })),
    setTableData: () => set((state) => ({ tableData: state.tableData })),
    setColumnTypes: () => set((state) => ({ columnTypes: state.columnTypes })),
    clearActions: () => set(() => ({ headers: [], columnTypes: {}, tableData: [] })),
  }));
};
