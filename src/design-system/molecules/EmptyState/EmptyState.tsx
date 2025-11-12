import { useTranslations } from 'next-intl';
import { parseAsBoolean, useQueryState } from 'nuqs';

import IBug from '@/core/assets/icons/bug_report.svg';

import styles from './EmptyState.module.css';

import { Button, Text } from '@/design-system';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bugReport?: boolean;
  btnPrimText: string;
  btnScndText?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

/**
 * Renders an empty state component with customizable title, description, icon, and action buttons.
 *
 * @remarks
 * This component is typically used to display a placeholder or informative message when there is no data to show.
 * It supports primary and secondary actions, as well as an optional bug report button.
 *
 * @param props - The properties for the EmptyState component.
 * @param props.title - The main title displayed in the empty state.
 * @param props.description - A subtitle or description providing more context.
 * @param props.icon - An icon element to visually represent the empty state.
 * @param props.btnPrimText - Text for the primary action button.
 * @param props.bugReport - If true, displays a bug report button (default: false).
 * @param props.btnScndText - Text for the secondary action button (optional).
 * @param props.onPrimaryAction - Callback function invoked when the primary button is clicked.
 * @param props.onSecondaryAction - Callback function invoked when the secondary button is clicked (optional).
 *
 * @returns The rendered EmptyState React component.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No Data Found"
 *   description="Try adjusting your filters or add new items."
 *   icon={<SomeIcon />}
 *   btnPrimText="Add Item"
 *   onPrimaryAction={handleAddItem}
 *   bugReport={true}
 * />
 * ```
 */
export const EmptyState = ({
  title,
  description,
  icon,
  btnPrimText,
  bugReport = false,
  btnScndText,
  onPrimaryAction,
  onSecondaryAction,
}: EmptyStateProps) => {
  const [, setIsBugReportModalOpen] = useQueryState('bugReport', parseAsBoolean.withDefault(false));
  const t = useTranslations('EmptyState');

  const handleBugReportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBugReportModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>

      <div className={styles.textGroup}>
        <Text variant="h4">{title}</Text>
        <Text variant="subtitle" regular>
          {description}
        </Text>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onPrimaryAction} id="button-empty-state-primary">
          {btnPrimText}
        </Button>

        {btnScndText && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="secondary" id="button-empty-state-secondary">
            {btnScndText}
          </Button>
        )}

        {bugReport && (
          <Button
            variant="secondary"
            onClick={handleBugReportClick}
            icon={<IBug width={24} height={24} id="icon-empty-state-bug-report" />}
            id="button-empty-state-bug-report"
          >
            {t('Bugbtn')}
          </Button>
        )}
      </div>
    </div>
  );
};
