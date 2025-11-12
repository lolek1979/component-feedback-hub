'use client';
import React, { ComponentProps } from 'react';
import clsx from 'clsx';

import styles from './RadioButton.module.css';

/**
 * Props for the {@link RadioButton} component.
 *
 * @property id - Unique identifier for the radio button.
 * @property checked - Whether the radio button is checked.
 * @property onChange - Change event handler.
 * @property label - Accessibility label for the radio button.
 * @property isError - Whether the radio button is in an error state.
 * @property name - Name attribute for grouping radio buttons.
 * @property value - Value of the radio button.
 * @property disabled - Whether the radio button is disabled.
 * @property className - Optional additional CSS class names.
 */
interface RadioButtonProps extends Omit<ComponentProps<'input'>, 'type'> {
  id: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  isError?: boolean;
}

/**
 * RadioButton component for user selection in a group.
 *
 * Supports controlled and uncontrolled checked state, error styling, accessibility features, and custom styling.
 *
 * @example
 * <RadioButton id="option1" name="group1" value="1" label="Option 1" checked={true} />
 */
export const RadioButton = ({
  id,
  name,
  value,
  checked,
  disabled = false,
  className = '',
  label = 'radio button',
  isError = false,
  ...props
}: RadioButtonProps) => {
  const inputClasses = clsx(
    styles.input,
    checked && styles.inputChecked,
    disabled && styles.disabled,
    isError && styles.error,
    className,
  );

  return (
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      className={inputClasses}
      aria-label={label}
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      tabIndex={0}
      {...props}
    />
  );
};
