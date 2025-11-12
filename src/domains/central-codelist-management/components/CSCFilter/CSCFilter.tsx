'use client';

import { ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { Button, Checkbox, Input, Text } from '@/design-system/atoms';
import { Multiselect } from '@/design-system/molecules';

import styles from './CSCFilter.module.css';

type FilterItemsType = Array<{ value: string; label: string }>;

export type FilterState = {
  search: string;
  types: string[];
  states: string[];
  showSubconcepts: boolean;
};

type CSCFilterProps = {
  onFilterChange: (filter: FilterState) => void;
  types: FilterItemsType;
  states?: FilterItemsType;
  initialValues?: Partial<FilterState>;
  showSubconceptsFilter?: boolean;
};

const initialState: FilterState = {
  search: '',
  types: [],
  states: [],
  showSubconcepts: false,
};

export function CSCFilter({
  onFilterChange,
  types,
  states = [],
  initialValues,
  showSubconceptsFilter = false,
}: CSCFilterProps) {
  const [filter, setFilter] = useState<FilterState>({
    ...initialState,
    ...initialValues,
  });

  const t = useTranslations('CSCFilter');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFilter = { ...filter, search: value };
    setFilter(newFilter);

    onFilterChange(newFilter);
  };

  const handleSubconceptsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, showSubconcepts: e.target.checked };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    setFilter(initialState);
    onFilterChange(initialState);
  };

  const handleSearchReset = () => {
    setFilter({ ...filter, search: '' });
    onFilterChange({ ...filter, search: '' });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={clsx(styles.mainRow, !showSubconceptsFilter && styles.fullWidth)}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Input
            type="text"
            id="input-csc-filter-search"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder={t('searchPlaceholder')}
            icon={
              filter.search !== '' && (
                <CloseIcon
                  id="icon-csc-filter-close"
                  role="button"
                  aria-label={t('clear')}
                  onClick={handleSearchReset}
                />
              )
            }
            secondaryIcon={
              <SearchIcon
                id="icon-csc-filter-search"
                role="button"
                aria-label={t('searchAriaLabel')}
              />
            }
            iconAlign="right"
            ariaLabel={t('searchInput')}
          />
        </form>
        <Multiselect
          id="cscfilter-multiselect-types"
          items={types}
          values={filter.types}
          placeholder={
            filter.types.length > 0 ? `${t('type')}: ${filter.types.length}` : t('typePlaceholder')
          }
          className={styles.cscFilterType}
          onChange={(values) => {
            const newFilter = { ...filter, types: values };
            setFilter(newFilter);
            onFilterChange(newFilter);
          }}
          buttonsText={[t('selectAll'), t('resetFilter')]}
        />
        <Multiselect
          id="cscfilter-multiselect-states"
          items={states}
          values={filter.states}
          placeholder={
            filter.states.length > 0
              ? `${t('state')}: ${filter.states.length}`
              : t('statePlaceholder')
          }
          className={styles.cscFilterType}
          onChange={(values) => {
            const newFilter = { ...filter, states: values };
            setFilter(newFilter);
            onFilterChange(newFilter);
          }}
          buttonsText={[t('selectAll'), t('resetFilter')]}
        />
      </div>
      <div className={styles.actionsRow}>
        {Object.values(filter).some((value) =>
          Array.isArray(value) ? value.length > 0 : value,
        ) && (
          <Button
            id="button-filter-menu-reset"
            onClick={handleReset}
            variant="tertiary"
            icon={<CloseIcon id="icon-csc-filter-cancle-filters" />}
            iconAlign="left"
            size="small"
            aria-label={t('resetFilter')}
          >
            {t('resetFilter')}
          </Button>
        )}

        {showSubconceptsFilter && (
          <div className={styles.checkboxWrapper}>
            <Checkbox
              checked={filter.showSubconcepts}
              onChange={handleSubconceptsChange}
              id="checkbox-cscfilter-show-subconcepts"
              label={t('showSubconcepts')}
            />
            <Text variant="label" selectable={false} htmlFor="checkbox-cscfilter-show-subconcepts">
              {t('showSubconcepts')}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
