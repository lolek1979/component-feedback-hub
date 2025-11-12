'use client';

import React from 'react';
import clsx from 'clsx';

import styles from './Typography.module.css';

/**
 * Supported HTML elements for Typography component.
 */
type ComponentWithTextChildren =
  // Phrasing content (inline elements)
  | 'a'
  | 'abbr'
  | 'audio'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'button'
  | 'canvas'
  | 'cite'
  | 'code'
  | 'data'
  | 'datalist'
  | 'dfn'
  | 'em'
  | 'i'
  | 'iframe'
  | 'img'
  | 'input'
  | 'kbd'
  | 'label'
  | 'mark'
  | 'meter'
  | 'noscript'
  | 'object'
  | 'output'
  | 'picture'
  | 'progress'
  | 'q'
  | 'ruby'
  | 's'
  | 'samp'
  | 'script'
  | 'select'
  | 'slot'
  | 'small'
  | 'span'
  | 'strong'
  | 'sub'
  | 'sup'
  | 'template'
  | 'textarea'
  | 'time'
  | 'u'
  | 'var'
  | 'video'
  // Flow content (block elements)
  | 'address'
  | 'article'
  | 'aside'
  | 'blockquote'
  | 'caption'
  | 'dd'
  | 'del'
  | 'details'
  | 'div'
  | 'dt'
  | 'figcaption'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'header'
  | 'ins'
  | 'legend'
  | 'li'
  | 'main'
  | 'nav'
  | 'p'
  | 'pre'
  | 'search'
  | 'section'
  | 'summary'
  | 'td'
  | 'th'
  // Document metadata
  | 'style'
  | 'title';

/**
 * Supported text variants for Typography component.
 */
type TextVariant =
  | 'H1/Bold'
  | 'H2/Bold'
  | 'H3/Bold'
  | 'H4/Bold'
  | 'Headline/Bold'
  | 'Body/Bold'
  | 'Subtitle/Default/Bold'
  | 'Caption/Link-dotted-regular'
  | 'Footnote/Bold'
  | 'H1/Regular'
  | 'H2/Regular'
  | 'H3/Regular'
  | 'H4/Regular'
  | 'Headline/Regular'
  | 'Body/Regular'
  | 'Subtitle/Default/Regular'
  | 'Caption/Regular'
  | 'Caption/Bold'
  | 'Footnote/Regular'
  | 'H4/Light'
  | 'Headline/Light'
  | 'Body/Light'
  | 'H4/Link-inline'
  | 'Headline/Link-inline'
  | 'Body/Link-inline'
  | 'Subtitle/Default/Link-inline'
  | 'Caption/Link-inline'
  | 'Footnote/Link-inline'
  | 'Subtitle/Default/Link-dotted-regular'
  | 'Subtitle/Default/Link-dotted-bold'
  | 'Caption/Link-dotted-bold';

/**
 * Supported text alignment options.
 */
type TextAlign = 'center' | 'inherit' | 'justify' | 'left' | 'right';

/**
 * Props for the Typography component.
 *
 * @property id - Unique identifier for the component.
 * @property component - HTML element to render as.
 * @property variant - Text style variant.
 * @property align - Text alignment.
 * @property className - Additional CSS class.
 * @property children - Content to render inside the component.
 */
interface TypographyProps {
  id?: string;
  component?: ComponentWithTextChildren;
  variant?: TextVariant;
  align?: TextAlign;
  className?: string;
  children: React.ReactNode;
}

/**
 * Typography component for rendering styled text with semantic HTML elements.
 *
 * Supports multiple variants, alignment, and custom HTML tags.
 *
 * @param props TypographyProps
 * @returns React component
 */
export const Typography = ({
  component = 'span',
  variant = 'Body/Regular',
  align = 'inherit',
  className,
  children,
  id,
  ...props
}: TypographyProps) => {
  const Component = component as React.ElementType;

  const variantClass = getVariantClass(variant);
  const alignClass = getAlignClass(align);

  const combinedClassName = clsx(styles.typography, variantClass, alignClass, className);

  return (
    <Component className={combinedClassName} {...props} id={id}>
      {children}
    </Component>
  );
};

/**
 * Maps text variant to corresponding CSS class.
 *
 * @param variant - TextVariant
 * @returns CSS class name
 */
function getVariantClass(variant: TextVariant): string {
  const variantMapping: Record<TextVariant, string> = {
    'H1/Bold': styles.h1Bold,
    'H2/Bold': styles.h2Bold,
    'H3/Bold': styles.h3Bold,
    'H4/Bold': styles.h4Bold,
    'Headline/Bold': styles.headlineBold,
    'Body/Bold': styles.bodyBold,
    'Subtitle/Default/Bold': styles.subtitleBold,
    'Footnote/Bold': styles.footnoteBold,

    'H1/Regular': styles.h1Regular,
    'H2/Regular': styles.h2Regular,
    'H3/Regular': styles.h3Regular,
    'H4/Regular': styles.h4Regular,
    'Headline/Regular': styles.headlineRegular,
    'Body/Regular': styles.bodyRegular,
    'Subtitle/Default/Regular': styles.subtitleRegular,
    'Caption/Regular': styles.captionRegular,
    'Caption/Bold': styles.captionBold,
    'Footnote/Regular': styles.footnoteRegular,

    'H4/Light': styles.h4Light,
    'Headline/Light': styles.headlineLight,
    'Body/Light': styles.bodyLight,

    'H4/Link-inline': styles.h4LinkInline,
    'Headline/Link-inline': styles.headlineLinkInline,
    'Body/Link-inline': styles.bodyLinkInline,
    'Subtitle/Default/Link-inline': styles.subtitleLinkInline,
    'Caption/Link-inline': styles.captionLinkInline,
    'Footnote/Link-inline': styles.footnoteLinkInline,

    'Subtitle/Default/Link-dotted-regular': styles.subtitleLinkDottedRegular,
    'Caption/Link-dotted-regular': styles.captionLinkDottedRegular,
    'Subtitle/Default/Link-dotted-bold': styles.subtitleLinkDottedBold,
    'Caption/Link-dotted-bold': styles.captionLinkDottedBold,
  };

  return variantMapping[variant];
}

/**
 * Maps text alignment to corresponding CSS class.
 *
 * @param align - TextAlign
 * @returns CSS class name
 */
function getAlignClass(align: TextAlign): string {
  const alignMapping: Record<TextAlign, string> = {
    center: styles.alignCenter,
    inherit: styles.alignInherit,
    justify: styles.alignJustify,
    left: styles.alignLeft,
    right: styles.alignRight,
  };

  return alignMapping[align];
}
