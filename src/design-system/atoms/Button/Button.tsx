import React, { ComponentProps } from 'react';
import clsx from 'clsx';

import { Text } from '../Text';
import styles from './Button.module.css';

import { Spinner } from '@/design-system';

/**
 * Props for the {@link Button} component.
 *
 * @property children - The content to display inside the button.
 * @property icon - Optional icon to display alongside the button text.
 * @property size - Size of the button ('small', 'medium', or 'large').
 * @property iconAlign - Position of the icon relative to the text ('left' or 'right').
 * @property variant - Visual style of the button ('primary', 'secondary', 'tertiary', 'oncolor', 'unstyled', 'toast').
 * @property disabled - Whether the button is disabled.
 * @property loading - Whether to show a loading spinner.
 * @property ariaLabel - Accessibility label for the button.
 * @property id - Unique identifier for the button.
 * @property borderRadius - Custom border radius for the button.
 */
interface ButtonProps extends ComponentProps<'button'> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  iconAlign?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'oncolor' | 'unstyled' | 'toast';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  id: string;
  borderRadius?: string;
}

/**
 * Button component for user interactions.
 *
 * Supports various sizes, variants, icons, loading state, and accessibility features.
 *
 * @param props.children - The content to display inside the button.
 * @param props.icon - Optional icon to display.
 * @param props.size - Size of the button.
 * @param props.iconAlign - Position of the icon.
 * @param props.variant - Visual style of the button.
 * @param props.disabled - Whether the button is disabled.
 * @param props.loading - Whether to show a loading spinner.
 * @param props.ariaLabel - Accessibility label.
 * @param props.id - Unique identifier for the button.
 * @param props.borderRadius - Custom border radius.
 * @param props - Additional button props.
 *
 * @example
 * <Button id="save-btn" variant="primary" icon={<SaveIcon />} loading={false}>
 *   Save
 * </Button>
 */
export const Button = ({
  variant = 'primary',
  children,
  disabled = false,
  loading = false,
  size = 'medium',
  icon,
  iconAlign,
  ariaLabel,
  id,
  borderRadius,
  ...props
}: ButtonProps) => {
  const wrapperClasses = clsx(
    styles.inputWrapper,
    styles[size],
    icon && (iconAlign === 'right' ? styles.iconRight : styles.iconLeft),
    loading && styles.loading,
  );

  const ButtonClass = clsx(styles.button, styles[variant], wrapperClasses, props?.className);

  // Create inline style with custom border radius if provided
  const buttonStyle = borderRadius ? { borderRadius, ...props.style } : props.style;

  const spinnerSizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const spinnerSize = spinnerSizeMap[size];

  return (
    <button
      data-testid="button-testId"
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      {...props}
      style={buttonStyle}
      className={`${ButtonClass}`}
    >
      {loading ? (
        <div className={styles.spinnerContainer}>
          <span className={styles.hidden}>{children}</span>
          <Spinner variant="secondary" width={spinnerSize} height={spinnerSize} />
        </div>
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          <Text selectable={false} variant={'subtitle'}>
            {children || '...'}
          </Text>
        </>
      )}
    </button>
  );
};
