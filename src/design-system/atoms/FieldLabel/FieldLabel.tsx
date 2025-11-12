'use client';
import React from 'react';
import clsx from 'clsx';

import { Text } from '@/design-system/atoms';

import styles from './FieldLabel.module.css';

/**
 * Props for the {@link FieldLabel} component.
 *
 * @property text - The label text or React node to display.
 * @property htmlFor - The id of the input element this label is associated with.
 * @property size - Size of the label ('default' or 'prominent'). Default is 'prominent'.
 * @property color - Optional custom color for the label text.
 * @property fontFamily - Optional custom font family for the label text.
 * @property required - Whether to display a required asterisk.
 * @property className - Optional additional CSS class names.
 * @property selectable - Whether the label text is selectable. Default is false.
 * @property ariaLabel - Accessibility label for the label.
 * @property ariaLabelledBy - Accessibility labelledby attribute.
 * @property id - Unique identifier for the label.
 */
interface FieldLabelProps {
  text: string | React.ReactNode;
  htmlFor: string;
  size?: 'default' | 'prominent';
  color?: string;
  fontFamily?: string;
  required?: boolean;
  className?: string;
  selectable?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  id?: string;
}

/**
 * FieldLabel component for rendering a styled label for form fields.
 *
 * Supports custom text, size, color, font, required indicator, accessibility attributes, and selectable text.
 *
 * @example
 * <FieldLabel text="Username" htmlFor="username-input" required />
 */
export const FieldLabel = ({
  text,
  htmlFor,
  size = 'prominent',
  color,
  fontFamily,
  className,
  required = false,
  selectable = false,
  ariaLabel,
  ariaLabelledBy,
  id,
}: FieldLabelProps) => {
  const labelClasses = clsx(styles.label, !selectable && styles.preventSelect, className);

  return (
    <label
      htmlFor={htmlFor}
      className={labelClasses}
      style={{ color, fontFamily }}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
    >
      <Text variant="caption" regular={size === 'default'}>
        {text}
      </Text>
      {required && <span className={styles.required}>*</span>}
    </label>
  );
};
