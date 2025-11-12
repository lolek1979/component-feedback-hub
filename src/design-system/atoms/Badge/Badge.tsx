'use client';

import React from 'react';

import { Text } from '../Text';
import styles from './Badge.module.css';

/**
 * Supported color themes for the {@link Badge} component.
 */
export type BadgeColors =
  | 'gray'
  | 'green'
  | 'red'
  | 'orange'
  | 'blue'
  | 'lightGreen'
  | 'lightRed'
  | 'lightBlue'
  | 'lightOrange'
  | 'disabled';

/**
 * Supported sizes for the {@link Badge} component.
 */
type sizes = 'small' | 'xsmall' | 'large';

/**
 * Props for the {@link Badge} component.
 *
 * @property children - The content to display inside the badge.
 * @property ariaLabel - Accessibility label for the badge.
 * @property color - The color theme of the badge.
 * @property size - The size of the badge.
 * @property icon - Optional icon to display alongside the badge text.
 * @property iconPosition - Position of the icon relative to the text (`'left'` or `'right'`).
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  color?: BadgeColors;
  size?: sizes;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 *
 * @property children - The icon element.
 * @property position - Position of the icon (`'left'` or `'right'`).
 * @property id - Unique identifier for the icon.
 */
interface BadgeIconProps {
  children: React.ReactNode;
  position?: 'left' | 'right';
  id: string;
}

/**
 *
 * @property children - The text content.
 * @property className - Additional CSS class names.
 * @property id - Unique identifier for the text.
 */
interface BadgeTextProps {
  children: React.ReactNode;
  className?: string;
  id: string;
}

/**
 * Context value type for the badge.
 *
 * @property color - The color theme of the badge.
 * @property size - The size of the badge.
 */
interface BadgeContextType {
  color: BadgeColors;
  size: sizes;
}

/**
 * React context for badge color and size.
 */
const BadgeContext = React.createContext<BadgeContextType>({
  color: 'gray',
  size: 'small',
});

/**
 * `BadgeRoot` is a memoized React component that renders a badge element with optional icon support.
 * It provides visual distinction for UI elements such as statuses, notifications, or labels.
 *
 * @remarks
 * - If an `icon` is provided, the badge displays the icon either to the left or right of the text, based on `iconPosition`.
 * - The badge uses an `output` element for semantic purposes.
 * - Prevents focus ring on mouse click for improved UX.
 * - Uses `BadgeContext` to provide `color` and `size` to descendants when no icon is present.
 *
 * @returns The rendered badge component.
 *
 * @example
 * ```tsx
 * <BadgeRoot color="primary" size="large" icon={<StarIcon />} iconPosition="right">
 *   Featured
 * </BadgeRoot>
 * ```
 */
const BadgeRoot = React.memo(
  ({
    className,
    children,
    ariaLabel,
    color = 'gray',
    size = 'small',
    icon,
    iconPosition = 'left',
    ...props
  }: BadgeProps) => {
    const contextValue = React.useMemo(() => ({ color, size }), [color, size]);

    // Prevent focus ring on mouse click
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
    };

    let iconPaddingClass = '';
    if (icon && (size === 'small' || size === 'large')) {
      if (iconPosition === 'left') {
        iconPaddingClass = styles.withIconLeft;
      } else if (iconPosition === 'right') {
        iconPaddingClass = styles.withIconRight;
      }
    }

    if (icon) {
      return (
        <output
          className={`${styles.badge} ${className ?? ''} ${styles[color]} ${styles[size]} ${styles.withIcon} ${iconPaddingClass}`}
          aria-label={ariaLabel}
          {...props}
          data-testid="badge"
          onMouseDown={handleMouseDown}
        >
          {iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
          <Text
            variant={size === 'large' ? 'subtitle' : 'caption'}
            selectable={false}
            className={styles.text}
          >
            {children}
          </Text>
          {iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </output>
      );
    }

    return (
      <BadgeContext.Provider value={contextValue}>
        <output
          className={`${styles.badge} ${className ?? ''} ${styles[color]} ${styles[size]}`}
          aria-label={ariaLabel}
          {...props}
          data-testid="badge"
          onMouseDown={handleMouseDown}
        >
          <Text
            variant={size === 'large' ? 'subtitle' : 'caption'}
            selectable={false}
            className={styles.text}
          >
            {children}
          </Text>
        </output>
      </BadgeContext.Provider>
    );
  },
);

/**
 * Subcomponent for rendering an icon inside the badge.
 *
 * @example
 * <Badge.Icon position="left" id="badge-icon">{icon}</Badge.Icon>
 */
const BadgeIcon = React.memo(({ children, position = 'left', id }: BadgeIconProps) => {
  return (
    <span className={styles.icon} data-position={position} id={id}>
      {children}
    </span>
  );
});

/**
 * Subcomponent for rendering text inside the badge.
 *
 * @example
 * <Badge.Text id="badge-text">Featured</Badge.Text>
 */
const BadgeText = React.memo(({ children, className, id }: BadgeTextProps) => {
  const { size } = React.useContext(BadgeContext);

  return (
    <Text
      variant={size === 'large' ? 'subtitle' : 'caption'}
      className={`${styles.text} ${className ?? ''}`}
      id={id}
    >
      {children}
    </Text>
  );
});

BadgeRoot.displayName = 'Badge';
BadgeIcon.displayName = 'Badge.Icon';
BadgeText.displayName = 'Badge.Text';

/**
 * The main Badge component, with subcomponents for icon and text.
 *
 * @example
 * <Badge color="green" size="large" icon={<CheckIcon />}>
 *   Success
 * </Badge>
 * <Badge.Text id="badge-text">Label</Badge.Text>
 * <Badge.Icon id="badge-icon">{icon}</Badge.Icon>
 */
export const Badge = Object.assign(BadgeRoot, {
  Icon: BadgeIcon,
  Text: BadgeText,
});
