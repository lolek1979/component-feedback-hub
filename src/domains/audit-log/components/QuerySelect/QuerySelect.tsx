'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { IKeyboardArrowDown, IKeyboardArrowUp } from '@/core/assets/icons';
import { Input } from '@/design-system/atoms';

import styles from './QuerySelect.module.css';

interface QuerySelectProps<T> {
  fetchItems: (query: string, page: number) => Promise<T[]>;
  getOptionLabel: (item: T | null) => string;
  onChange: (item: T | null) => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  initialValue?: string;
  id?: string;
}

/**
 * QuerySelect component allows users to search and select items from a dropdown list.
 * It fetches items based on the input query and supports pagination.
 * @param {QuerySelectProps<T>} props - The properties for the QuerySelect component.
 * @param {Function} props.fetchItems - Function to fetch items based on the query and page number.
 * @param {Function} props.getOptionLabel - Function to get the label for each option.
 * @param {Function} props.onChange - Callback function to handle item selection.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {string} [props.className] - Additional CSS class for styling the component.
 * @param {number} [props.debounceDelay=300] - Delay in milliseconds for debouncing the input query.
 * @param {string} [props.initialValue] - initial selected value
 * @param {string} [props.id] - Optional ID for the input field, useful for testing or accessibility.
 *
 * @returns render the QuerySelect component with an input field and a dropdown list of items.
 */
export function QuerySelect<T>({
  fetchItems,
  getOptionLabel,
  onChange,
  placeholder,
  className,
  initialValue,
  id,
}: QuerySelectProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const t = useTranslations('common');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProgrammaticChange = useRef(false);

  // Debounce the input query to avoid excessive API calls
  useEffect(() => {
    //prevent fetching when the change is programmatic (e.g. when setting initial value)
    if (isProgrammaticChange.current && query) {
      isProgrammaticChange.current = false;

      return; // Skip fetch
    }
    setLoading(true);
    fetchItems(query, page)
      .then((newItems) => {
        if (page === 0) {
          setResults(newItems);
        } else {
          setResults((prev) => [...prev, ...newItems]);
        }
        setHasMore(newItems.length > 0);
      })
      .finally(() => setLoading(false));
  }, [query, page, fetchItems]);

  // reset results when query changes
  useEffect(() => {
    setPage(0);
  }, [query]);

  useEffect(() => {
    if (!initialValue) return;

    fetchItems(initialValue, 0).then((items) => {
      if (items.length > 0) {
        const initialItem = items[0];
        setQuery(getOptionLabel(initialItem));
      }
    });
  }, [initialValue, fetchItems, getOptionLabel]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (loading) return; // Prevent backend call if already loading
    const el = dropdownRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelect = (item: T | null) => {
    onChange(item);
    isProgrammaticChange.current = true;
    setQuery(getOptionLabel(item));
    setShowDropdown(false);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Input
        ref={inputRef}
        className={styles.input}
        type="search"
        id="{id}"
        icon={
          showDropdown ? (
            <IKeyboardArrowUp
              onClick={() => {
                setShowDropdown(false);
              }}
            />
          ) : (
            <IKeyboardArrowDown
              onClick={() => {
                setShowDropdown(true);
                setQuery('');
                inputRef.current?.focus();
              }}
            />
          )
        }
        iconAlign="right"
        value={query}
        autoComplete={'off'}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value === '') {
            handleSelect(null);
          } else {
            setShowDropdown(true);
          }
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
      />
      {showDropdown && (
        <div className={styles.dropdownList} ref={dropdownRef} onScroll={handleScroll}>
          {loading && results.length === 0 ? (
            <div className={styles.emptyResult}>{t('loading')}</div>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <div key={idx} className={styles.dropdownItem} onMouseDown={() => handleSelect(item)}>
                {getOptionLabel(item)}
              </div>
            ))
          ) : (
            <div className={styles.emptyResult}>{t('noResult')}</div>
          )}
        </div>
      )}
    </div>
  );
}
