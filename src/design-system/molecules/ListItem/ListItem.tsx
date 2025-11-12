'use client';

import React, { ComponentProps } from 'react';
import clsx from 'clsx';

import { Text, Toggle } from '@/design-system/atoms';

import styles from './ListItem.module.css';

/**
 * Props for the ListItemLabel component.
 *
 * @property children - The label text to display.
 * @property showStatus - Whether to show a status dot.
 */
export interface ListItemLabelProps {
  children: string;
  showStatus?: boolean;
}

/**
 * ListItemLabel displays a styled label with optional status dot.
 *
 * @param props ListItemLabelProps
 * @returns React component
 */
export const ListItemLabel = ({ children, showStatus = false }: ListItemLabelProps) => {
  return (
    <div className={styles.label}>
      {showStatus && <div className={styles.statusDot} />}
      <Text variant="subtitle" regular>
        {children}
      </Text>
    </div>
  );
};

/**
 * Props for the ListItem component.
 *
 * @property children - The label text to display.
 * @property size - Size of the list item ('S' or 'M').
 * @property state - Visual state ('default', 'active', 'disabled').
 * @property leftIcon - Optional icon to display on the left.
 * @property rightIcon - Optional icon to display on the right.
 * @property isActive - Whether the item is active (for toggle).
 * @property onActiveChange - Callback when toggle state changes.
 * @property onClick - Callback when item is clicked.
 * @property showStatus - Whether to show a status dot.
 * @property disabled - Whether the item is disabled.
 * @property className - Additional CSS class.
 */
export interface ListItemProps extends ComponentProps<'div'> {
  children: string;
  size?: 'S' | 'M';
  state?: 'default' | 'active' | 'disabled';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  onClick?: () => void;
  showStatus?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * ListItem displays a styled list item with optional icons, status, and toggle.
 *
 * @param props ListItemProps
 * @returns React component
 */
export const ListItem = ({
  children,
  size = 'M',
  state = 'default',
  leftIcon,
  rightIcon,
  isActive = false,
  onActiveChange,
  onClick,
  showStatus = false,
  disabled = false,
  className = '',
  ...props
}: ListItemProps) => {
  const sizeMap = { S: styles.sizeS, M: styles.sizeM };
  const sizeClass = sizeMap[size] ?? styles.sizeM;

  const wrapperClassName = clsx(
    styles.listItem,
    sizeClass,
    state === 'active' && styles.active,
    (state === 'disabled' || disabled) && styles.disabled,
    className,
  );

  const handleToggleChange = (checked: boolean) => {
    if (onActiveChange && !disabled) {
      onActiveChange(checked);
    }
  };

  const handleClick = () => {
    if (onClick && !disabled && state !== 'disabled') {
      onClick();
    }
  };

  return (
    <div
      className={wrapperClassName}
      tabIndex={disabled ? -1 : 0}
      role="listitem"
      onClick={handleClick}
      {...props}
    >
      {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}

      <ListItemLabel showStatus={showStatus}>{children}</ListItemLabel>

      {onActiveChange && (
        <div className={styles.toggleWrapper}>
          <Toggle
            checked={isActive}
            onChange={(e) => handleToggleChange(e.target.checked)}
            disabled={disabled || state === 'disabled'}
          />
        </div>
      )}

      {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
    </div>
  );
};
