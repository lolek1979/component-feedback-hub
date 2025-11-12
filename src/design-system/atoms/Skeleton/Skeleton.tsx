import React from 'react';

import styles from './Skeleton.module.css';

/**
 * Supported sizes for the {@link Skeleton} component.
 *
 * - `'small'`: Small skeleton placeholder
 * - `'medium'`: Medium skeleton placeholder
 * - `'large'`: Large skeleton placeholder
 */
export type SkeletonSize = 'small' | 'medium' | 'large';

/**
 * Props for the {@link Skeleton} component.
 *
 * @property size - Size of the skeleton ('small', 'medium', 'large'). Default is 'medium'.
 * @property maxWidth - Maximum width of the skeleton.
 * @property height - Height of the skeleton.
 * @property borderRadius - Border radius of the skeleton.
 */
interface SkeletonProps {
  size?: SkeletonSize;
  maxWidth?: string;
  height?: string;
  borderRadius?: string;
}

/**
 * Skeleton component for displaying a loading placeholder.
 *
 * Renders a rectangular animated placeholder to indicate loading state for content.
 *
 * @example
 * <Skeleton size="large" maxWidth="500px" />
 */
export const Skeleton = ({ size = 'medium', maxWidth, height, borderRadius }: SkeletonProps) => {
  const DEFAULT_SIZE_HEIGHT = '32px';
  const style = {
    maxWidth: maxWidth || getSizeMaxWidth(size),
    height: height || DEFAULT_SIZE_HEIGHT,
    width: '100%',
    borderRadius: borderRadius || '4px',
  };

  return (
    <div
      className={styles.skeleton}
      style={style}
      data-testid="skeleton"
      aria-busy="true"
      role="status"
    />
  );
};

/**
 * Returns the default max width for a given skeleton size.
 *
 * @param size - The skeleton size.
 * @returns The default max width as a string.
 */
function getSizeMaxWidth(size: SkeletonSize): string {
  switch (size) {
    case 'small':
      return '120px';
    case 'large':
      return '717px';
    case 'medium':
    default:
      return '366px';
  }
}
