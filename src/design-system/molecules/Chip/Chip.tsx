'use client';

import React from 'react';
import clsx from 'clsx';

import { Typography } from '../Typography';
import styles from './Chip.module.css';

/**
 * Supported color themes for the {@link Chip} component.
 */
export type ChipColors =
  | 'gray'
  | 'green'
  | 'red'
  | 'orange'
  | 'blue'
  | 'lightGreen'
  | 'lightRed'
  | 'lightBlue'
  | 'lightOrange';

/**
 * Supported sizes for the {@link Chip} component.
 */
type sizes = 'small' | 'medium' | 'large';

/**
 * Props for the {@link Chip} component.
 *
 * @property children - The content to display inside the chip.
 * @property ariaLabel - Accessibility label for the chip.
 * @property color - The color theme of the chip.
 * @property size - The size of the chip.
 * @property icon - Optional icon to display alongside the chip text.
 * @property iconPosition - Position of the icon relative to the text (`'left'`, `'right'`, or `'both'`).
 * @property disabled - Whether the chip is disabled.
 * @property className - Additional CSS class names.
 */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  color?: ChipColors;
  size?: sizes;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'both';
  disabled?: boolean;
  className?: string;
}

/**
 *
 * @property children - The icon element.
 * @property position - Position of the icon (`'left'` or `'right'`).
 * @property id - Unique identifier for the icon.
 */
interface ChipIconProps {
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
interface ChipTextProps {
  children: React.ReactNode;
  className?: string;
  id: string;
}

/**
 * Context value type for the chip.
 *
 * @property color - The color theme of the chip.
 * @property size - The size of the chip.
 * @property disabled - Whether the chip is disabled.
 */
interface ChipContextType {
  color: ChipColors;
  size: sizes;
  disabled: boolean;
}

/**
 * React context for chip color, size, and disabled state.
 */
const ChipContext = React.createContext<ChipContextType>({
  color: 'gray',
  size: 'medium',
  disabled: false,
});

/**
 * ChipRoot is a memoized React component that renders a stylized chip or badge element.
 *
 * Supports optional icons, color and size variants, and a disabled state.
 * If an `icon` is provided, it displays the icon on the left or right side of the chip text.
 * Prevents focus ring on mouse click for better UX.
 * Uses `span` HTML element for semantic purposes.
 * Provides context for color, size, and disabled state to child components.
 *
 * @example
 * <Chip color="green" size="large" icon={<CheckIcon />} iconPosition="left">
 *   Success
 * </Chip>
 */
const ChipRoot = React.memo(
  ({
    className,
    children,
    ariaLabel,
    color = 'gray',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled = false,
    ...props
  }: ChipProps) => {
    const contextValue = React.useMemo(() => ({ color, size, disabled }), [color, size, disabled]);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
    };

    // Convert iconPosition to camelCase for CSS module
    const iconPositionClass =
      iconPosition === 'left' ? 'iconLeft' : iconPosition === 'right' ? 'iconRight' : 'iconBoth';

    if (icon) {
      return (
        <span
          className={clsx(
            styles.badge,
            className,
            styles[color],
            styles[size],
            styles[iconPositionClass],
            disabled && styles.disabled,
          )}
          tabIndex={disabled ? -1 : 0}
          {...props}
          data-testid="badge"
          onMouseDown={handleMouseDown}
        >
          {iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
          <div className={styles.textContainer}>
            <Typography
              variant={size === 'large' ? 'Subtitle/Default/Bold' : 'Caption/Bold'}
              className={styles.text}
            >
              {children}
            </Typography>
          </div>
          {iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </span>
      );
    }

    return (
      <ChipContext.Provider value={contextValue}>
        <span
          className={clsx(
            styles.badge,
            className,
            styles[color],
            styles[size],
            disabled && styles.disabled,
          )}
          aria-label={ariaLabel}
          tabIndex={disabled ? -1 : 0}
          {...props}
          data-testid="badge"
          onMouseDown={handleMouseDown}
        >
          <div className={styles.textContainer}>
            <Typography
              variant={size === 'large' ? 'Subtitle/Default/Bold' : 'Caption/Bold'}
              className={styles.text}
            >
              {children}
            </Typography>
          </div>
        </span>
      </ChipContext.Provider>
    );
  },
);

/**
 * Subcomponent for rendering an icon inside the chip.
 *
 * @example
 * <Chip.Icon position="left" id="chip-icon">{icon}</Chip.Icon>
 */
const ChipIcon = React.memo(({ children, position = 'left', id }: ChipIconProps) => {
  return (
    <span className={styles.icon} data-position={position} id={id}>
      {children}
    </span>
  );
});

/**
 * Subcomponent for rendering text inside the chip.
 *
 * @example
 * <Chip.Text id="chip-text">Label</Chip.Text>
 */
const ChipText = React.memo(({ children, className, id }: ChipTextProps) => {
  const { size } = React.useContext(ChipContext);

  return (
    <Typography
      variant={size === 'large' ? 'Subtitle/Default/Bold' : 'Caption/Bold'}
      className={`${styles.text} ${className ?? ''}`}
      id={id}
    >
      {children}
    </Typography>
  );
});

ChipRoot.displayName = 'Chip';
ChipIcon.displayName = 'Chip.Icon';
ChipText.displayName = 'Chip.Text';

/**
 * The main Chip component, with subcomponents for icon and text.
 *
 * @example
 * <Chip color="blue" size="medium" icon={<InfoIcon />}>
 *   Info
 * </Chip>
 * <Chip.Text id="chip-text">Label</Chip.Text>
 * <Chip.Icon id="chip-icon">{icon}</Chip.Icon>
 */
export const Chip = Object.assign(ChipRoot, {
  Icon: ChipIcon,
  Text: ChipText,
});
