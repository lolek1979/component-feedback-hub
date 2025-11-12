import { useContext } from 'react';

import { TableRowActions } from '../actions/TableRowActions';
import { TableContext } from '../Table';
import styles from '../Table.module.css';

/**
 * Props for the TableRow component.
 *
 * @property children - Content to render inside the table row.
 * @property className - Additional CSS class for the row.
 * @property index - Index of the row.
 * @property onRowAction - Callback when a row action is triggered.
 * @property isHeader - Whether the row is a header row.
 * @property noBackground - Whether to remove background styling.
 */
interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  children: React.ReactNode;
  className?: string;
  index?: number;
  onRowAction?: (action: string, rowIndex: number) => void;
  isHeader?: boolean;
  noBackground?: boolean;
}

/**
 * TableRow renders a table row with optional index, actions, and header styling.
 *
 * Handles editable mode, header row rendering, and row actions.
 *
 * @param props TableRowProps
 * @returns React component
 */
export const TableRow = ({
  children,
  onRowAction = () => {},
  className = '',
  index,
  isHeader = false,
  noBackground,
}: TableRowProps) => {
  const { editable, hasActions } = useContext(TableContext);

  return (
    <tr
      className={`${className} ${styles.tableRow}`}
      style={noBackground ? { background: 'white' } : undefined}
    >
      {!isHeader ? (
        editable ? (
          <td className={`${isHeader ? styles.tableRowEditSticky : styles.tableRowEdit}`}>
            <div className={styles.tableRowIndex}>{(index ?? 0) + 1}</div>
          </td>
        ) : hasActions ? null : null
      ) : editable ? (
        <th className={`${isHeader ? styles.tableHeadEditSticky : styles.tableHeadEdit}`}></th>
      ) : null}
      {children}
      {!isHeader ? (
        editable ? (
          <td className={styles.actionsCell}>
            <TableRowActions index={index ?? 0} onRowAction={onRowAction} />
          </td>
        ) : (
          <></>
        )
      ) : editable ? (
        <th className={styles.headerActionsCell}></th>
      ) : (
        <></>
      )}
    </tr>
  );
};
