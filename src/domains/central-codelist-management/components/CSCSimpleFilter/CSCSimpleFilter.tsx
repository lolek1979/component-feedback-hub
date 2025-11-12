import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { Input } from '@/design-system/atoms';

import styles from './CSCSimpleFilter.module.css';

type FilterState = {
  search: string;
};

type SimpleFilterProps = {
  onFilterChange: (filter: FilterState) => void;
  initialValues?: Partial<FilterState>;
  editable?: boolean;
};

const initialState: FilterState = {
  search: '',
};

export function CSCSimpleFilter({ onFilterChange, initialValues, editable }: SimpleFilterProps) {
  const [filter, setFilter] = useState<FilterState>({
    ...initialState,
    ...initialValues,
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const t = useTranslations('CSCFilter');

  useEffect(() => {
    if (editable) {
      const resetFilter = { search: '' };
      setFilter(resetFilter);
      onFilterChange(resetFilter);
      setIsSubmitted(false);
    }
  }, [editable, onFilterChange]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, search: e.target.value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSearchIconClick = () => {
    handleSubmit();
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (editable) {
      setFilter({ ...filter, search: '' });
      onFilterChange({ ...filter, search: '' });
      setIsSubmitted(false);
    }

    e?.preventDefault();
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 2000);
  };

  const handleSearchReset = () => {
    setFilter({ ...filter, search: '' });
    onFilterChange({ ...filter, search: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainRow}>
        <Input
          type="text"
          id="input-csc-filter-search"
          value={filter.search}
          onChange={handleSearchChange}
          placeholder={t('searchPlaceholder')}
          icon={
            filter.search !== '' && (
              <CloseIcon
                id="icon-csc-simple-filter-close"
                onClick={handleSearchReset}
                role="button"
                aria-label={t('clear')}
              />
            )
          }
          iconAlign="right"
          className={styles.textInput}
          secondaryIcon={
            isSubmitted ? (
              <div className="spinner" />
            ) : (
              <SearchIcon
                id="icon-csc-simple-filter-search"
                onClick={handleSearchIconClick}
                role="button"
                aria-label={t('searchAriaLabel')}
              />
            )
          }
        />
      </div>
    </div>
  );
}
