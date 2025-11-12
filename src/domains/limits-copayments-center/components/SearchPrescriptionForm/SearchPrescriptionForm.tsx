'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { Spinner, Text } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import { Option, Select } from '@/design-system/atoms';
import { Toggle } from '@/design-system/atoms';

import styles from './SearchPrescriptionForm.module.css';

type OptionType = {
  value: string;
  label: string;
};

export interface SearchPrescriptionFormProps {
  selectedYear: string;
  selectedMonth: string;
  searchQuery: string;
  years?: OptionType[];
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  className?: string;
  showDetails?: boolean;
  onShowDetailsChange?: (show: boolean) => void;
}

const DEFAULT_YEARS: OptionType[] = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
];

export const SearchPrescriptionForm = ({
  selectedYear,
  selectedMonth,
  searchQuery,
  years = DEFAULT_YEARS,
  onYearChange,
  onMonthChange,
  onSearchChange,
  isLoading = false,
  className,
  showDetails = false,
  onShowDetailsChange,
}: SearchPrescriptionFormProps) => {
  const t = useTranslations('SearchPrescriptionForm');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const months: OptionType[] = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: t(`months.${i + 1}`),
  }));

  const allMonthsOption: OptionType = {
    value: 'all',
    label: t('allMonths'),
  };

  const handleYearChange = (value: string) => {
    onYearChange(value);
  };

  const handleMonthChange = (value: string) => {
    onMonthChange(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSearchChange(localSearchQuery);
  };

  const handleSearchIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSearchChange(localSearchQuery);
  };

  const monthsOptions = [allMonthsOption, ...months];

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`${styles.form} ${className || ''}`}
      role="search"
      aria-label={t('prescriptionSearch')}
    >
      <div className={`${styles.filters}`}>
        <Select
          id="select-prescription-form-year"
          key={`year-${selectedYear}`}
          defaultValue={selectedYear}
          onChange={handleYearChange}
          className={styles.yearSelect}
          aria-label={t('yearSelect')}
          disabled={true}
        >
          {years.map((year) => (
            <Option key={year.value} value={year.value}>
              {year.label}
            </Option>
          ))}
        </Select>
        <Select
          id="select-prescription-form-month"
          key={`month-${selectedMonth}`}
          defaultValue={selectedMonth}
          value={selectedMonth}
          onChange={handleMonthChange}
          className={styles.monthSelect}
          aria-label={t('monthSelect')}
          disabled={isLoading}
        >
          {monthsOptions.map((month) => (
            <Option key={month.value} value={month.value}>
              {month.label}
            </Option>
          ))}
        </Select>

        <div className={styles.customInputWrapper}>
          <Input
            type="text"
            inputMode="search"
            role="searchbox"
            id="input-prescription-form-search"
            value={localSearchQuery}
            onChange={handleSearchChange}
            placeholder={t('searchPlaceholder')}
            className={styles.searchInput}
            aria-label={t('searchInput')}
            disabled={isLoading}
            secondaryIcon={
              isLoading ? (
                <Spinner width={24} height={24} />
              ) : (
                <SearchIcon
                  id="icon-search-prescription-search"
                  role="button"
                  aria-label={t('search')}
                  onClick={handleSearchIconClick}
                  style={{ cursor: 'pointer' }}
                />
              )
            }
            icon={
              localSearchQuery !== '' && (
                <CloseIcon
                  id="icon-search-prescription-close"
                  role="button"
                  aria-label={t('clear')}
                  onClick={() => {
                    setLocalSearchQuery('');
                    onSearchChange('');
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )
            }
            iconAlign="right"
            style={{ userSelect: 'none' }}
          />
        </div>
      </div>
      <div className={styles.toggleContainer}>
        <Toggle
          checked={showDetails}
          onChange={(e) => onShowDetailsChange?.(e.target.checked)}
          label={t('showDetails')}
          id="toggle-prescription-form-show-details"
        />
        <Text variant="subtitle" regular>
          {t('showDetails')}
        </Text>
      </div>
    </form>
  );
};
