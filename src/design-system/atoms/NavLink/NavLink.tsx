import Link, { LinkProps } from 'next/link';
import clsx from 'clsx';

import styles from './NavLink.module.css';

/**
 * Props for the {@link NavLink} component.
 *
 * @property href - The URL or path to navigate to.
 * @property className - Optional additional CSS class names.
 * @property children - The content to display inside the link.
 * @property ariaLabel - Accessibility label for the link.
 * @property role - ARIA role for the link.
 * @property id - Unique identifier for the link.
 */
interface NavLinkProps extends LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  role?: string;
  id?: string;
}

/**
 * NavLink component for navigation within the application.
 *
 * Renders a Next.js link with custom styling and accessibility attributes.
 *
 * @param props.href - The URL or path to navigate to.
 * @param props.className - Additional CSS class names.
 * @param props.children - The content to display inside the link.
 * @param props.ariaLabel - Accessibility label.
 * @param props.role - ARIA role.
 * @param props.id - Unique identifier.
 * @param props - Additional Next.js Link props.
 *
 * @example
 * <NavLink href="/home" ariaLabel="Go to home" id="nav-home">
 *   Home
 * </NavLink>
 */
export const NavLink = ({
  href,
  className = '',
  children,
  ariaLabel,
  role,
  id,
  ...props
}: NavLinkProps) => (
  <Link
    href={href}
    className={clsx(styles.navLink, className)}
    aria-current="page"
    aria-label={ariaLabel}
    role={role}
    id={id}
    {...props}
  >
    {children}
  </Link>
);
