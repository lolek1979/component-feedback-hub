'use client';
import React, { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';

import { HelperText } from '../HelperText';
import styles from './Input.module.css';

/**
 * Props for the {@link Input} component.
 *
 * @property type - Input type ('text', 'email', 'password', 'number', 'tel', 'url', 'search').
 * @property value - Input value.
 * @property icon - Optional icon to display inside the input.
 * @property secondaryIcon - Optional secondary icon.
 * @property iconAlign - Position of the icon ('left' or 'right').
 * @property inputSize - Size of the input ('small', 'medium', 'large').
 * @property borderColor - Custom border color.
 * @property padding - Custom padding.
 * @property currency - Currency symbol to display.
 * @property width - Input width.
 * @property wrapperWidth - Width of the input wrapper.
 * @property isError - Whether the input is in error state.
 * @property error - Alternative error flag.
 * @property textAlign - Text alignment ('left', 'right', 'center').
 * @property onChange - Change event handler.
 * @property onKeyDown - Key down event handler.
 * @property list - Datalist id for autocomplete.
 * @property onFocus - Focus event handler.
 * @property onBlur - Blur event handler.
 * @property onClick - Click event handler.
 * @property className - Additional CSS class names.
 * @property id - Unique identifier for the input.
 * @property ariaLabel - Accessibility label.
 * @property ariaLabelledBy - Accessibility labelledby attribute.
 * @property ariaInvalid - Accessibility invalid state.
 * @property ariaRequired - Accessibility required state.
 * @property helperText - Helper text or node to display below the input.
 */
interface CustomInputProps extends ComponentProps<'input'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  icon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  iconAlign?: 'left' | 'right';
  inputSize?: 'small' | 'medium' | 'large';
  borderColor?: string;
  padding?: string;
  currency?: string;
  width?: number | string;
  wrapperWidth?: number | string;
  isError?: boolean;
  helperVariant?: 'error' | 'warning' | 'default' | 'success';
  error?: boolean;
  textAlign?: 'left' | 'right' | 'center';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  list?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  id: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  helperText?: string | React.ReactNode;
}

/**
 * InputProps type for the {@link Input} component.
 */
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> &
  CustomInputProps;

/**
 * Input component for user text entry.
 *
 * Supports icons, error state, helper text, custom sizing, currency, and accessibility features.
 *
 * @param props.type - Input type.
 * @param props.value - Input value.
 * @param props.icon - Icon to display.
 * @param props.secondaryIcon - Secondary icon.
 * @param props.iconAlign - Icon position.
 * @param props.inputSize - Input size.
 * @param props.borderColor - Border color.
 * @param props.padding - Padding.
 * @param props.currency - Currency symbol.
 * @param props.width - Input width.
 * @param props.wrapperWidth - Wrapper width.
 * @param props.isError - Error state.
 * @param props.helperVariant - variants for helper text.
 * @param props.error - Alternative error flag.
 * @param props.textAlign - Text alignment.
 * @param props.onChange - Change handler.
 * @param props.onKeyDown - Key down handler.
 * @param props.list - Datalist id.
 * @param props.onFocus - Focus handler.
 * @param props.onBlur - Blur handler.
 * @param props.onClick - Click handler.
 * @param props.className - Additional CSS classes.
 * @param props.id - Unique identifier.
 * @param props.ariaLabel - Accessibility label.
 * @param props.ariaLabelledBy - Accessibility labelledby.
 * @param props.ariaInvalid - Accessibility invalid state.
 * @param props.ariaRequired - Accessibility required state.
 * @param props.helperText - Helper text or node.
 *
 * @example
 * <Input
 *   id="username"
 *   type="text"
 *   icon={<UserIcon />}
 *   inputSize="large"
 *   helperText="Enter your username"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    inputSize,
    icon,
    secondaryIcon,
    iconAlign,
    borderColor,
    padding,
    currency,
    width,
    helperVariant = 'default',
    wrapperWidth,
    required,
    ariaLabel,
    ariaLabelledBy,
    ariaInvalid,
    ariaRequired,
    helperText,
    isError,
    error,
    id,
    textAlign,
    ...inputProps
  } = props;

  const hasError = isError || error;

  const wrapperClasses = clsx(
    styles.inputWrapper,
    inputSize ? styles[inputSize] : styles.small,
    (props.icon || props.secondaryIcon) &&
      (iconAlign === 'right' ? styles.iconRight : styles.iconLeft),
    props.secondaryIcon && styles.hasSecondaryIcon,
    currency && styles.hasCurrency,
    hasError && styles.error,
    props.className,
  );

  const inputClasses = [
    styles.input,
    icon || secondaryIcon ? styles.withIcon : styles.withoutIcon,
    currency ? styles.hasCurrency : '',
  ]
    .filter(Boolean)
    .join(' ');

  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const wrapperWidthValue = typeof wrapperWidth === 'number' ? `${wrapperWidth}px` : wrapperWidth;

  return (
    <div
      className={wrapperClasses}
      data-testid="input-wrapper"
      style={wrapperWidthValue ? { width: wrapperWidthValue } : undefined}
    >
      <div className={styles.inputContainer}>
        <input
          {...inputProps}
          required={required}
          className={inputClasses}
          type={props.type || 'text'}
          style={{
            borderColor,
            padding,
            userSelect: 'none',
            textAlign: textAlign || 'left',
            width: widthValue || '100%',
          }}
          tabIndex={0}
          ref={ref}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={ariaInvalid || hasError}
          aria-required={ariaRequired || required}
          data-testid="input"
          id={id}
        />
        {(icon || secondaryIcon) && (
          <div
            className={clsx(
              styles.iconWrapper,
              hasError && styles.errorIcon,
              props.disabled && styles.iconWrapperDisabled,
            )}
          >
            <div className={styles.icons}>
              {icon && <div className={styles.icon}>{icon}</div>}
              {secondaryIcon && <div className={styles.secondaryIcon}>{secondaryIcon}</div>}
            </div>
          </div>
        )}
        {currency && <div className={styles.currency}>{currency}</div>}
      </div>
      <div className={styles.helperText}>
        {helperText && (
          <HelperText
            text={helperText}
            id={id + '-helper-text'}
            variant={hasError ? 'error' : helperVariant}
          />
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
