import { useTranslations } from 'next-intl';

import { IAddColumnLeft, IAddColumnRight, IDeleteForever } from '@/core/assets/icons';
import { ListItem } from '@/design-system/molecules/ListItem';

import { ColumnType } from '../Table';
import styles from './ColumnOptions.module.css';

/**
 * Props for the {@link ColumnOptions} component.
 *
 * @property index - Index of the column for which options are displayed.
 * @property onColumnAction - Callback for column actions ('right', 'left', 'delete').
 * @property onTypeChange - Callback for changing the column type.
 */
interface ColumnOptionsProps {
  index: number;
  onColumnAction: (action: string, columnIndex: number) => void;
  onTypeChange: (type: ColumnType) => void;
}

/**
 * ColumnOptions component for displaying actions for a table column.
 *
 * Provides options to add a column to the left or right, or delete the column.
 * Calls the provided callbacks for each action.
 *
 * @example
 * <ColumnOptions
 *   index={2}
 *   onColumnAction={(action, idx) => handleColumnAction(action, idx)}
 *   onTypeChange={(type) => setColumnType(type)}
 * />
 */
export const ColumnOptions = ({ index, onColumnAction, onTypeChange }: ColumnOptionsProps) => {
  const t = useTranslations('ColumnOptions');

  return (
    <div className={styles.columnOptionsList} data-testid="row-options-test">
      <ListItem
        leftIcon={<IAddColumnRight />}
        onClick={() => {
          onColumnAction('right', index);
          onTypeChange('String');
        }}
        aria-label={t('addColumnRight')}
        role="button"
      >
        {t('addColumnRight')}
      </ListItem>

      <ListItem
        leftIcon={<IAddColumnLeft />}
        onClick={() => {
          onColumnAction('left', index);
          onTypeChange('String');
        }}
        aria-label={t('addColumnLeft')}
        role="button"
      >
        {t('addColumnLeft')}
      </ListItem>

      <div className={styles.divider} />

      <ListItem
        leftIcon={<IDeleteForever />}
        onClick={() => {
          onColumnAction('delete', index);
          onTypeChange('String');
        }}
        aria-label={t('deleteColumn')}
        role="button"
      >
        {t('deleteColumn')}
      </ListItem>
    </div>
  );
};
