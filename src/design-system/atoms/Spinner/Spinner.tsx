import React from 'react';
import clsx from 'clsx';

import styles from './Spinner.module.css';

/**
 * Props for the {@link Spinner} component.
 *
 * @property fullScreen - Whether to display the spinner in full screen mode.
 * @property width - Width of the spinner in pixels. Default is 40.
 * @property height - Height of the spinner in pixels. Default is 40.
 * @property variant - Visual style of the spinner ('primary' or 'secondary').
 */
interface SpinnerProps {
  fullScreen?: boolean;
  width?: number;
  height?: number;
  variant?: 'primary' | 'secondary';
}

/**
 * Spinner component for indicating loading state.
 *
 * Renders an animated spinner, optionally in full screen mode, with customizable size and variant.
 *
 * @example
 * <Spinner variant="secondary" width={24} height={24} />
 */
export const Spinner = ({
  fullScreen = false,
  width = 40,
  height = 40,
  variant = 'primary',
}: SpinnerProps) => {
  return (
    <div
      data-testid="spinner-container"
      className={clsx(styles.spinnerContainer, fullScreen && styles.fullScreen)}
    >
      <div
        style={{ width: width, height: height }}
        className={`${styles.spinner} ${styles[variant]}`}
      ></div>
    </div>
  );
};
