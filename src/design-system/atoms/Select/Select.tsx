'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import clsx from 'clsx';

import IArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';
import SearchIcon from '@/core/assets/icons/search.svg';
import { useFeedBackHub } from '@/core/providers/FeedBackHubProvider';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { HelperText } from '../HelperText';
import { Input } from '../Input';
import { Text } from '../Text';
import styles from './Select.module.css';
/**
 * Props for the {@link Select} component.
 *
 * @property children - The option elements to display.
 * @property defaultValue - Initial selected value for single select.
 * @property value - Controlled selected value for single select.
 * @property onChange - Callback when a single option is selected.
 * @property multiple - Enables multi-select mode.
 * @property defaultValues - Initial selected values for multi-select.
 * @property values - Controlled selected values for multi-select.
 * @property onMultiChange - Callback when multi-select values change.
 * @property searchable - Enables search/filter functionality.
 * @property searchPlaceholder - Placeholder text for the search input.
 * @property placeholder - Placeholder text for the select input.
 * @property disabled - Disables the select input.
 * @property className - Additional CSS class names.
 * @property compact - Enables compact styling.
 * @property ariaLabel - Accessibility label for the select.
 * @property id - Unique identifier for the select.
 * @property setIsOpenFooter - Callback to control footer open state.
 * @property inputName - Name attribute for the hidden input.
 * @property helperText - Helper text or node to display below the select.
 * @property isError - Error state for the select.
 * @property maxDisplayLength - Maximum length for displayed selected values.
 * @property width - Defines the width of the select component in pixels.
 */
export interface SelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  multiple?: boolean;
  defaultValues?: string[];
  values?: string[];
  onMultiChange?: (values: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
  id: string;
  setIsOpenFooter?: (isOpen: boolean) => void;
  inputName?: string;
  helperText?: string | React.ReactNode;
  isError?: boolean;
  maxDisplayLength?: number;
  width?: number;
  multiButtons?: string[];
}

/**
 * Select component for single or multi-option selection.
 *
 * Supports search/filter, multi-select, keyboard navigation, accessibility, and custom styling.
 *
 * @example
 * <Select
 *   id="country-select"
 *   placeholder="Select country"
 *   searchable
 *   multiple
 *   onMultiChange={(values) => setCountries(values)}
 * >
 *   <option value="cz">Czech Republic</option>
 *   <option value="sk">Slovakia</option>
 * </Select>
 */
export const Select = ({
  children,
  defaultValue = '',
  value,
  onChange,
  onBlur,
  multiple = false,
  defaultValues = [],
  values,
  onMultiChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  placeholder = '',
  disabled = false,
  className = '',
  compact = false,
  isError = false,
  ariaLabel,
  id,
  setIsOpenFooter,
  inputName,
  helperText,
  maxDisplayLength = 100,
  width,
  multiButtons = ['Select all', 'Remove all'],
}: SelectProps) => {
  // Single select state
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);
  // Multi select state
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    values !== undefined ? values : defaultValues,
  );
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Common state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const listboxRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const { isFeedBackHubOpen } = useFeedBackHub();

  const [focusedIndex, setFocusedIndex] = useState(0);
  const options = React.Children.toArray(children);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm) return options;

    return options.filter((option) => {
      if (
        React.isValidElement(option) &&
        option.props &&
        typeof option.props === 'object' &&
        'children' in option.props
      ) {
        const props = option.props as { children?: React.ReactNode };
        const text = typeof props.children === 'string' ? props.children : '';

        return text.toLowerCase().includes(searchTerm.toLowerCase());
      }

      return true;
    });
  }, [options, searchable, searchTerm]);

  const optionsCount = filteredOptions.length;

  // Multi select effects
  useEffect(() => {
    if (multiple && values !== undefined) {
      setSelectedOptions(values);
    }
  }, [values, multiple]);

  const handleOptionClick = useCallback(
    (optionValue: string) => {
      if (multiple) {
        // Multi select logic
        const newSelected = selectedOptions.includes(optionValue)
          ? selectedOptions.filter((v) => v !== optionValue)
          : [...selectedOptions, optionValue];

        setSelectedOptions(newSelected);
        onMultiChange?.(newSelected);
        // Keep dropdown open for multi select
      } else {
        // Single select logic
        if (value !== undefined) {
          if (onChange) onChange(optionValue);
        } else {
          setSelectedOption(optionValue);
          if (onChange) onChange(optionValue);
        }
        setIsOpen(false);
        setIsOpenFooter?.(false);
      }
    },
    [multiple, selectedOptions, onMultiChange, onChange, setIsOpenFooter, value],
  );

  const handleSelectAllButton = useCallback(() => {
    const allValues = React.Children.toArray(children)
      .filter((child) => React.isValidElement(child))
      .map((child) => (child as React.ReactElement<any>).props.value);

    setSelectedOptions(allValues);
    onMultiChange?.(allValues);
  }, [children, onMultiChange]);

  const handleClearFilter = useCallback(() => {
    setSelectedOptions([]);
    onMultiChange?.([]);
  }, [onMultiChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest('select') || e.target.closest('.scrollable-container'))
    ) {
      isDraggingRef.current = true;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClickOverlay = useCallback(
    (e: MouseEvent) => {
      if (!isFeedBackHubOpen) {
        if (isDraggingRef.current) return;
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setIsOpenFooter?.(false);
        }
      }
    },
    [isFeedBackHubOpen, setIsOpenFooter],
  );

  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('click', handleClickOverlay);
    } else {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOverlay);
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOverlay);
    };
  }, [handleClickOverlay, isOpen]);

  useEffect(() => {
    if (isOpen && listboxRef?.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Skip search input navigation - let it handle its own keys
        if (searchable && document.activeElement?.classList.contains('search-input')) {
          if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
            setIsOpenFooter?.(false);
          }

          return;
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % optionsCount);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + optionsCount) % optionsCount);
            break;
          case 'Enter':
            e.preventDefault();
            if (isOpen && React.isValidElement(filteredOptions[focusedIndex])) {
              handleOptionClick(
                (filteredOptions[focusedIndex] as React.ReactElement<any>)?.props?.value,
              );
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            setIsOpenFooter?.(false);
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [
    focusedIndex,
    handleOptionClick,
    isOpen,
    optionsCount,
    filteredOptions,
    setIsOpenFooter,
    searchable,
  ]);

  useEffect(() => {
    if (isOpen && listboxRef?.current) {
      const child = listboxRef.current.children[focusedIndex];
      (child as HTMLElement)?.focus();
    }
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleKeyDownSelect = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setIsOpenFooter?.(true);
        break;
      default:
        break;
    }
  };

  const selectWrapperClassName = clsx(
    styles.selectWrapper,
    isOpen && styles.opened,
    disabled && styles.disabled,
    compact && styles.compact,
    isError && styles.error,
    className,
  );

  if (!optionsCount && !searchable) return null;

  // Get display text for single select
  const selectedChild = React.Children.toArray(children).find((child) => {
    if (
      React.isValidElement(child) &&
      child.props &&
      typeof child.props === 'object' &&
      'value' in child.props
    ) {
      const props = child.props as { value?: any };

      return props.value === (value !== undefined ? value : selectedOption);
    }

    return false;
  }) as React.ReactElement<{ children?: React.ReactNode; value?: any }> | undefined;

  const selectedChildValue = selectedChild?.props?.children;

  // Get display text for multi select (similar to existing Multiselect)
  const getMultiSelectDisplayText = () => {
    if (selectedOptions.length === 0) return '';

    const selectedLabels = selectedOptions.map((optionValue) => {
      const child = React.Children.toArray(children).find((child) => {
        if (
          React.isValidElement(child) &&
          child.props &&
          typeof child.props === 'object' &&
          'value' in child.props
        ) {
          const props = child.props as { value?: any };

          return props.value === optionValue;
        }

        return false;
      }) as React.ReactElement<{ children?: React.ReactNode; value?: any }> | undefined;

      return child?.props?.children || optionValue;
    });

    if (selectedLabels.length === 1) {
      return selectedLabels[0];
    }

    const joinedText = selectedLabels.join(', ');

    if (joinedText.length <= maxDisplayLength) {
      return joinedText;
    }

    let totalLength = 0;
    let displayableCount = 0;

    const effectiveMaxLength = maxDisplayLength - 3;

    for (let i = 0; i < selectedLabels.length; i++) {
      const separator = i > 0 ? 2 : 0;
      const labelText = String(selectedLabels[i]);

      if (totalLength + separator + labelText.length > effectiveMaxLength) {
        break;
      }

      totalLength += separator + labelText.length;
      displayableCount++;
    }

    const displayItems = selectedLabels.slice(0, displayableCount);
    const displayText = displayItems.join(', ');

    return displayableCount < selectedLabels.length ? `${displayText}...` : displayText;
  };

  return (
    <div
      className={selectWrapperClassName}
      ref={wrapperRef}
      style={width ? { width: `${width}px` } : undefined}
    >
      <input
        type="hidden"
        disabled={disabled}
        value={selectedOption}
        name={inputName ?? id ?? 'select-value'}
      />
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsOpenFooter?.(!isOpen);
          }
        }}
        onBlur={onBlur}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'listbox' : undefined}
        aria-label={ariaLabel}
        className={`${styles.selectInput} ${disabled ? styles.disabled : ''} ${isOpen ? styles.active : ''}`}
        onKeyDown={handleKeyDownSelect}
        id={id}
      >
        {multiple ? (
          selectedOptions.length > 0 ? (
            <div className={styles.contentWrapper}>
              <span className={styles.text}>
                <Text
                  id={'text-selected-options-' + id}
                  regular
                  variant="subtitle"
                  selectable={false}
                >
                  {getMultiSelectDisplayText()}
                </Text>
              </span>
              {selectedOptions.length > 0 && (
                <Text variant="footnote" className={styles.count}>
                  {selectedOptions.length}
                </Text>
              )}
            </div>
          ) : (
            <span className={styles.placeholder}>
              <Text id={'text-placeholder-' + id} regular variant="subtitle" selectable={false}>
                {placeholder}
              </Text>
            </span>
          )
        ) : (value !== undefined ? value : selectedOption) ? (
          <span className={styles.text}>
            <Text id={'text-selected-option-' + id} regular variant="subtitle" selectable={false}>
              {selectedChildValue}
            </Text>
          </span>
        ) : (
          <span className={styles.placeholder}>
            <Text id={'text-placeholder-' + id} regular variant="subtitle" selectable={false}>
              {placeholder}
            </Text>
          </span>
        )}
        <span className={styles.chevron}>
          <IArrowDown
            id={'icon-' + id + '-arrow-down'}
            className={styles.icon}
            width={24}
            height={24}
          />
        </span>
      </div>

      {isOpen && (
        <ul
          className={`${styles.optionsList} primary-shadow`}
          ref={listboxRef}
          role="listbox"
          aria-activedescendant={`option-${focusedIndex}`}
        >
          {searchable && (
            <li className={styles.searchContainer}>
              <Input
                type="text"
                id={`${id}-search-input`}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className={`search-input`}
                icon={<SearchIcon id={`${id}-search-icon`} width={24} height={24} />}
                iconAlign="left"
                inputSize="medium"
              />
            </li>
          )}

          {filteredOptions.map((child, index) => {
            if (
              React.isValidElement(child) &&
              child.props &&
              typeof child.props === 'object' &&
              'value' in child.props &&
              'children' in child.props
            ) {
              const props = child.props as { value: any; children: React.ReactNode };
              const isSelected = multiple
                ? selectedOptions.includes(props.value)
                : selectedOption === props.value;

              return (
                <li
                  key={props.value}
                  className={`${styles.option} ${focusedIndex === index ? styles.focused : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(props.value)}
                  id={`${id}-item-${index}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {multiple && (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleOptionClick(props.value)}
                      id={`${id}-checkbox-${props.value}`}
                      isMultiselect={false}
                    />
                  )}
                  <Text variant="subtitle" regular={!isSelected}>
                    {props.children}
                  </Text>
                </li>
              );
            }

            return child;
          })}

          {filteredOptions.length === 0 && searchTerm && (
            <li className={styles.noResults}>
              <Text variant="caption" regular>
                No results found
              </Text>
            </li>
          )}

          {multiple && (
            <li className={styles.buttonContainer}>
              <Button
                variant="secondary"
                size="small"
                className={styles.actionButton}
                onClick={handleSelectAllButton}
                id={`${id}-select-all-button`}
                aria-label="Select all items"
              >
                {multiButtons[0]}
              </Button>
              <Button
                variant="secondary"
                size="small"
                className={styles.actionButton}
                onClick={handleClearFilter}
                id={`${id}-clear-filter-button`}
                aria-label="Clear all selections"
              >
                {multiButtons[1]}
              </Button>
            </li>
          )}
        </ul>
      )}

      <div className={styles.helperText}>
        {helperText && !isOpen && (
          <HelperText
            text={helperText}
            id={id + '-helper-text'}
            variant={isError ? 'error' : 'default'}
          />
        )}
      </div>
    </div>
  );
};
