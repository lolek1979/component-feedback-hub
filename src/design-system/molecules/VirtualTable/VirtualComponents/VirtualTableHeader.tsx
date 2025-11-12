'use client';

import React, { useEffect, useState } from 'react';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

import { Text } from '@/design-system/atoms';

import styles from '../VirtualTable.module.css';
import VirtualTableCell from './VirtualTableCell';
import VirtualTableRow from './VirtualTableRow';
/**
 * VirtualTableHeader
 *
 * Renders the header row for the virtualized table.
 * Can be used with virtualization or custom children.
 *
 * @param props.columnVirtualizer - The column virtualizer instance from react-virtual (optional).
 * @param props.headerData - Array of header strings (optional).
 * @param props.children - Custom header content (optional).
 * @param props.height - Height of the header row (default: 35).
 * @param props.className - Additional class names for styling.
 *
 * @example
 * <VirtualTableHeader columnVirtualizer={columnVirtualizer} headerData={headerData} />
 *
 * @example
 * <VirtualTableHeader>
 *   <div>Custom Header</div>
 * </VirtualTableHeader>
 */
interface VirtualTableHeaderProps {
  columnVirtualizer?: Virtualizer<HTMLDivElement, Element>;
  headerData?: string[];
  children?: React.ReactNode;
  height?: number;
  className?: string;
}

const VirtualTableHeader = ({
  columnVirtualizer,
  headerData = [],
  children,
  height = 35,
  className,
}: VirtualTableHeaderProps) => {
  const headerRow = { index: 0, start: 0, size: height, end: 35, key: 'header', lane: 0 };
  const virtualColumns = columnVirtualizer?.getVirtualItems() ?? [];
  const totalSize = columnVirtualizer?.getTotalSize() ?? 0;

  const [headerRowWidth, setHeaderRowWidth] = useState<string>('100%');

  useEffect(() => {
    if (totalSize > 0) {
      setHeaderRowWidth(`${totalSize}px`);
    } else {
      setHeaderRowWidth('100%');
    }
  }, [totalSize]);

  return headerData && headerData.length > 0 && columnVirtualizer ? (
    <div
      className={styles.header}
      role="rowgroup"
      style={{
        width: headerRowWidth,
        minWidth: headerRowWidth,
        maxWidth: headerRowWidth,
      }}
    >
      <VirtualTableRow row={headerRow}>
        <div
          className={styles.headerColumnsContainer}
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
          }}
        >
          {virtualColumns.map((col: VirtualItem) => (
            <VirtualTableCell
              key={`header-${col.index}`}
              className={`${styles.virtualCell} ${styles.headerCell}`}
              style={{
                transform: `translateX(${Math.ceil(col.start)}px)`,
                width: `${Math.floor(col.size)}px`,
              }}
            >
              <Text variant="subtitle" regular>
                {headerData[col.index] ?? ''}
              </Text>
            </VirtualTableCell>
          ))}
        </div>
      </VirtualTableRow>
    </div>
  ) : (
    <div
      className={className}
      role="rowgroup"
      style={{
        width: headerRowWidth,
        minWidth: headerRowWidth,
        maxWidth: headerRowWidth,
      }}
    >
      {children}
    </div>
  );
};

export default VirtualTableHeader;
