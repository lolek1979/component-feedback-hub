'use client';

import React, { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { HeaderContext, SortDirection } from '@tanstack/table-core';

import ISwap from '@/core/assets/icons/swap_vert.svg';
import ISwapDown from '@/core/assets/icons/swap_vert_down.svg';
import ISwapUp from '@/core/assets/icons/swap_vert_up.svg';

import { AdminProcessTableRow } from '../../Columns';
import styles from '../Table.module.css';

interface HeaderCellProps {
  translationKey: string;
  column: HeaderContext<AdminProcessTableRow, unknown>['column'];
  sortable?: boolean;
}

const SortingIcon = ({
  variant,
  key,
}: {
  key: string;
  variant: false | SortDirection;
}): ReactElement<any> => {
  switch (variant) {
    case 'asc':
      return <ISwapUp id={'icon-sort-up-' + key} width={20} height={20} />;
    case 'desc':
      return <ISwapDown id={'icon-sort-down-' + key} width={20} height={20} />;
    default:
      return <ISwap id={'icon-sort-swap-' + key} width={20} height={20} />;
  }
};

const HeaderCellContent = (props: HeaderCellProps) => {
  const { translationKey, column, sortable = false } = props;
  const t = useTranslations('administrativeProceedings.columns');

  if (!sortable) {
    return <>{t(translationKey)}</>;
  }

  return (
    <button
      id={`adminProcessList-header-button-${translationKey}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={styles.sortableHeaderButton}
    >
      <span>{t(translationKey)}</span>
      <SortingIcon variant={column.getIsSorted()} key={translationKey} />
    </button>
  );
};

export default HeaderCellContent;
