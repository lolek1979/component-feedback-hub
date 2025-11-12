import React, { ComponentProps } from 'react';

import { Text } from '../Text';
import styles from './Tab.module.css';

/**
 * Props for the {@link Tab} component.
 *
 * @property onChange - Callback when the tab is selected.
 * @property selected - Whether the tab is currently selected.
 * @property id - Unique identifier for the tab.
 * @property icon - Optional icon to display in the tab.
 * @property iconAlign - Position of the icon ('right' or 'left'). Default is 'left'.
 * @property children - The content to display inside the tab.
 */
export interface TabProps extends ComponentProps<'button'> {
  onChange?: () => void;
  selected?: boolean;
  id: string;
  icon?: React.ReactNode;
  iconAlign?: 'right' | 'left';
}

/**
 * Tab component for navigation or switching between views.
 *
 * Supports selection state, icon display, accessibility attributes, and custom styling.
 * @example
 * <Tab id="tab-1" selected={true} icon={<HomeIcon />} onChange={() => setTab(1)}>
 *   Home
 * </Tab>
 */
export const Tab = ({
  selected = false,
  onChange,
  id,
  icon,
  iconAlign = 'left',
  ...props
}: TabProps) => {
  const iconClass = [icon ? (iconAlign === 'right' ? styles.iconRight : styles.iconLeft) : ''];

  return (
    <button
      id={id}
      role="tab"
      aria-selected={selected}
      className={`${styles.tablink} ${selected ? styles.selected : ''} ${iconClass} `}
      onClick={onChange}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <Text variant="subtitle" regular={!selected}>
        {props.children}
      </Text>
    </button>
  );
};
