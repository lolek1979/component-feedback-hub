import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Iinfo from '@/core/assets/icons/block.svg';
import { AppLink, Badge, Text } from '@/design-system/atoms';
import {
  InlineMessage,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tag,
} from '@/design-system/molecules';
import { TableSettingsPopover } from '@/design-system/molecules/Table/partials/TableSettingsPopover';
import { Table } from '@/design-system/molecules/Table/Table';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';
import { Version } from '@/domains/central-codelist-management/types';
import { handleColumnVisibilityChange } from '@/domains/central-codelist-management/utils';

import { CSCFilter, FilterState } from '../../../CSCFilter';
import styles from './VersionsTab.module.css';

type LocalFilterState = FilterState;

const PAGE_SIZE_OPTIONS = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
];

export const VersionsTab = ({
  data,
  parentId,
  codeListId,
}: {
  data: Version[] | undefined;
  parentId: string[] | undefined;
  codeListId: string;
}) => {
  const t = useTranslations('CSCTabsContainer.filter');
  const tTh = useTranslations('Table');

  const tStates = useTranslations('statuses');
  const h = useTranslations('CSCTableHeaders');
  const [filter, setFilter] = useState<LocalFilterState>({
    search: '',
    types: [],
    states: [],
    showSubconcepts: false,
  });
  const tKeys = useTranslations('keys');
  const tableSettingsItems = ['name'];
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(Number(PAGE_SIZE_OPTIONS[0].value));
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof Version | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>('none');
  const keys = [
    { label: tKeys('name'), value: 'name' },
    { label: tKeys('type'), value: 'type' },
    { label: tKeys('status'), value: 'status' },
    { label: tKeys('validFrom'), value: 'validFrom' },
  ];

  const hasActiveFilters = filter.search.trim() || filter.types.length > 0;
  const emptySearchMessage = hasActiveFilters ? tTh('filterError') : tTh('noCSCData');

  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    name: true,
    type: true,
    status: true,
    validFrom: true,
  });
  useEffect(() => {
    if (data) {
      setTotalCount(data.length);
    }
  }, [data]);

  const filterItems = {
    types: [
      { value: 'External', label: t('types.external') },
      { value: 'Internal', label: t('types.internal') },
      { value: 'InternalPublic', label: t('types.internalPublic') },
      { value: 'InternalPaid', label: t('types.internalPaid') },
    ],
  };

  const handleColumnVisibilityChangeCallback = (excludedKeys: string[]) => {
    handleColumnVisibilityChange(setVisibleColumns, excludedKeys, keys);
  };

  const handleFilterChange = (newFilter: LocalFilterState) => {
    setFilter(newFilter);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
  }, []);

  const getStatus = (data: Version[]) => {
    const currentDate = new Date().toISOString();
    const status: string[] = [];

    data.forEach((item) => {
      const validFrom = new Date(item.validFrom).toISOString();
      const validTo = item.validTo ? new Date(item.validTo).toISOString() : null;

      if (validTo && currentDate > validTo) {
        status.push('expired');
      } else if (currentDate >= validFrom) {
        status.push('active');
      } else {
        status.push('planned');
      }
    });

    return status;
  };
  const status = getStatus(data || []);
  const handleSort = (column: keyof Version, direction: 'asc' | 'desc' | 'none') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const filteredData = useCallback(() => {
    if (!data) return [];

    const searchTerm = filter.search.trim().toLowerCase();

    return data.filter((item) => {
      if (item.id === codeListId) return false;

      const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm);
      const matchesType = filter.types.length === 0 || filter.types.includes(item.versionType);

      return matchesSearch && matchesType;
    });
  }, [data, filter.search, filter.types, codeListId]);

  const sortedData = useCallback(() => {
    const filtered = filteredData();
    if (sortDirection === 'none' || !sortColumn) {
      const start = currentPage * pageSize;
      const end = start + pageSize;

      return filtered.slice(start, end);
    }

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || bValue === null) return 0;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

    const start = currentPage * pageSize;
    const end = start + pageSize;

    return sorted.slice(start, end);
  }, [filteredData, sortDirection, sortColumn, currentPage, pageSize]);

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return tStates('active');
      case 'planned':
        return tStates('planned');
      case 'expired':
        return tStates('expired');
      default:
        return status;
    }
  };

  useEffect(() => {
    setTotalCount(filteredData().length);
  }, [filteredData]);

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <CSCFilter
          onFilterChange={handleFilterChange}
          types={filterItems.types}
          initialValues={filter}
          showSubconceptsFilter={false}
        />
      </div>
      <Table>
        {sortedData().length ? (
          <TableHead className={styles.tableHead}>
            <TableRow>
              {visibleColumns.name && (
                <TableCell
                  isHeader
                  isSort
                  onClick={() =>
                    handleSort(
                      'name',
                      sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? 'none' : 'asc',
                    )
                  }
                >
                  <Text variant="subtitle" regular>
                    {h('name')}
                  </Text>
                </TableCell>
              )}

              {visibleColumns.type && (
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {h('type')}
                  </Text>
                </TableCell>
              )}

              {visibleColumns.status && (
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {h('state')}
                  </Text>
                </TableCell>
              )}

              {visibleColumns.validFrom && (
                <TableCell
                  isHeader
                  isSort
                  onClick={() =>
                    handleSort(
                      'validFrom',
                      sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? 'none' : 'asc',
                    )
                  }
                >
                  <Text variant="subtitle" regular>
                    {h('validFrom')}
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
        ) : null}
        <TableBody className={styles.tableBody}>
          {sortedData().length ? (
            sortedData()!.map((item, index) => (
              <TableRow key={item.id}>
                {visibleColumns.name && (
                  <TableCell>
                    <Text variant="caption">
                      <AppLink
                        link={`/centralni-sprava-ciselniku/${item.id}?parent=${parentId}`}
                        target={'_self'}
                        variant="primary"
                        id={`link-versions-tab-${index}`}
                      >
                        <Text variant="footnote">{item.name}</Text>
                      </AppLink>
                    </Text>
                  </TableCell>
                )}
                {visibleColumns.type ? (
                  <TableCell>
                    <Badge>
                      {item.versionType === 'Internal' ? (
                        <Text variant="caption">Interní</Text>
                      ) : item.versionType === 'InternalPaid' ? (
                        <Text variant="caption">Interní - Placený</Text>
                      ) : item.versionType === 'InternalPublic' ? (
                        <Text variant="caption">Interní - Veřejný</Text>
                      ) : item.versionType === 'External' ? (
                        <Text variant="caption">Externí</Text>
                      ) : (
                        ''
                      )}
                    </Badge>
                  </TableCell>
                ) : null}
                {visibleColumns.status && (
                  <TableCell>
                    <Tag
                      id={'tag-versions-tab-' + index}
                      variant={status[data?.indexOf(item) ?? 0]}
                    >
                      <Text variant="caption">
                        {data && translateStatus(status[data.indexOf(item)])}
                      </Text>
                    </Tag>
                  </TableCell>
                )}
                {visibleColumns.validFrom && (
                  <TableCell>
                    <Text variant="caption">
                      {new Date(item.validFrom).toLocaleDateString('cs-CZ')}
                    </Text>
                  </TableCell>
                )}
                <TableCell align="right" />
              </TableRow>
            ))
          ) : (
            <InlineMessage
              id="inline-message-version-tab-no-data"
              icon={
                <Iinfo
                  id="icon-version-tab-info"
                  className={styles.inlineMessage}
                  width={24}
                  height={24}
                />
              }
              message={emptySearchMessage}
              variant="info"
            />
          )}
        </TableBody>
      </Table>
      {sortedData().length ? (
        <TableFooter
          selectItems={PAGE_SIZE_OPTIONS}
          onSelectChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          pageCount={Math.ceil(totalCount / pageSize)}
          totalCount={totalCount}
          currPage={currentPage + 1}
          value={pageSize.toString()}
        />
      ) : null}
    </div>
  );
};
