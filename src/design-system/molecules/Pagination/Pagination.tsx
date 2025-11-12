'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Arrow from '@/core/assets/icons/keyboard_arrow_down.svg';
import { KeyboardShortcut } from '@/core/auth/ShortcutService';
import ComponentShortcutsProvider from '@/core/providers/ComponentShortcutsProvider';
import { Button } from '@/design-system/atoms/Button';

import styles from './Pagination.module.css';

/**
 * Props for the Pagination component.
 *
 * @property pageCount - Total number of pages.
 * @property currPage - Current active page (optional, for controlled usage).
 * @property onChange - Callback when the page changes.
 */
interface PaginationProps {
  pageCount: number;
  currPage?: number;
  onChange?: (page: number) => void;
}

/**
 * Pagination component for navigating between pages.
 *
 * Renders page buttons, navigation arrows, and supports keyboard shortcuts.
 *
 * @param props PaginationProps
 * @returns React component
 */

export const Pagination = ({ pageCount, onChange, currPage }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(currPage || 1);
  const tPagination = useTranslations('common.pagination');

  useEffect(() => {
    if (currPage) setCurrentPage(currPage);
  }, [currPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
    if (onChange) onChange(page);
  };

  const createPageButton = (page: number, isSpecial = false) => (
    <Button
      key={page}
      variant={currentPage === page ? 'primary' : 'tertiary'}
      size="small"
      onClick={() => handlePageChange(page)}
      aria-label={`${tPagination('page')} ${page}`}
      className={styles.pageButton}
      id={
        isSpecial
          ? `button-${page === 1 ? 'pagination-first' : `sum-of-pages-${page}`}`
          : `button-pagination-page-${page}`
      }
    >
      {page}
    </Button>
  );

  const createDots = (key: string) => (
    <span key={key} aria-hidden="true" className={styles.dots}>
      ...
    </span>
  );

  const renderPagination = () => {
    if (pageCount <= 8) {
      return Array.from({ length: pageCount }, (_, i) => createPageButton(i + 1));
    }

    const pages = [];
    const delta = 2;
    const showAtStart = 6;

    if (currentPage <= 4) {
      for (let i = 1; i <= showAtStart; i++) {
        pages.push(createPageButton(i));
      }
      pages.push(createDots('end-dots'));
      pages.push(createPageButton(pageCount, true));
    } else if (currentPage >= pageCount - 3) {
      pages.push(createPageButton(1, true));
      pages.push(createDots('start-dots'));
      for (let i = Math.max(2, pageCount - showAtStart + 1); i <= pageCount; i++) {
        pages.push(createPageButton(i));
      }
    } else {
      pages.push(createPageButton(1, true));

      const startPage = Math.max(2, currentPage - delta);
      const endPage = Math.min(pageCount - 1, currentPage + delta);

      if (startPage > 2) {
        pages.push(createDots('start-dots'));
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(createPageButton(i));
      }

      if (endPage < pageCount - 1) {
        pages.push(createDots('end-dots'));
      }

      pages.push(createPageButton(pageCount, true));
    }

    return pages;
  };

  const handleNextPageClick = () => {
    handlePageChange(currentPage + 1);
  };

  const handlePreviousPageClick = () => {
    handlePageChange(currentPage - 1);
  };

  const shortcuts: KeyboardShortcut[] = [
    {
      actionId: 'goToNextPage',
      action: handleNextPageClick,
      defaultShortcut: 'shift+N',
    },
    {
      actionId: 'goToPreviousPage',
      action: handlePreviousPageClick,
      defaultShortcut: 'shift+P',
    },
  ];

  return (
    <ComponentShortcutsProvider shortcuts={shortcuts}>
      <div
        className={styles.pagination}
        role="navigation"
        aria-label={tPagination('paginationNavigation')}
      >
        <Button
          variant="tertiary"
          size="small"
          onClick={handlePreviousPageClick}
          disabled={currentPage === 1}
          aria-label={tPagination('previousPage')}
          className={styles.arrowButton}
          id="arrow-pagination-pervious"
        >
          <Arrow id="icon-pagination-pervious" width={24} height={24} className={styles.arLeft} />
        </Button>
        {renderPagination()}
        <Button
          variant="tertiary"
          size="small"
          onClick={handleNextPageClick}
          disabled={currentPage === pageCount}
          aria-label={tPagination('nextPage')}
          className={styles.arrowButton}
          id="arrow-pagination-next"
        >
          <Arrow id="icon-pagination-next" width={24} height={24} className={styles.arRight} />
        </Button>
      </div>
    </ComponentShortcutsProvider>
  );
};
