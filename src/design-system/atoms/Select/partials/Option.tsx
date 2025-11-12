import clsx from 'clsx';

import { Text } from '../../Text';

/**
 * Props for the {@link Option} component.
 *
 * @property children - The content to display inside the option.
 * @property key - Optional unique key for the option.
 * @property value - The value associated with the option.
 * @property className - Additional CSS class names for the option.
 * @property onClick - Callback when the option is clicked.
 * @property optionClassName - Additional CSS class names for the option element.
 * @property isSelected - Whether the option is currently selected.
 * @property id - Unique identifier for the option.
 * @property disabled - Whether the option is disabled.
 */
export interface OptionProps {
  children: React.ReactNode;
  key?: string;
  value: string;
  className?: string;
  onClick?: () => void;
  optionClassName?: string;
  isSelected?: boolean;
  id?: string;
  disabled?: boolean;
}

/**
 * Option component for rendering a selectable item in a dropdown or list.
 *
 * Supports selection state, custom styling, accessibility attributes, and disabled state.
 *
 * @example
 * <Option value="cz" isSelected={true} onClick={() => select('cz')}>
 *   Czech Republic
 * </Option>
 */
export const Option = ({
  children,
  key,
  className = '',
  optionClassName = '',
  onClick,
  isSelected = false,
  id,
  disabled = false,
}: OptionProps) => {
  const classNames = clsx(className, optionClassName);

  return (
    <li
      key={key}
      className={classNames}
      tabIndex={-1}
      role="option"
      aria-selected={isSelected ? 'true' : 'false'}
      onClick={!disabled ? onClick : undefined}
      id={id}
    >
      <Text variant="subtitle" regular={!isSelected}>
        {children}
      </Text>
    </li>
  );
};
