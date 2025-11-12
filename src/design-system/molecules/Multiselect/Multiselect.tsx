'use client';

import { Option, Select } from '@/design-system/atoms';

/**
 * Props for the Multiselect component.
 *
 * @property id - Unique identifier for the multiselect.
 * @property items - Array of selectable items with label and value.
 * @property defaultValues - Array of default selected values.
 * @property values - Controlled selected values.
 * @property placeholder - Placeholder text for the select input.
 * @property disabled - Whether the multiselect is disabled.
 * @property className - Additional CSS class.
 * @property onChange - Callback when selected values change.
 * @property searchable - Enables search functionality.
 * @property searchPlaceholder - Placeholder text for the search input.
 * @property maxDisplayLength - Maximum display length for selected values.
 * @property helperText - Optional helper text below the select.
 * @property isError - Whether to display error styling.
 * @property buttonsText - Labels for buttons.
 */
export interface MultiselectProps {
  id: string;
  items: Array<{
    label: string;
    value: string;
  }>;
  defaultValues?: Array<string>;
  values?: Array<string>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (selectedValues: Array<string>) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxDisplayLength?: number;
  helperText?: string;
  isError?: boolean;
  buttonsText?: string[];
}

/**
 * Multiselect component for selecting multiple options from a list.
 *
 * Renders a Select input with multiple selection, optional search, and helper text.
 *
 * @param props MultiselectProps
 * @returns React component
 */
export const Multiselect = ({
  id,
  items,
  defaultValues = [],
  values,
  placeholder = '',
  disabled = false,
  className = '',
  onChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  maxDisplayLength = 100,
  helperText,
  isError = false,
  buttonsText,
}: MultiselectProps) => {
  if (!items?.length) return null;

  return (
    <Select
      id={id}
      multiple={true}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      defaultValues={defaultValues}
      values={values}
      onMultiChange={onChange}
      maxDisplayLength={maxDisplayLength}
      helperText={helperText}
      isError={isError}
      multiButtons={buttonsText}
    >
      {items.map((item) => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
