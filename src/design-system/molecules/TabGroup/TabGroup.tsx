'use client';
import React, { ReactNode } from 'react';

// TODO: Move Tab to design-system atoms
import { Tab, TabProps } from '@/design-system/atoms/Tab';

import styles from './TabGroup.module.css';

/**
 * Props for the TabGroup component.
 *
 * @property tabs - Array of tab definitions with value, id, optional disabled and icon.
 * @property children - Content to render for each tab (should match tabs order).
 * @property isEditable - If true, disables tab rendering (content only).
 * @property selectedTab - Currently selected tab id.
 * @property setSelectedTab - Callback to set selected tab id.
 */
interface TabGroupProps {
  tabs: Array<{
    value: string | React.ReactNode | ((props: TabProps) => React.ReactNode);
    id: string;
    disabled?: boolean;
    icon?: React.ReactNode;
  }>;
  children: ReactNode | ReactNode[];
  isEditable?: boolean;
  selectedTab?: string | null;
  setSelectedTab?: (value: string) => void;
}

/**
 * TabGroup component for rendering a group of tabs and their associated content.
 *
 * Handles tab selection, accessibility, and supports custom tab rendering.
 *
 * @param props TabGroupProps
 * @returns React component
 */
export const TabGroup = ({
  tabs,
  children,
  isEditable,
  selectedTab,
  setSelectedTab,
}: TabGroupProps) => {
  const handleTabSelection = (id: string, disabled?: boolean) => {
    if (!disabled) {
      setSelectedTab && setSelectedTab(id);
    }
  };

  const selectedIndex = tabs.findIndex((tab) => tab.id === selectedTab);
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={styles.tabgroup}>
      {!isEditable && (
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, index) => {
            const isSelected = selectedTab === tab.id;
            const value =
              typeof tab.value === 'function'
                ? tab.value({ id: tab.id, selected: isSelected, disabled: tab.disabled })
                : tab.value;

            return (
              <Tab
                key={tab.id}
                id={tab.id + '-' + index}
                icon={tab.icon}
                disabled={tab.disabled}
                selected={isSelected}
                onClick={() => handleTabSelection(tab.id, tab.disabled)}
                tabIndex={isSelected ? 0 : -1}
              >
                {value}
              </Tab>
            );
          })}
        </div>
      )}
      <div className={styles.content} role="tabpanel">
        {childrenArray[selectedIndex]}
      </div>
    </div>
  );
};
