'use client';
import React from 'react';

import { FieldLabel, RadioButton } from '@/design-system/atoms';
import { Typography } from '@/design-system/molecules';

import styles from './RadioGroup.module.css';

/**
 * Props for the RadioGroup component.
 *
 * @property options - Array of radio options with value and label.
 * @property name - Name attribute for the radio group.
 * @property onChange - Callback when the selected value changes.
 * @property defaultValue - Default selected value.
 * @property disabled - Whether all radios are disabled.
 * @property className - Additional CSS class.
 * @property ariaLabel - Accessibility label for the group.
 * @property horizontal - Whether to display radios horizontally.
 * @property id - Unique identifier for the radio group.
 * @property withTitle - Optional title text displayed above the radio group.
 */
interface RadioGroupProps {
  options: Array<{ value: string; label: string }>;
  name: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  horizontal?: boolean;
  id: string;
  withTitle?: string;
}

/**
 * RadioGroup component for selecting a single option from a list.
 *
 * Renders a group of radio buttons with labels, supports horizontal layout and accessibility.
 *
 * @param props RadioGroupProps
 * @returns React component
 */
export const RadioGroup = ({
  options,
  name,
  onChange,
  defaultValue,
  value,
  disabled = false,
  className,
  ariaLabel,
  horizontal = false,
  id,
  withTitle,
}: RadioGroupProps) => {
  const selectedValue = value !== undefined ? value : defaultValue;

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      {withTitle && (
        <Typography variant="Subtitle/Default/Regular" className={styles.title}>
          {withTitle}
        </Typography>
      )}
      <div
        className={`${styles.radioGroup} ${horizontal ? styles.horizontal : ''}`}
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {options.map((option) => {
          const radioId = `${id}-${option.value}`;
          const isChecked = selectedValue === option.value;

          return (
            <div className={styles.radioItem} key={option.value}>
              <RadioButton
                id={radioId}
                name={name}
                value={option.value}
                checked={isChecked}
                disabled={disabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange(option.value);
                  }
                }}
                aria-checked={isChecked}
              />
              <FieldLabel htmlFor={radioId} text={option.label} id={`${radioId}-label`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
