import styles from './Divider.module.css';

/**
 * Props for the {@link Divider} component.
 *
 * @property orientation - Divider orientation ('horizontal' or 'vertical'). Default is 'horizontal'.
 * @property id - Unique identifier for the divider.
 * @property variant - Visual style of the divider ('primary', 'subtle', 'dotted', 'prominent').
 * @property className - Optional additional CSS class names.
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  id?: string;
  variant?: 'primary' | 'subtle' | 'dotted' | 'prominent';
  className?: string;
}

const variantClassMap: Record<string, string> = {
  dotted: styles.dividerDotted,
  subtle: styles.dividerSubtle,
  prominent: styles.dividerProminent,
};

/**
 * Divider component for visually separating content.
 *
 * Supports horizontal and vertical orientation, multiple visual variants, and custom styling.
 * @example
 * <Divider orientation="vertical" variant="dotted" />
 */
export const Divider = ({
  orientation = 'horizontal',
  id,
  variant = 'primary',
  className,
}: DividerProps) => {
  const dividerClass = `${styles.divider} 
    ${orientation === 'vertical' ? styles.dividerVertical : styles.dividerHorizontal} 
    ${variantClassMap[variant] || ''}
    ${className || ''}`;

  return (
    <div
      id={id}
      className={dividerClass}
      data-testid="divider-testid"
      role="separator"
      aria-orientation={orientation}
    />
  );
};
