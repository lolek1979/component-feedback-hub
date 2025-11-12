import React from 'react';
import { useTranslations } from 'next-intl';

import DraftIcon from '@/core/assets/icons/icon-draft.svg';
import SubArrowIcon from '@/core/assets/icons/subdirectory_arrow_right.svg';
import { getNextSortDirection } from '@/core/utils/table';
import { SortDirection } from '@/core/utils/types';
import { Text } from '@/design-system/atoms';
import { AppLink, Badge, Tooltip } from '@/design-system/atoms';
import { Table, TableBody, TableCell, TableHead, TableRow, Tag } from '@/design-system/molecules';
import { TableSettingsPopover } from '@/design-system/molecules/Table/partials/TableSettingsPopover';
import DataTableSkeleton from '@/design-system/organisms/DataTableSkeleton/DataTableSkeleton';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';
import {
  capitalizeFirstLetter,
  handleColumnVisibilityChange,
} from '@/domains/central-codelist-management/utils';

import styles from '../index.module.css';
import { TableRecord } from '../types';
import { FilterState } from './CSCFilter';
import { CiselnikStatus } from './RowActionsList';
import { StatusRowActions } from './StatusRowActions';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

interface CSCDataTableProps {
  displayedRecords: TableRecord[];
  visibleColumns: { [key: string]: boolean };
  setVisibleColumns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  sortDirection: SortDirection;
  handleSort: (column: keyof TableRecord, newDirection: SortDirection) => void;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
  filters: FilterState;
  getVersionType: (versionType: string) => string;
  translateStatus: (status: string) => string;
  isLoading: boolean;
}

export const CSCDataTable: React.FC<CSCDataTableProps> = ({
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
  filters,
  getVersionType,
  translateStatus,
  isLoading,
}) => {
  const t = useTranslations('CSCTableHeaders');
  const tKeys = useTranslations('keys');
  const tStates = useTranslations('statuses');
  const tableSettingsItems = ['name'];

  const keys = [
    { label: tKeys('name'), value: 'name' },
    { label: tKeys('type'), value: 'type' },
    { label: tKeys('status'), value: 'status' },
    { label: tKeys('validFrom'), value: 'validFrom' },
  ];

  const handleColumnVisibilityChangeCallback = (excludedKeys: string[]) => {
    handleColumnVisibilityChange(setVisibleColumns, excludedKeys, keys);
  };

  return (
    <>
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                {visibleColumns.name && (
                  <TableCell
                    isHeader
                    isSort
                    columnIndex={1}
                    onClick={() => handleSort('name', getNextSortDirection(sortDirection))}
                  >
                    <Text variant="subtitle" regular>
                      {t('name')}
                    </Text>
                  </TableCell>
                )}

                {visibleColumns.type && (
                  <TableCell isHeader>
                    <Text variant="subtitle" regular>
                      {t('type')}
                    </Text>
                  </TableCell>
                )}

                {visibleColumns.status && (
                  <TableCell isHeader>
                    <Text variant="subtitle" regular>
                      {t('state')}
                    </Text>
                  </TableCell>
                )}

                {visibleColumns.validFrom && (
                  <TableCell
                    isHeader
                    isSort
                    columnIndex={2}
                    onClick={() => handleSort('validFrom', getNextSortDirection(sortDirection))}
                  >
                    <Text variant="subtitle" regular>
                      {t('validFrom')}
                    </Text>
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
              {displayedRecords.map((record: TableRecord, index: number) => (
                <TableRow
                  key={`${record.id}-${index}`}
                  className={
                    filters.showSubconcepts && record.isDuplicate
                      ? styles.dottedLine
                      : styles.tableRow
                  }
                >
                  <TableCell className={styles.cellContent}>
                    {((record.isDraft && record.isDuplicate) ||
                      (record.isSubVersion && record.status.includes('planned'))) &&
                      !filters.states.includes(tStates('planned')) && (
                        <SubArrowIcon
                          id={'icon-csc-page-arrow-' + index}
                          width={24}
                          height={24}
                          className={'icon_black-950'}
                        />
                      )}
                    {record.name.length > 25 ? (
                      <Tooltip
                        placement="tooltipRight"
                        content={record.name}
                        className={styles.cscTitle}
                        variant="inverse"
                        id={`tooltip-csc-name-${index}`}
                      >
                        <AppLink
                          link={`/centralni-sprava-ciselniku/${record.id}?parent=${record.codeListId}`}
                          target={'_self'}
                          variant="primary"
                          id={`link-csc-name-${index}`}
                        >
                          <Text variant="subtitle">
                            {' '}
                            {visibleColumns.name &&
                              (record.name.length > 25
                                ? record.name.slice(0, 25) + '...'
                                : record.name)}
                          </Text>
                        </AppLink>
                      </Tooltip>
                    ) : (
                      <AppLink
                        link={`/centralni-sprava-ciselniku/${record.id}?parent=${record.codeListId}`}
                        target={'_self'}
                        variant="primary"
                        id={`link-csc-name-${index}`}
                      >
                        <Text variant="subtitle">{visibleColumns.name && record.name}</Text>
                      </AppLink>
                    )}
                  </TableCell>
                  {visibleColumns.type && (
                    <TableCell>
                      <Badge>
                        <Text variant="caption" className={styles.badgeText}>
                          {getVersionType(record.versionType)}
                        </Text>
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell className={styles.status}>
                      {record.status.map((status: string, statusIndex: number) => (
                        <Tag
                          id={'tag-csc-' + status + '-' + index}
                          key={statusIndex}
                          variant={status.toLowerCase()}
                        >
                          {status === 'draft' ? (
                            <span className={styles.draftCount}>
                              <DraftIcon
                                id={'icon-csc-page-draft-' + index}
                                width={20}
                                height={20}
                                className={'icon_black-950'}
                              />
                              {translateStatus(status)}
                            </span>
                          ) : (
                            translateStatus(status)
                          )}
                        </Tag>
                      ))}
                      {record.draftCount && (
                        <Tag id={'tag-csc-draft-count-' + index} variant="draft">
                          <span className={styles.draftCount}>
                            <DraftIcon
                              id={'icon-csc-page-draft-count-' + index}
                              width={20}
                              height={20}
                              className={'icon_black-950'}
                            />
                            {record.draftCount}
                          </span>
                        </Tag>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.validFrom && (
                    <TableCell>
                      <Text variant="caption">
                        {new Date(record.validFrom).toLocaleDateString('cs-CZ')}
                      </Text>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <StatusRowActions
                      status={capitalizeFirstLetter(record.status[0]) as CiselnikStatus}
                      id={record.id}
                      index={index}
                      parentName={record.name}
                      parentValidFrom={record.validFrom}
                      parentId={record.codeListId}
                      state={record.versionType}
                      description={record.description}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter
            selectItems={PAGE_SIZE_OPTIONS}
            onSelectChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            pageCount={Math.ceil(totalCount / pageSize)}
            totalCount={totalCount}
            value={pageSize.toString()}
            currPage={currentPage + 1}
          />
        </>
      )}
    </>
  );
};
