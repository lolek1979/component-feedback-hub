import React from 'react';

import { TabGroup } from '@/design-system/molecules';

import { TableToolbar } from './partials';
import styles from './TableContainer.module.css';

/**
 * Props for the TableContainer component.
 *
 * @property title - Optional title for the table container.
 * @property description - Optional description text below the title.
 * @property tabs - Array of tab definitions for TabGroup.
 * @property buttons - Optional array of React nodes for action buttons.
 * @property children - Array of child components (usually tables).
 * @property toolbar - Whether to display the TableToolbar.
 * @property selectItems - Array of selectable row count options.
 * @property onSelectChange - Callback when row count selection changes.
 * @property selectedTab - Currently selected tab id.
 * @property setSelectedTab - Callback to set selected tab id.
 */
interface TableContainerProps {
  title?: string;
  description?: string;
  tabs?: Array<{ value: string; id: string; disabled?: boolean }>;
  buttons?: React.ReactNode[];
  children: React.ReactNode[];
  toolbar?: boolean;
  selectItems: Array<{ label: string; value: string }>;
  onSelectChange: (value: string) => void;
  selectedTab?: string | null;
  setSelectedTab?: (value: string) => void;
}

/**
 * Props for child table components used in TableContainer.
 *
 * @property selectItems - Array of selectable row count options.
 * @property onSelectChange - Callback when row count selection changes.
 */
interface TableChildProps {
  selectItems?: Array<{ label: string; value: string }>;
  onSelectChange?: (value: string) => void;
}

/**
 * Checks if the child is a table component that accepts selectItems and onSelectChange props.
 *
 * @param child - React node to check.
 * @returns True if child is a valid table component.
 */
const isTableChild = (child: React.ReactNode): child is React.ReactElement<TableChildProps> => {
  if (!React.isValidElement(child)) return false;
  if (typeof child.type !== 'function') return false;
  if (!child.props || typeof child.props !== 'object') return false;

  return 'selectitems' in child.props;
};

/**
 * TableContainer component for wrapping tables with toolbar, tabs, and row count selection.
 *
 * Handles passing selectItems and onSelectChange to child table components.
 *
 * @param props TableContainerProps
 * @returns React component
 */
export const TableContainer = ({
  title,
  description,
  buttons,
  tabs,
  children,
  toolbar = true,
  selectItems,
  onSelectChange,
  selectedTab,
  setSelectedTab,
}: TableContainerProps) => {
  return (
    <div className={styles.tableContainer}>
      <div>
        {toolbar && <TableToolbar title={title} description={description} buttons={buttons} />}
      </div>
      <TabGroup tabs={tabs!} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
        {React.Children.map(children, (child) => {
          if (isTableChild(child)) {
            // Only pass `selectitems` and `onSelectChange` to components that accept them
            return React.cloneElement(child, {
              selectItems,
              onSelectChange,
            });
          }

          return child;
        })}
      </TabGroup>
    </div>
  );
};
