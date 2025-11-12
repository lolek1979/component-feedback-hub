import { ColumnType } from '../Table';
import { TableActionsPopover } from './TableActionsPopover';

/**
 * Props for the TableColumnActions component.
 *
 * @property index - Index of the column for which actions are displayed.
 * @property onColumnAction - Callback when a column action is triggered. Receives action type and column index.
 * @property columnTypes - Object mapping column keys to their types.
 * @property setColumnTypes - Optional callback to update column types.
 */
interface TableColumnActionsProps {
  index: number;
  onColumnAction: (action: string, columnIndex: number) => void;
  columnTypes: { [key: string]: ColumnType };
  setColumnTypes?: (types: { [key: string]: ColumnType }) => void;
}

/**
 * TableColumnActions displays a popover for column actions in a table.
 *
 * Integrates TableActionsPopover for column-specific actions and type changes.
 *
 * @param props TableColumnActionsProps
 * @returns React component
 */

export const TableColumnActions = ({
  index,
  onColumnAction,
  columnTypes,
  setColumnTypes,
}: TableColumnActionsProps) => {
  return (
    <TableActionsPopover
      index={index}
      isColumn={true}
      onColumnAction={onColumnAction}
      onTypeChange={
        setColumnTypes ? (key, type) => setColumnTypes({ ...columnTypes, [key]: type }) : undefined
      }
    />
  );
};
