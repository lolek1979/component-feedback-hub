import { useTranslations } from 'next-intl';

import AddAboveIcon from '@/core/assets/icons/add_row_above.svg';
import AddBelowIcon from '@/core/assets/icons/add_row_below.svg';
import DeleteIcon from '@/core/assets/icons/delete_forever.svg';
import { Button, Text } from '@/design-system/atoms';

import styles from './RowOptions.module.css';

/**
 * Props for the RowOptions component.
 *
 * @property index - Index of the row for which options are displayed.
 * @property onRowAction - Callback when a row action is triggered. Receives action type and row index.
 */
interface RowOptionsProps {
  index: number;
  onRowAction: (action: string, rowIndex: number) => void;
}

/**
 * Props for the RowOptionButton component.
 *
 * @property onClick - Callback when the button is clicked.
 * @property children - Content to display inside the button.
 * @property data-testid - Optional test identifier.
 * @property ariaLabel - Optional accessibility label.
 * @property id - Unique identifier for the button.
 * @property className - Optional additional CSS class.
 */
interface RowOptionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  'data-testid'?: string;
  ariaLabel?: string;
  id: string;
  className?: string;
}

/**
 * RowOptionButton renders a styled button for a row action.
 *
 * @param props RowOptionButtonProps
 * @returns React component
 */
const RowOptionButton = ({
  onClick,
  children,
  'data-testid': dataTestId,
  ariaLabel,
  id,
  className,
}: RowOptionButtonProps) => (
  <Button
    id={id}
    onClick={onClick}
    className={`${styles.rowOptionsListItem} ${className ?? ''}`}
    variant="unstyled"
    data-testid={dataTestId}
    ariaLabel={ariaLabel}
    role="button"
  >
    <div className={styles.rowOptionsContent}>{children}</div>
  </Button>
);

/**
 * RowOptions displays action buttons for adding or deleting rows.
 *
 * Renders buttons for "add below", "add above", and "delete" actions.
 *
 * @param props RowOptionsProps
 * @returns React component
 */
export const RowOptions = ({ index, onRowAction }: RowOptionsProps) => {
  const t = useTranslations('RowOptions');

  return (
    <div
      className={styles.rowOptionsList}
      data-testid="row-options-test"
      role="group"
      aria-label="Row options"
    >
      <RowOptionButton
        onClick={() => onRowAction('below', index)}
        data-testid="add-below-button"
        ariaLabel={t('addRowBelow')}
        id={'button-row-add-below-' + index}
      >
        <AddBelowIcon id={'icon-row-add-below-' + index} width={24} height={24} />
        <Text variant="subtitle" regular className={styles.rowOptionsText}>
          {t('addRowBelow')}
        </Text>
      </RowOptionButton>
      <RowOptionButton
        onClick={() => onRowAction('above', index)}
        data-testid="add-above-button"
        ariaLabel={t('addRowAbove')}
        id={'button-row-add-above-' + index}
      >
        <AddAboveIcon id={'icon-row-add-above-' + index} width={24} height={24} />
        <Text variant="subtitle" regular className={styles.rowOptionsText}>
          {t('addRowAbove')}
        </Text>
      </RowOptionButton>
      <RowOptionButton
        onClick={() => onRowAction('delete', index)}
        data-testid="delete-button"
        ariaLabel={t('deleteRow')}
        id={'button-row-delete-' + index}
        className={styles.deleteItem}
      >
        <DeleteIcon id={'icon-row-delete-' + index} width={24} height={24} />
        <Text variant="subtitle" regular className={styles.rowOptionsText}>
          {t('deleteRow')}
        </Text>
      </RowOptionButton>
    </div>
  );
};
