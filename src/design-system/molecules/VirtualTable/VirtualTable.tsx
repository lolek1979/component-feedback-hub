'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

import VirtualTableBody from './VirtualComponents/VirtualTableBody';
import VirtualTableHeader from './VirtualComponents/VirtualTableHeader';
import styles from './VirtualTable.module.css';
/**
 * VirtualTable
 *
 * A performant, virtualized table component for rendering large datasets with customizable headers and body.
 * Supports both a simple API (with `headerData` and `bodyData` props) and a fully custom render via children.
 *
 * @remarks
 * - Uses [@tanstack/react-virtual](https://tanstack.com/virtual/v3) for virtualization.
 * - The table only renders visible rows and columns for optimal performance.
 * - You can use the simple API for most use-cases, or provide your own header/body via children for advanced layouts.
 * - If you use `tableHeight={typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500}`, the table will automatically resize its height to 60% of the window height, making it responsive to the viewport size.
 * @example
 * // Simple usage with headerData and bodyData
 * const tableHeader = ['Header 1', 'Header 2', 'Header 3'];
 * const tableBody = [
 *   ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
 *   ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
 * ];
 * <VirtualTable
 *   headerData={tableHeader}
 *   bodyData={tableBody}
 *   cellHeight={40}
 *   tableHeight={500}
 * />
 *
 * @example
 * // Advanced usage with custom header/body via children and forwardRef
 * // You can access the scroll container via ref and build your own virtualizers:
 * const parentRef = useRef<HTMLDivElement | null>(null);
 * const rowVirtualizer = useVirtualizer({
 *   count: tableBody.length,
 *   getScrollElement: () => parentRef.current,
 *   estimateSize: () => 40,
 *   overscan: 10,
 * });
 * const columnVirtualizer = useVirtualizer({
 *   horizontal: true,
 *   count: tableHeader.length,
 *   getScrollElement: () => parentRef.current,
 *   estimateSize: () => 150,
 *   overscan: 2,
 * });
 *   const headerRow = { index: 0, start: 0, size: 54, end: 54, key: 'header', lane: 0 };
 *
 * <VirtualTable ref={parentRef} tableHeight={500}>
 *   <VirtualTableHeader columnVirtualizer={columnVirtualizer} className={styles.header}>
 *     <VirtualTableRow row={headerRow} className={styles.bodyRow}>
 *       {columnVirtualizer.getVirtualItems().map((col) => (
 *         <VirtualTableCell
 *           key={col.key}
 *           style={{
 *             transform: `translateX(${col.start}px)`,
 *             width: `${col.size}px`,
 *           }}
 *           className={`${styles.headerCell} ${styles.virtualCell}`}
 *         >
 *           {tableHeader[col.index]}
 *         </VirtualTableCell>
 *       ))}
 *     </VirtualTableRow>
 *   </VirtualTableHeader>
 *   <VirtualTableBody
 *     rowVirtualizer={rowVirtualizer}
 *     columnVirtualizer={columnVirtualizer}
 *     className={styles.bodyContainer}
 *     style={{
 *       height: `${rowVirtualizer.getTotalSize()}px`,
 *       width: `${columnVirtualizer.getTotalSize()}px`,
 *     }}
 *   >
 *     {rowVirtualizer.getVirtualItems().map((row) => (
 *       <VirtualTableRow key={row.key} row={row} className={styles.bodyRow}>
 *         {columnVirtualizer.getVirtualItems().map((col) => (
 *           <VirtualTableCell
 *             key={col.key}
 *             className={`${styles.bodyCell} ${styles.virtualCell}`}
 *             style={{
 *               transform: `translateX(${col.start}px)`,
 *               width: `${col.size}px`,
 *             }}
 *           >
 *             {tableBody[row.index][col.index]}
 *           </VirtualTableCell>
 *         ))}
 *       </VirtualTableRow>
 *     ))}
 *   </VirtualTableBody>
 * </VirtualTable>
 *
 * @param props - {@link VirtualTableProps}
 * @returns A virtualized table component.
 */

interface VirtualTableProps {
  headerData?: string[];
  bodyData?: string[][];
  tableHeight: number;
  cellHeight?: number;
  cellWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

const VirtualTable = forwardRef<HTMLDivElement, VirtualTableProps>(
  (
    {
      bodyData = [],
      headerData = [],
      tableHeight = 500,
      cellHeight = 35,
      cellWidth = 300,
      children,
      className = '',
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    // Use forwarded ref if provided, otherwise use internal ref
    const parentRef = ref as React.RefObject<HTMLDivElement | null>;

    // Calculate dynamic column width to ensure columns span at least the full container width
    const calculateColumnWidth = () => {
      if (headerData.length === 0) {
        return cellWidth;
      }

      const totalMinWidth = headerData.length * cellWidth;

      // If total columns would be smaller than container, expand them
      if (totalMinWidth < containerWidth) {
        return Math.max(cellWidth, containerWidth / headerData.length);
      }

      return cellWidth;
    };

    // Set up resize observer to track container width changes
    useEffect(() => {
      const currentRef = internalRef.current;
      if (!currentRef) return;

      const updateWidth = () => {
        setContainerWidth(currentRef.offsetWidth);
      };

      // Initial width measurement
      updateWidth();

      // Set up ResizeObserver for dynamic width updates
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(currentRef);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const rowVirtualizer = useVirtualizer({
      count: bodyData.length,
      getScrollElement: () => internalRef.current,
      estimateSize: () => cellHeight,
      overscan: 10,
    });

    const columnVirtualizer = useVirtualizer({
      horizontal: true,
      count: headerData.length,
      getScrollElement: () => internalRef.current,
      estimateSize: () => calculateColumnWidth(),
      overscan: 2,
    });

    return bodyData && headerData && headerData.length > 0 && bodyData.length > 0 ? (
      <div
        ref={internalRef}
        role="table"
        className={clsx(className, styles.tableContainer)}
        style={{ height: tableHeight }}
      >
        <>
          <VirtualTableHeader
            columnVirtualizer={columnVirtualizer}
            height={54}
            headerData={headerData}
          />

          <VirtualTableBody
            rowVirtualizer={rowVirtualizer}
            columnVirtualizer={columnVirtualizer}
            bodyData={bodyData}
          />
        </>
      </div>
    ) : (
      <div
        ref={parentRef}
        className={clsx(className, styles.tableContainer)}
        style={{ height: tableHeight }}
        role="table"
      >
        {children}
      </div>
    );
  },
);

export default VirtualTable;
