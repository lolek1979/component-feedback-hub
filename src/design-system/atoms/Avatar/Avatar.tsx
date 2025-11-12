import React from 'react';
import clsx from 'clsx';

import { getInitials } from '@/core/auth/utils';

import styles from './Avatar.module.css';

/**
 * Props for the {@link Avatar} component.
 *
 * @property name - The full name to display initials for.
 * @property className - Optional additional CSS class names.
 * @property size - Size of the avatar ('S', 'M', or 'L'). Default is 'L'.
 */
interface AvatarProps {
  name: string;
  className?: string;
  size?: 'S' | 'M' | 'L';
}

/**
 * Avatar component for displaying user initials in a styled circle.
 *
 * @example
 * <Avatar name="Jane Doe" size="M" />
 */
export const Avatar = ({ name, className = '', size = 'L' }: AvatarProps) => {
  const sizeMap = { S: styles.sizeS, M: styles.sizeM, L: styles.sizeL };
  const sizeClass = sizeMap[size] ?? styles.sizeL;
  const avatarStyleWrapper = clsx(styles.avatar, sizeClass, className);

  return (
    <div className={avatarStyleWrapper} role="img" aria-label={name ?? undefined}>
      {getInitials(name)}
    </div>
  );
};
