'use client';
import React, { ForwardedRef, forwardRef } from 'react';

import { HelperText } from '@/design-system/atoms/HelperText';
import { Typography } from '@/design-system/molecules';

import styles from './Textarea.module.css';

/**
 * Props for the {@link Textarea} component.
 *
 * @property onChange - Callback when the textarea value changes.
 * @property initialValue - Initial value for the textarea.
 * @property ariaLabel - Accessibility label for the textarea.
 * @property ariaLabelledby - Accessibility labelledby attribute.
 * @property ariaDescribedby - Accessibility describedby attribute.
 * @property helperText - Helper text to display below the textarea.
 * @property isError - Whether the textarea is in an error state.
 * @property maxLength - Maximum allowed length for the textarea value.
 * @property name - Name attribute for the textarea.
 * @property id - Unique identifier for the textarea.
 * @property placeholder - Placeholder text for the textarea.
 * @property readOnly - Whether the textarea is read-only.
 * @property disabled - Whether the textarea is disabled.
 * @property form - Form id the textarea belongs to.
 * @property value - Controlled value for the textarea.
 * @property required - Whether the textarea is required.
 * @property width - Defines the width of the textarea component in pixels.
 */
interface TextareaProps extends React.ComponentProps<'textarea'> {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  initialValue?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  helperText?: string;
  isError?: boolean;
  maxLength?: number;
  width?: number;
  label?: string;
}

/**
 * Textarea component for multi-line text input.
 *
 * Supports error state, helper text, character counter, accessibility attributes, and max length enforcement.
 *
 * @param props.onChange - Callback when the textarea value changes.
 * @param props.initialValue - Initial value for the textarea.
 * @param props.ariaLabel - Accessibility label.
 * @param props.ariaLabelledby - Accessibility labelledby attribute.
 * @param props.ariaDescribedby - Accessibility describedby attribute.
 * @param props.helperText - Helper text to display below the textarea.
 * @param props.isError - Error state.
 * @param props.maxLength - Maximum allowed length.
 * @param props.name - Name attribute.
 * @param props.id - Unique identifier.
 * @param props.placeholder - Placeholder text.
 * @param props.readOnly - Read-only state.
 * @param props.disabled - Disabled state.
 * @param props.form - Form id.
 * @param props.value - Controlled value.
 * @param props.required - Required state.
 * @param props.width - Component width.

 * @example
 * <Textarea
 *   id="description"
 *   initialValue="Type here..."
 *   maxLength={200}
 *   helperText="Max 200 characters"
 *   isError={false}
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      initialValue = '',
      helperText,
      isError = false,
      onChange,
      maxLength,
      width,
      label,
      ...props
    },
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const [value, setValue] = React.useState(initialValue);

    const isApproachingLimit = maxLength ? value.length >= maxLength * 0.9 : false;
    const isLimitReached = maxLength ? value.length >= maxLength : false;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    };

    const textAreaClasses = `${styles.textarea} ${isError ? styles.error : ''}`;

    const getCounterClass = () => {
      if (isLimitReached) return styles.errorCount;
      if (isApproachingLimit) return styles.warningCount;

      return '';
    };

    return (
      <div className={styles.textareaWrapper} style={width ? { width: `${width}px` } : undefined}>
        {label && (
          <div className={styles.labelRow}>
            <Typography variant="Caption/Regular" component="label" className={styles.label}>
              {label}
            </Typography>
            {maxLength && !props.disabled && (
              <div className={`${styles.counter} ${getCounterClass()}`}>
                <Typography variant="Caption/Regular">
                  {value.length}/{maxLength}
                </Typography>
              </div>
            )}
          </div>
        )}
        {!label && maxLength && !props.disabled && (
          <div className={`${styles.counter} ${getCounterClass()}`}>
            <Typography variant="Caption/Regular">
              {value.length}/{maxLength}
            </Typography>
          </div>
        )}
        <textarea
          ref={ref}
          {...props}
          className={textAreaClasses}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          disabled={props.disabled}
          form={props.form}
          value={props.value !== undefined ? props.value : value}
          required={props.required}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          maxLength={maxLength}
          onChange={(event) => {
            handleChange(event);
            onChange && onChange(event);
          }}
        />
        {helperText && (
          <HelperText
            variant={isError ? 'error' : 'default'}
            id={props.id + '-helper-text'}
            text={helperText}
          />
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
