'use client';

import React from 'react';
import Link from 'next/link';

import IconLeft from '@/core/assets/icons/chevron_left.svg';
import { Text } from '@/design-system/atoms';

import styles from './Breadcrumbs.module.css';

/**
 * Breadcrumb item for the {@link Breadcrumbs} component.
 *
 * @property value - The display text for the breadcrumb.
 * @property link - The URL or path to navigate to.
 * @property onClick - Optional callback when the breadcrumb is clicked.
 */
interface Breadcrumb {
  value: string;
  link: string;
  onClick?: () => void;
}

/**
 * Props for the {@link Breadcrumbs} component.
 *
 * @property breadcrumbs - Array of breadcrumb items to display.
 * @property id - Unique identifier for the breadcrumbs navigation.
 * @property showBackLink - If true and only one breadcrumb, shows a back link with left arrow.
 */
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  id?: string;
  showBackLink?: boolean; // Adds optional back link with left arrow
  showUnderline?: boolean;
}
/**
 * Breadcrumbs component for navigation hierarchy.
 *
 * Displays a list of breadcrumb links for navigation, with optional back link.
 *
 * @example
 * <Breadcrumbs
 *   breadcrumbs={[
 *     { value: 'Home', link: '/' },
 *     { value: 'Dashboard', link: '/dashboard' }
 *   ]}
 * />
 */
export const Breadcrumbs = ({
  breadcrumbs,
  id,
  showBackLink,
  showUnderline = true,
}: BreadcrumbsProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, onClick?: () => void) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <nav className={styles.breadGroup} aria-label="Breadcrumb" id={id}>
      {showBackLink && breadcrumbs.length === 1 && (
        <Link
          href={breadcrumbs[breadcrumbs.length - 1].link}
          className={`${styles.backLink} ${!showUnderline ? styles.noUnderline : ''}`}
          onClick={(e) => handleClick(e, breadcrumbs[breadcrumbs.length - 1].onClick)}
        >
          <IconLeft
            id="icon-bradcrumbs-chevron-left"
            width={24}
            height={24}
            className={styles.backLinkIcon}
          />

          <Text variant="subtitle" regular className={styles.bread}>
            {breadcrumbs[0].value}
          </Text>
        </Link>
      )}
      {!showBackLink &&
        breadcrumbs.map((element, index) => (
          <React.Fragment key={index}>
            <Link
              href={element.link}
              className={`${styles.bread}`}
              onClick={(e) => handleClick(e, element.onClick)}
              aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
              id={`link-breadcrumbs-navigate-${index}`}
            >
              <Text
                className={`${styles.bread} ${index === breadcrumbs.length - 1 ? styles.current : ''}`}
                variant="subtitle"
                regular
              >
                {element.value}
              </Text>
            </Link>
            {index < breadcrumbs.length - 1 && <span className={styles.separator}>/</span>}
          </React.Fragment>
        ))}
    </nav>
  );
};
