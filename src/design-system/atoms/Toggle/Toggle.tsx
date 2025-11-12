'use client';

import { ChangeEvent, ComponentProps, useEffect, useState } from 'react';

import styles from './Toggle.module.css';

/**
 * Props for the {@link Toggle} component.
 *
 * @property defaultChecked - Initial checked state of the toggle.
 * @property label - Accessibility label for the toggle.
 * @property isError - Whether the toggle is in an error state.
 */
interface ToggleProps extends ComponentProps<'input'> {
  defaultChecked?: boolean;
  label?: string;
  isError?: boolean;
}

/**
 * Toggle component for switching between on/off states.
 *
 * Supports controlled and uncontrolled checked state, error styling, and accessibility features.
 *
 * @param props.defaultChecked - Initial checked state.
 * @param props.label - Accessibility label.
 * @param props.isError - Error styling.
 * @param props - Additional input props.
 *
 * @example
 * <Toggle label="Enable notifications" defaultChecked={true} isError={false} />
 */
export const Toggle = ({
  defaultChecked = false,
  label = 'toggle button',
  isError = false,
  ...props
}: ToggleProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked);
    }
  }, [props.checked]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
    props?.onChange?.(e);
  };

  return (
    <input
      type="checkbox"
      className={`${styles.toggle} ${isError ? styles.error : ''}`}
      {...props}
      checked={checked}
      onChange={handleChange}
      aria-label={label}
      role="switch"
      aria-checked={checked}
    />
  );
};
