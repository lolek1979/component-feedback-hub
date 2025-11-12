'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { Text } from '@/design-system/atoms';

import styles from './ProcessesList.module.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const t = useTranslations('administrativeProceedings');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    return columns.reduce((acc, column) => {
      if ('id' in column) {
        // @ts-ignore
        acc[column.id as string] = !column.meta?.isHiddenByDefault;
      }

      return acc;
    }, {} as VisibilityState);
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div
      id="admin-processes-list-data-table"
      data-testid="admin-processes-list-data-table"
      className={styles.tableContainer}
    >
      <Table className={styles.table}>
        <TableHeader className={styles.tableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <Text variant="subtitle" regular>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Text>
                  </TableHead>
                );
              })}
              {/* Keep it hidden for now; uncomment it for the next iteration
              <TableHead>
                <ColumnsVisibility table={table} />
              </TableHead>
              */}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={styles.tableBody}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={styles.tableRow}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <Text variant="subtitle" regular>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Text>
                  </TableCell>
                ))}
                {/* Keep it hidden for now; uncomment it for the next iteration
                <TableCell>
                  <MoreOptions rowData={row.original as AdminProcessTableRow} />
                </TableCell>
                */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className={styles.emptyTableCell}>
                {t('noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
