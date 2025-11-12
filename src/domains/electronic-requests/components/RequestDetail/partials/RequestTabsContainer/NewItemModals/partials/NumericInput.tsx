import { useCallback, useEffect, useState } from 'react';

import { Input } from '@/design-system/atoms';
import {
  formatNumberWithSpaces,
  removeSpaces,
  validateMaxLength,
} from '@/domain-central-codelist-management/api/services/utils';

export interface NumericInputProps {
  id: string;
  value?: number;
  onChange?: (value: string) => void;
  currency?: string;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  allowDecimals?: boolean;
  useSpaceSeparators?: boolean;
}

export const NumericInput = ({
  id,
  value = 0,
  onChange,
  currency,
  error,
  helperText,
  maxLength,
  className,
  disabled,
  allowDecimals = true,
  useSpaceSeparators = false,
}: NumericInputProps) => {
  const stringValue = String(value);

  const [internalValue, setInternalValue] = useState(stringValue);

  useEffect(() => {
    if (value && useSpaceSeparators) {
      setInternalValue(formatNumberWithSpaces(String(value), allowDecimals));
    }
  }, [value, allowDecimals, useSpaceSeparators]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!allowDecimals && (e.key === '.' || e.key === ',')) {
        e.preventDefault();
      }
    },
    [allowDecimals],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const digitsOnly = removeSpaces(inputValue);

      if (maxLength && !validateMaxLength(digitsOnly, maxLength, false)) {
        return;
      }

      let processedValue;
      if (!allowDecimals) {
        processedValue = inputValue.replace(/[^\d\s]/g, '');
      } else {
        processedValue = inputValue.replace(/[^\d.\s]/g, '').replace(/(\..*)\./g, '$1');
      }

      setInternalValue(processedValue);

      const formattedValue = useSpaceSeparators
        ? formatNumberWithSpaces(processedValue, allowDecimals)
        : processedValue;

      setInternalValue(formattedValue);

      if (onChange) {
        const finalValue = removeSpaces(formattedValue);
        onChange(finalValue);
      }
    },
    [onChange, allowDecimals, maxLength, useSpaceSeparators],
  );

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      value={internalValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      currency={currency}
      error={error}
      helperText={helperText}
      maxLength={undefined}
      className={className}
      disabled={disabled}
    />
  );
};
