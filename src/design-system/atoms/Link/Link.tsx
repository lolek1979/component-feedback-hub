import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import styles from './Link.module.css';

/**
 * Props for the {@link AppLink} component.
 *
 * @property children - The content to display inside the link.
 * @property link - The URL or path to navigate to.
 * @property variant - Visual style of the link ('primary', 'secondary', 'tertiary', 'on-color').
 * @property dotted - Whether to display a dotted underline.
 * @property target - Specifies where to open the linked document.
 * @property ariaLabel - Accessibility label for the link.
 * @property role - ARIA role for the link.
 * @property id - Unique identifier for the link.
 * @property onClick - Click event handler.
 */
interface LinkProps {
  children: React.ReactNode;
  link: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'on-color';
  dotted?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  ariaLabel?: string;
  role?: string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * AppLink component for navigation within the application.
 *
 * Supports custom styling, accessibility attributes, and external targets.
 *
 * @example
 * <AppLink link="/dashboard" variant="primary" ariaLabel="Go to dashboard">
 *   Dashboard
 * </AppLink>
 */
export const AppLink = ({
  children,
  link,
  target,
  variant,
  dotted = false,
  ariaLabel,
  role,
  id,
  onClick,
}: LinkProps) => {
  const LinkStyles = clsx(styles.link, variant && styles[variant], dotted && styles.dotted);

  return (
    <Link
      href={link}
      target={target}
      className={LinkStyles}
      aria-current="page"
      aria-label={ariaLabel}
      role={role}
      id={id}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
