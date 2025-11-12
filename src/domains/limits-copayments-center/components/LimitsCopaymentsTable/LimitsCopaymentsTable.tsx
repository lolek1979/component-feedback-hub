import React, { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { getNextSortDirection } from '@/core/utils/table';
import { SortDirection } from '@/core/utils/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tag,
  Typography,
} from '@/design-system/molecules';
import { TableSettingsPopover } from '@/design-system/molecules/Table/partials/TableSettingsPopover';
import DataTableSkeleton from '@/design-system/organisms/DataTableSkeleton/DataTableSkeleton';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';

import styles from './LimitsCopaymentsTable.module.css';
import { handleColumnVisibilityChange } from './utils';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

export type ComplaintStatus = 'registered' | 'cancelled' | 'resolved' | 'in-progress';

export interface ComplaintRecord {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  status: ComplaintStatus;
  result?: string;
  assignedGroup?: string;
  assignee?: string;
  regionalOffice?: string;
  created: string;
  period: string;
}

interface LimitsCopaymentsTableProps {
  displayedRecords: ComplaintRecord[];
  visibleColumns: { [key: string]: boolean };
  setVisibleColumns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  sortDirection: SortDirection;
  handleSort: (column: keyof ComplaintRecord, newDirection: SortDirection) => void;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
  getStatusVariant: (status: ComplaintStatus) => string;
  getStatusLabel: (status: ComplaintStatus) => string;
  isLoading: boolean;
  footer?: boolean;
  isCLDComplAppr?: boolean;
}

export const LimitsCopaymentsTable: React.FC<LimitsCopaymentsTableProps> = ({
  displayedRecords,
  visibleColumns,
  setVisibleColumns,
  sortDirection,
  handleSort,
  totalCount,
  pageSize,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
  getStatusVariant,
  getStatusLabel,
  isLoading,
  footer,
  isCLDComplAppr = false,
}) => {
  const tTable = useTranslations(isCLDComplAppr ? 'BOTable' : 'KDPTable.complaintsTable');
  const tableSettingsItems = ['name'];

  const keys = useMemo(() => {
    if (isCLDComplAppr) {
      return [
        { label: tTable('name'), value: 'name' },
        { label: tTable('firstName'), value: 'firstName' },
        { label: tTable('status'), value: 'status' },
        { label: tTable('result'), value: 'result' },
        { label: tTable('assignedGroup'), value: 'assignedGroup' },
        { label: tTable('assignee'), value: 'assignee' },
        { label: tTable('regionalOffice'), value: 'regionalOffice' },
        { label: tTable('createdDate'), value: 'created' },
        { label: tTable('expiryDate'), value: 'period' },
      ];
    }

    return [
      { label: tTable('complaintName'), value: 'name' },
      { label: tTable('status'), value: 'status' },
      { label: tTable('created'), value: 'created' },
      { label: tTable('period'), value: 'period' },
    ];
  }, [tTable, isCLDComplAppr]);

  const handleColumnVisibilityChangeCallback = useCallback(
    (excludedKeys: string[]) => {
      handleColumnVisibilityChange(setVisibleColumns, excludedKeys, keys);
    },
    [setVisibleColumns, keys],
  );

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <>
      <Table>
        <TableHead className={styles.tableHead}>
          <TableRow>
            {visibleColumns.name && (
              <TableCell
                isHeader
                isSort
                columnIndex={1}
                onClick={() => handleSort('name', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">
                  {isCLDComplAppr ? tTable('name') : tTable('complaintName')}
                </Typography>
              </TableCell>
            )}

            {isCLDComplAppr && visibleColumns.firstName && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={2}
                onClick={() => handleSort('firstName', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">{tTable('firstName')}</Typography>
              </TableCell>
            )}

            {visibleColumns.status && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={3}
                onClick={
                  isCLDComplAppr
                    ? () => handleSort('status', getNextSortDirection(sortDirection))
                    : undefined
                }
              >
                <Typography variant="Subtitle/Default/Regular">{tTable('status')}</Typography>
              </TableCell>
            )}

            {isCLDComplAppr && visibleColumns.result && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={4}
                onClick={() => handleSort('result', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">{tTable('result')}</Typography>
              </TableCell>
            )}

            {isCLDComplAppr && visibleColumns.assignedGroup && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={5}
                onClick={() => handleSort('assignedGroup', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">
                  {tTable('assignedGroup')}
                </Typography>
              </TableCell>
            )}

            {isCLDComplAppr && visibleColumns.assignee && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={6}
                onClick={() => handleSort('assignee', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">{tTable('assignee')}</Typography>
              </TableCell>
            )}

            {isCLDComplAppr && visibleColumns.regionalOffice && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={7}
                onClick={() => handleSort('regionalOffice', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">
                  {tTable('regionalOffice')}
                </Typography>
              </TableCell>
            )}

            {visibleColumns.created && (
              <TableCell
                isHeader
                isSort
                columnIndex={isCLDComplAppr ? 8 : 2}
                onClick={() => handleSort('created', getNextSortDirection(sortDirection))}
              >
                <Typography variant="Subtitle/Default/Regular">
                  {isCLDComplAppr ? tTable('createdDate') : tTable('created')}
                </Typography>
              </TableCell>
            )}

            {visibleColumns.period && (
              <TableCell
                isHeader
                isSort={isCLDComplAppr}
                columnIndex={isCLDComplAppr ? 9 : undefined}
                onClick={
                  isCLDComplAppr
                    ? () => handleSort('period', getNextSortDirection(sortDirection))
                    : undefined
                }
              >
                <Typography variant="Subtitle/Default/Regular">
                  {isCLDComplAppr ? tTable('expiryDate') : tTable('period')}
                </Typography>
              </TableCell>
            )}

            <TableCell isHeader align="right">
              <div className={styles.tableSettingsButton}>
                <TableSettingsPopover
                  keys={keys}
                  key="settings"
                  onOptionsChange={handleColumnVisibilityChangeCallback}
                  disabledItems={tableSettingsItems}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody className={styles.tableBody}>
          {displayedRecords.map((record: ComplaintRecord, index: number) => (
            <TableRow key={record.id}>
              {visibleColumns.name && (
                <TableCell className={styles.cellContent}>
                  <Typography variant="Subtitle/Default/Bold">{record.name}</Typography>
                </TableCell>
              )}
              {isCLDComplAppr && visibleColumns.firstName && (
                <TableCell>
                  <Typography variant="Caption/Regular">
                    {record.firstName} {record.lastName}
                  </Typography>
                </TableCell>
              )}
              {visibleColumns.status && (
                <TableCell className={styles.status}>
                  <Tag
                    id={`tag-complaint-${record.status}-${index}`}
                    variant={getStatusVariant(record.status)}
                  >
                    {getStatusLabel(record.status)}
                  </Tag>
                </TableCell>
              )}
              {isCLDComplAppr && visibleColumns.result && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.result}</Typography>
                </TableCell>
              )}
              {isCLDComplAppr && visibleColumns.assignedGroup && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.assignedGroup}</Typography>
                </TableCell>
              )}
              {isCLDComplAppr && visibleColumns.assignee && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.assignee}</Typography>
                </TableCell>
              )}
              {isCLDComplAppr && visibleColumns.regionalOffice && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.regionalOffice}</Typography>
                </TableCell>
              )}
              {visibleColumns.created && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.created}</Typography>
                </TableCell>
              )}
              {visibleColumns.period && (
                <TableCell>
                  <Typography variant="Caption/Regular">{record.period}</Typography>
                </TableCell>
              )}
              <TableCell align="right">{/* Placeholder for actions */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {footer && (
        <TableFooter
          selectItems={PAGE_SIZE_OPTIONS}
          onSelectChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          pageCount={Math.ceil(totalCount / pageSize)}
          totalCount={totalCount}
          value={pageSize.toString()}
          currPage={currentPage + 1}
        />
      )}
    </>
  );
};
