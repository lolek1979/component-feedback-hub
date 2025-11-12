import React, { CSSProperties, ElementType, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Text.module.css';

/**
 * Supported text variants for the {@link Text} component.
 *
 * - `'h1'`, `'h2'`, `'h3'`, `'h4'`: Headings
 * - `'headline'`: Headline style
 * - `'body'`: Body text
 * - `'subtitle'`, `'subtitle-article'`: Subtitle styles
 * - `'caption'`: Caption text
 * - `'footnote'`: Footnote text
 * - `'label'`: Label text
 */
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'headline'
  | 'body'
  | 'subtitle'
  | 'subtitle-article'
  | 'caption'
  | 'footnote'
  | 'label';

/**
 * Supported text alignments for the {@link Text} component.
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Supported text colors for the {@link Text} component.
 */
type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'brand'
  | 'inverse'
  | 'warning'
  | 'positive'
  | 'negative'
  | 'info';

/**
 * Base props for the {@link Text} component.
 *
 * @property variant - Text variant style.
 * @property component - Custom React element type to render.
 * @property gutterBottom - Adds bottom margin.
 * @property noWrap - Prevents text wrapping.
 * @property align - Text alignment.
 * @property children - Content to display.
 * @property className - Additional CSS class names.
 * @property role - ARIA role.
 * @property id - Unique identifier.
 * @property ariaLabel - Accessibility label.
 * @property ariaLabelledby - Accessibility labelledby attribute.
 * @property ariaLive - ARIA live region.
 * @property ariaHidden - ARIA hidden state.
 * @property selectable - Whether text is selectable.
 * @property tabIndex - Tab index.
 * @property color - Text color.
 * @property regular - Use regular font weight.
 * @property underline - Underline text.
 * @property dotted - Dotted underline.
 * @property light - Light font weight.
 * @property style - Inline styles.
 */
interface BaseTextProps {
  variant?: TextVariant;
  component?: ElementType;
  gutterBottom?: boolean;
  noWrap?: boolean;
  align?: TextAlign;
  children: ReactNode;
  className?: string;
  role?: string;
  id?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaHidden?: boolean;
  selectable?: boolean;
  tabIndex?: number;
  color?: TextColor;
  regular?: boolean;
  underline?: boolean;
  dotted?: boolean;
  light?: boolean;
  style?: CSSProperties;
}

/**
 * Props for the label variant of the {@link Text} component.
 *
 * @property htmlFor - The id of the input element this label is associated with.
 */
interface LabelTextProps extends BaseTextProps {
  variant: 'label';
  htmlFor?: string;
}

/**
 * Props for the {@link Text} component.
 */
export type TextProps = BaseTextProps | LabelTextProps;

/**
 * Text component for rendering styled text with various variants, colors, and accessibility features.
 *
 * Supports headings, body, captions, labels, and more. Can be customized with alignment, color, font weight, underline, and ARIA attributes.
 * @example
 * <Text variant="h1" color="brand" gutterBottom>
 *   Welcome
 * </Text>
 * <Text variant="label" htmlFor="username-input">
 *   Username
 * </Text>
 */
export const Text = ({
  variant = 'body',
  component,
  gutterBottom = false,
  noWrap = false,
  align,
  children,
  className = '',
  role,
  id,
  ariaLabel,
  ariaLabelledby,
  ariaLive,
  ariaHidden,
  selectable = true,
  tabIndex,
  underline = false,
  regular = false,
  dotted = false,
  light = false,
  color,
  style,
  ...props
}: TextProps) => {
  const defaultComponent = variant === 'body' ? 'span' : variantMapping[variant];
  const Typography = component ?? defaultComponent ?? 'span';

  const textClasses = clsx(
    styles.text,
    styles[variant],
    gutterBottom && styles.gutterBottom,
    noWrap && styles.noWrap,
    align && styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
    regular && styles.regular,
    underline && styles.underline,
    light && styles.light,
    dotted && styles.dottedUnderline,
    !selectable && styles.preventSelect,
    color && styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`],
    className,
  );

  return (
    <Typography
      className={textClasses}
      role={role}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-live={ariaLive}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      style={style}
      {...(variant === 'label' ? { htmlFor: (props as LabelTextProps).htmlFor } : {})}
    >
      {children}
    </Typography>
  );
};

/**
 * Maps text variants to their corresponding HTML element types.
 */
const variantMapping: Record<TextVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  headline: 'h6',
  subtitle: 'span',
  'subtitle-article': 'span',
  body: 'span',
  caption: 'span',
  footnote: 'span',
  label: 'label',
};
