import { TableActionsPopover } from './TableActionsPopover';

/**
 * Props for the TableRowActions component.
 *
 * @property index - Index of the row for which actions are displayed.
 * @property onRowAction - Callback when a row action is triggered. Receives action type and row index.
 * @property handleDeleteRow - Optional callback for deleting a row.
 * @property handleAddRow - Optional callback for adding a row above or below.
 */
interface TableActionsProps {
  index: number;
  onRowAction: (action: string, rowIndex: number) => void;
  handleDeleteRow?: (index: number) => void;
  handleAddRow?: (index: number, position: 'above' | 'below') => void;
}

/**
 * TableRowActions displays a popover for row actions in a table.
 *
 * Integrates TableActionsPopover for row-specific actions.
 *
 * @param props TableActionsProps
 * @returns React component
 */

export const TableRowActions = ({ index, onRowAction }: TableActionsProps) => {
  return <TableActionsPopover index={index} onRowAction={onRowAction} />;
};
