import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useVirtualizer } from '@tanstack/react-virtual';

import VirtualTableBody from './VirtualComponents/VirtualTableBody';
import VirtualTableCell from './VirtualComponents/VirtualTableCell';
import VirtualTableHeader from './VirtualComponents/VirtualTableHeader';
import VirtualTableRow from './VirtualComponents/VirtualTableRow';
import VirtualTable from './VirtualTable';
import styles from './VirtualTable.module.css';

const tableHeader = ['Header 1', 'Header 2', 'Header 3', 'Header 4', 'Header 5', 'Header 6'];
const tableBody = Array.from({ length: 500 }, (_, rowIdx) =>
  Array.from({ length: 6 }, (_, colIdx) => `Row ${rowIdx + 1} Col ${colIdx + 1}`),
);

const meta: Meta<typeof VirtualTable> = {
  title: 'Molecules/VirtualTable',
  component: VirtualTable,
};

export default meta;

type Story = StoryObj<typeof VirtualTable>;

export const Default: Story = {
  args: {
    headerData: tableHeader,
    bodyData: tableBody,
    cellHeight: 40,
    tableHeight: 300,
  },
};

const CustomChildrenComponent = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  // Virtualizers for custom mode
  const rowVirtualizer = useVirtualizer({
    count: tableBody.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: tableHeader.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 2,
  });

  const headerRow = { index: 0, start: 0, size: 54, end: 54, key: 'header', lane: 0 };

  return (
    <VirtualTable ref={parentRef} tableHeight={300}>
      <VirtualTableHeader columnVirtualizer={columnVirtualizer} className={styles.header}>
        <VirtualTableRow row={headerRow} className={styles.bodyRow}>
          {columnVirtualizer.getVirtualItems().map((col) => (
            <VirtualTableCell
              key={col.key}
              style={{
                transform: `translateX(${col.start}px)`,
                width: `${col.size}px`,
              }}
              className={`${styles.headerCell} ${styles.virtualCell}`}
            >
              {tableHeader[col.index]}
            </VirtualTableCell>
          ))}
        </VirtualTableRow>
      </VirtualTableHeader>
      <VirtualTableBody
        rowVirtualizer={rowVirtualizer}
        columnVirtualizer={columnVirtualizer}
        className={styles.bodyContainer}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) => (
          <VirtualTableRow key={row.key} row={row} className={styles.bodyRow}>
            {columnVirtualizer.getVirtualItems().map((col) => (
              <VirtualTableCell
                key={col.key}
                className={`${styles.bodyCell} ${styles.virtualCell}`}
                style={{
                  transform: `translateX(${col.start}px)`,
                  width: `${col.size}px`,
                }}
              >
                {tableBody[row.index][col.index]}
              </VirtualTableCell>
            ))}
          </VirtualTableRow>
        ))}
      </VirtualTableBody>
    </VirtualTable>
  );
};

export const CustomChildren: Story = {
  render: () => <CustomChildrenComponent />,
};
