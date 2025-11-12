'use client';

import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Option, Select, Text } from '@/design-system/atoms';
import { Pagination } from '@/design-system/molecules';
import { TableContext } from '@/design-system/molecules/Table';

import styles from './TableFooter.module.css';

/**
 * Props for the TableFooter component.
 *
 * @property selectItems - Array of selectable row count options (label and value).
 * @property onSelectChange - Callback when row count selection changes.
 * @property onPageChange - Callback when page changes.
 * @property pageCount - Total number of pages.
 * @property totalCount - Total number of records.
 * @property value - Currently selected row count value.
 * @property currPage - Currently active page number.
 */
interface TableFooterProps {
  selectItems: Array<{ label: string; value: string }>;
  onSelectChange: (value: string) => void;
  onPageChange: (page: number) => void;
  pageCount: number;
  totalCount: number;
  value?: string;
  currPage?: number;
}

/**
 * TableFooter component for table pagination and row count selection.
 *
 * Renders a select for rows per page, record range, and pagination controls.
 *
 * @param props TableFooterProps
 * @returns React component
 */
export const TableFooter = ({
  selectItems = [],
  onSelectChange,
  onPageChange,
  pageCount,
  totalCount,
  value,
  currPage,
}: TableFooterProps) => {
  const t = useTranslations('TableFooter');
  const { pageSize, setPageSize, currentPage, setCurrentPage } = useContext(TableContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialRender, setInitialRender] = useState(true);

  const actualPageSize = value ? Number(value) : pageSize;

  useEffect(() => {
    if (initialRender && value) {
      onSelectChange(value);
      setInitialRender(false);
    }
  }, [initialRender, onSelectChange, value]);

  const handleSelectChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    onSelectChange(value);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const startRecord = Math.min(((currPage || currentPage) - 1) * actualPageSize + 1, totalCount);
  const endRecord = Math.min((currPage || currentPage) * actualPageSize, totalCount);

  return (
    <div
      style={isOpen ? { paddingBottom: '240px' } : undefined}
      className={styles.tableFooterContainer}
    >
      <div className={styles.footerLeft}>
        <div className={styles.selectContainer}>
          <div>
            <Select
              id="select-rows-per-page"
              setIsOpenFooter={setIsOpen}
              onChange={handleSelectChange}
              defaultValue={selectItems.length > 0 ? selectItems[0].value : '5'}
              value={value || pageSize.toString()}
            >
              {selectItems.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>

          {selectItems.length > 0 && (
            <Text variant="subtitle" regular selectable={false} className={styles.rowsPerPage}>
              {t('rowsPerPage') + ` (${startRecord}-${endRecord} z ${totalCount})`}
            </Text>
          )}
        </div>
      </div>
      <div>
        {selectItems.length > 0 && (
          <Pagination
            pageCount={pageCount}
            currPage={currPage || currentPage}
            onChange={handlePageClick}
          />
        )}
      </div>
    </div>
  );
};
