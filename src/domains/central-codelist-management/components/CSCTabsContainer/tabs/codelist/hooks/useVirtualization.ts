import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { getTextWidth } from '@/core/utils/getTextWidth';
import { TableRowType } from '@/design-system/molecules/Table';

interface UseVirtualizationProps {
  headers?: string[];
  tableData: TableRowType[];
  editable?: boolean;
  setTableData: (data: TableRowType[]) => void;
}

export const useVirtualization = ({
  headers,
  tableData,
  editable,
  setTableData,
}: UseVirtualizationProps) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const parentRef = useRef<HTMLDivElement | null>(null);

  // Set up resize observer to track container width changes
  useEffect(() => {
    const currentRef = parentRef.current;
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

  // Calculate column widths
  useEffect(() => {
    const font = '14px "Source Sans 3"';
    const padding = 32;
    const maxWidth = 350;
    const minWidth = 340; // Increased minimum width from 80px to 340px
    // Additional space for sort icon in read mode
    const sortIconSpace = 32; // 20px icon + 12px gap

    // In edit mode with no headers, ensure we have at least 2 columns with default width
    if (editable && (!headers || headers.length === 0)) {
      const defaultWidths = [maxWidth, maxWidth];

      // If container is wider than default widths, expand them
      if (containerWidth > 0) {
        const totalDefaultWidth = defaultWidths.reduce((sum, width) => sum + width, 0);
        if (totalDefaultWidth < containerWidth) {
          const expandedWidth = containerWidth / defaultWidths.length;
          setColumnWidths(defaultWidths.map(() => Math.max(minWidth, expandedWidth)));

          return;
        }
      }

      setColumnWidths(defaultWidths);

      return;
    }

    // For read mode, if no headers but we have data, create default column widths
    if (!editable && (!headers || headers.length === 0) && tableData.length > 0) {
      // Determine number of columns from first row of data
      const firstRow = tableData[0];
      const columnCount = firstRow ? Object.keys(firstRow).length : 0;
      if (columnCount > 0) {
        const defaultWidths = Array(columnCount).fill(maxWidth);

        // If container is wider, expand columns to fill
        if (containerWidth > 0) {
          const totalDefaultWidth = defaultWidths.reduce((sum, width) => sum + width, 0);
          if (totalDefaultWidth < containerWidth) {
            const expandedWidth = containerWidth / columnCount;
            setColumnWidths(Array(columnCount).fill(Math.max(minWidth, expandedWidth)));

            return;
          }
        }

        setColumnWidths(defaultWidths);

        return;
      }
    }

    if (!headers || headers.length === 0) return;

    const calculatedWidths = headers.map((header) => {
      if (editable) {
        return Math.max(maxWidth, minWidth); // Ensure minimum width in edit mode
      }

      const headerText = header ?? '';
      let maxTextWidth = getTextWidth(headerText, font);

      if (tableData.length > 0) {
        tableData.forEach((row) => {
          const cellValue = row[header];
          const cellText = cellValue !== null && cellValue !== undefined ? String(cellValue) : '';
          const cellWidth = getTextWidth(cellText, font);
          if (cellWidth > maxTextWidth) {
            maxTextWidth = cellWidth;
          }
        });
      }

      // Add extra space for sort icon in read mode
      const totalPadding = padding + (!editable ? sortIconSpace : 0);

      return Math.min(
        Math.max(maxTextWidth + totalPadding, minWidth),
        Math.max(maxWidth, minWidth),
      );
    });

    // Ensure columns collectively take up at least the full container width
    if (containerWidth > 0) {
      const totalCalculatedWidth = calculatedWidths.reduce((sum, width) => sum + width, 0);

      if (totalCalculatedWidth < containerWidth) {
        // Expand columns proportionally to fill the container
        const scaleFactor = containerWidth / totalCalculatedWidth;
        const expandedWidths = calculatedWidths.map((width) =>
          Math.max(width * scaleFactor, minWidth),
        );
        setColumnWidths(expandedWidths);

        return;
      }
    }

    setColumnWidths(calculatedWidths);
  }, [editable, headers, tableData, containerWidth]);

  const rowVirtualizer = useVirtualizer({
    count: tableData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: headers?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: (i: number) => columnWidths[i] ?? 350,
    overscan: 2,
    getItemKey: (i: number) => headers?.[i] ?? i,
  });

  const headerRow = useMemo(
    () => ({ index: 1, start: 1, size: 54, end: 54, key: 'header', lane: 0 }),
    [],
  );

  const headerRow2 = useMemo(
    () => ({ index: 0, start: 0, size: 54, end: 54, key: 'actions', lane: 0 }),
    [],
  );

  const selectedItems = useMemo(
    () => [
      { label: '5', value: '5' },
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
    ],
    [],
  );

  const handlePageChange = (page: number) => {
    if (!editable) {
      setCurrentPage(page);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setTableData(tableData.slice(startIndex, endIndex));
    }
  };

  const handleSelectChange = (value: string) => {
    if (editable) return;
    const newPageSize = Number(value);
    setCurrentPage(1);
    setPageSize(newPageSize);

    const startIndex = 0;
    const endIndex = startIndex + newPageSize;
    setTableData(tableData.slice(startIndex, endIndex));
  };

  return {
    columnWidths,
    pageSize,
    currentPage,
    parentRef,
    rowVirtualizer,
    columnVirtualizer,
    headerRow,
    headerRow2,
    selectedItems,
    setCurrentPage,
    handlePageChange,
    handleSelectChange,
  };
};
