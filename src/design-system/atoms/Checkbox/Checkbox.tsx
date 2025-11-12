'use client';

import { ChangeEvent, ComponentProps, useEffect, useState } from 'react';

import styles from './Checkbox.module.css';

/**
 * Props for the {@link Checkbox} component.
 *
 * @property defaultChecked - Initial checked state of the checkbox.
 * @property label - Accessibility label for the checkbox.
 * @property isMultiselect - Whether the checkbox is part of a multiselect group.
 * @property isError - Whether the checkbox is in an error state.
 */
interface CheckboxProps extends ComponentProps<'input'> {
  defaultChecked?: boolean;
  label?: string;
  isMultiselect?: boolean;
  isError?: boolean;
}

/**
 * Checkbox component for user input.
 *
 * Supports controlled and uncontrolled checked state, error styling, and multiselect mode.
 *
 * @param props.defaultChecked - Initial checked state.
 * @param props.label - Accessibility label.
 * @param props.isMultiselect - Multiselect styling.
 * @param props.isError - Error styling.
 * @param props - Additional input props.
 *
 * @example
 * <Checkbox label="Accept terms" defaultChecked={true} isError={false} />
 */
export const Checkbox = ({
  defaultChecked = false,
  label = 'checkbox',
  isMultiselect = false,
  isError,
  ...props
}: CheckboxProps) => {
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
  const wrapperClass = `${styles.checkbox} ${isMultiselect ? styles.multiselect : ''} ${isError ? styles.error : ''}`;

  return (
    <input
      type="checkbox"
      className={wrapperClass}
      {...props}
      checked={!isError && checked}
      onChange={handleChange}
      aria-label={label}
    />
  );
};
