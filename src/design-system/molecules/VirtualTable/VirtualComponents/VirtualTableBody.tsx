import React from 'react';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

import { Text } from '@/design-system/atoms';

import styles from '../VirtualTable.module.css';
import VirtualTableCell from './VirtualTableCell';
import VirtualTableRow from './VirtualTableRow';
/**
 * VirtualTableBody
 *
 * Renders the body rows for the virtualized table.
 * Supports both virtualized rendering and custom children.
 *
 * @param props.rowVirtualizer - The row virtualizer instance from react-virtual (optional).
 * @param props.columnVirtualizer - The column virtualizer instance from react-virtual (optional).
 * @param props.bodyData - 2D array of cell data (optional).
 * @param props.children - Custom body content (optional).
 * @param props.className - Additional class names for styling.
 * @param props.style - Inline styles for the body container.
 *
 * @example
 * <VirtualTableBody
 *   rowVirtualizer={rowVirtualizer}
 *   columnVirtualizer={columnVirtualizer}
 *   bodyData={bodyData}
 * />
 *
 * @example
 * <VirtualTableBody>
 *   <VirtualTableRow>
 *     <VirtualTableCell>Custom</VirtualTableCell>
 *   </VirtualTableRow>
 * </VirtualTableBody>
 */
interface VirtualTableBodyProps {
  rowVirtualizer?: Virtualizer<HTMLDivElement, Element>;
  columnVirtualizer?: Virtualizer<HTMLDivElement, Element>;
  bodyData?: string[][];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VirtualTableBody = ({
  rowVirtualizer,
  columnVirtualizer,
  bodyData = [],
  children,
  className,
  style,
}: VirtualTableBodyProps) => {
  const virtualRows = rowVirtualizer?.getVirtualItems();
  const virtualColumns = columnVirtualizer?.getVirtualItems();

  return virtualRows &&
    virtualColumns &&
    rowVirtualizer &&
    columnVirtualizer &&
    bodyData &&
    bodyData.length > 0 ? (
    <div
      role="rowgroup"
      className={styles.bodyContainer}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: `${columnVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualRows.map((virtualRow: VirtualItem) => (
        <VirtualTableRow key={virtualRow.index} row={virtualRow}>
          <div className={styles.bodyColumnsContainer}>
            {virtualColumns.map((col) => (
              <VirtualTableCell
                key={`${virtualRow.index}-${col.index}`}
                className={`${styles.virtualCell} ${styles.bodyCell}`}
                style={{
                  transform: `translateX(${Math.floor(col.start)}px)`,
                  width: `${col.size}px`,
                }}
              >
                <Text variant="subtitle" regular>
                  {' '}
                  {bodyData[virtualRow.index]?.[col.index] ?? ''}
                </Text>
              </VirtualTableCell>
            ))}
          </div>
        </VirtualTableRow>
      ))}
    </div>
  ) : (
    <div className={className} role="rowgroup" style={style}>
      {children}
    </div>
  );
};

export default VirtualTableBody;
