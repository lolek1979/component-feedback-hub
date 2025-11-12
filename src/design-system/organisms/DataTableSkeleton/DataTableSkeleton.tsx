'use client';

import { Skeleton } from '@/design-system/atoms';

import styles from './DataTableSkeleton.module.css';

/**
 * Supported skeleton sizes for DataTableSkeleton.
 *
 * - 'quarter': 1 row
 * - 'half': 2 rows
 * - 'full': 4 rows
 * - number: custom row count
 */
type SkeletonSize = 'quarter' | 'half' | 'full';

/**
 * Props for the DataTableSkeleton component.
 *
 * @property size - Skeleton size or custom row count.
 */
interface DataTableSkeletonProps {
  size?: SkeletonSize | number;
}

/**
 * DataTableSkeleton component for displaying a loading skeleton for data tables.
 *
 * Renders a configurable number of skeleton rows and columns to mimic table structure.
 *
 * @param props DataTableSkeletonProps
 * @returns React component
 */
const DataTableSkeleton = ({ size = 'full' }: DataTableSkeletonProps) => {
  const getRowCount = () => {
    if (typeof size === 'number') return size;

    switch (size) {
      case 'quarter':
        return 1;
      case 'half':
        return 2;
      case 'full':
      default:
        return 4;
    }
  };

  const rowCount = getRowCount();
  const rows = [];

  for (let i = 0; i < rowCount; i++) {
    rows.push(
      <div
        key={`skeleton-table-${i}`}
        id={`data-table-skeleton-${i}`}
        data-testid={`data-table-skeleton-${i}`}
        className={styles.skeletonTable}
      >
        <div key={`skeleton-row-${i}-0`} className={styles.skeletonRow}>
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="270px" />
          <Skeleton maxWidth="170px" />
          <Skeleton maxWidth="170px" />
          <Skeleton />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="70px" />
        </div>
        <div key={`skeleton-row-${i}-1`} className={styles.skeletonRow}>
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="270px" />
          <Skeleton maxWidth="170px" />
          <Skeleton maxWidth="170px" />
          <Skeleton />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="70px" />
        </div>
        <div key={`skeleton-row-${i}-2`} className={styles.skeletonRow}>
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="270px" />
          <Skeleton maxWidth="170px" />
          <Skeleton maxWidth="170px" />
          <Skeleton />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="70px" />
        </div>
        <div key={`skeleton-row-${i}-3`} className={styles.skeletonRow}>
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="270px" />
          <Skeleton maxWidth="170px" />
          <Skeleton maxWidth="170px" />
          <Skeleton />
          <Skeleton maxWidth="200px" />
          <Skeleton maxWidth="70px" />
        </div>
      </div>,
    );
  }

  return (
    <div
      id="data-table-skeleton"
      data-testid="data-table-skeleton"
      className={styles.skeletonTable}
    >
      {rows}
    </div>
  );
};

export default DataTableSkeleton;
