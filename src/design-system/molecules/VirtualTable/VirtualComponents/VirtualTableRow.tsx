import React from 'react';
import { VirtualItem } from '@tanstack/react-virtual';

import styles from '../VirtualTable.module.css';
/**
 * VirtualTableRow
 *
 * A row component for the virtualized table, used to render a single row (header or body).
 * Handles absolute positioning and sizing for virtualization.
 *
 * @param props.row - The virtual row item from react-virtual (optional).
 * @param props.children - The cells to render inside the row.
 * @param props.className - Additional class names for styling.
 *
 * @example
 * <VirtualTableRow row={virtualRow}>
 *   <VirtualTableCell>Cell 1</VirtualTableCell>
 *   <VirtualTableCell>Cell 2</VirtualTableCell>
 * </VirtualTableRow>
 */

interface VirtualTableRowProps {
  row?: VirtualItem;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VirtualTableRow = ({ row, children, className, style }: VirtualTableRowProps) => {
  return (
    <div
      role="row"
      className={`${styles.bodyRow} ${className || ''}`}
      style={{
        top: row ? row.start : 0,
        height: row ? row.size : 'auto',
        position: row ? 'absolute' : 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default VirtualTableRow;
