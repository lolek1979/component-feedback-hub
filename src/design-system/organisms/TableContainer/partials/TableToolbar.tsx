import { Text } from '@/design-system/atoms';

import styles from './TableToolbar.module.css';

/**
 * Props for the TableToolbar component.
 *
 * @property title - Optional title to display in the toolbar.
 * @property description - Optional description text below the title.
 * @property buttons - Optional array of React nodes for action buttons.
 */
interface TableToolbarProps {
  title?: string;
  description?: string;
  buttons?: React.ReactNode[];
}

/**
 * TableToolbar component for displaying a table title, description, and action buttons.
 *
 * Renders a styled toolbar with configurable title, description, and button area.
 *
 * @param props TableToolbarProps
 * @returns React component
 */
export const TableToolbar = ({ title, description, buttons }: TableToolbarProps) => {
  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.textContainer}>
        <Text variant="h3" className={styles.title}>
          {title}
        </Text>
        <Text variant="caption" className={styles.description}>
          {description}
        </Text>
      </div>
      <div className={styles.buttonsContainer}>
        {buttons?.map((button, index) => <div key={index}>{button}</div>)}
      </div>
    </div>
  );
};
