import { memo, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './FormActionCard.module.css';

import { sanitizeId } from '@/core';
import { Button, Typography } from '@/design-system';

/**
 * Visual style variant for the FormActionCard component.
 *
 * @property primary - Primary appearance with darker background and more prominent content
 * @property secondary - Secondary appearance with lighter background and more subtle content
 */
export type FormActionCardVariant = 'primary' | 'secondary';

/**
 * Props for the FormActionCard component.
 */
export interface FormActionCardProps {
  /**
   * Visual style variant of the card.
   * @default 'primary'
   */
  variant?: FormActionCardVariant;

  /**
   * Main heading of the card.
   */
  title: string;

  /**
   * Text displayed on the action button.
   */
  buttonLabel: string;

  /**
   * Callback function invoked when the button is clicked.
   */
  onClick: () => void;

  /**
   * Optional description or additional information displayed below the heading.
   * Can contain text or any React element.
   */
  description?: ReactNode;

  /**
   * Custom ID for the button. If not specified, it will be auto-generated from the title.
   */
  buttonId?: string;

  /**
   * Determines whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Determines whether the button is in a loading state.
   * @default false
   */
  loading?: boolean;

  /**
   * Optional CSS class for customizing styles.
   */
  className?: string;
}

/**
 * FormActionCard - A card component with a form action.
 *
 * This component displays a card containing a heading, optional description, and an action button.
 * It supports two visual variants (primary/secondary) to distinguish different levels of importance.
 * Cards with the primary variant have a more prominent appearance, while the secondary variant is more subtle.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with primary variant
 * <FormActionCard
 *   title="Create New Record"
 *   description="Create a new record using the form"
 *   buttonLabel="Create Record"
 *   onClick={handleCreate}
 * />
 *
 * // Secondary variant with loading state
 * <FormActionCard
 *   variant="secondary"
 *   title="Export Data"
 *   description="Download data in PDF format"
 *   buttonLabel="Download"
 *   onClick={handleExport}
 *   loading={isExporting}
 * />
 *
 * // With ReactNode description
 * <FormActionCard
 *   title="Important Notice"
 *   description={<span>For more information, contact the <strong>administrator</strong></span>}
 *   buttonLabel="Contact"
 *   onClick={handleContact}
 *   disabled={!canContact}
 * />
 * ```
 *
 * @param {FormActionCardProps} props - Component props
 * @returns {JSX.Element} Rendered FormActionCard component
 */
export const FormActionCard = memo(
  ({
    variant = 'primary',
    title,
    description,
    buttonLabel,
    disabled = false,
    loading = false,
    buttonId,
    onClick,
    className,
  }: FormActionCardProps) => {
    return (
      <section
        aria-labelledby={`title-${sanitizeId(title)}-form-action-card`}
        className={clsx(
          variant === 'primary' ? styles.primaryContainer : styles.secondaryContainer,
          className,
        )}
      >
        <Typography id={`title-${sanitizeId(title)}-form-action-card`} variant="Headline/Bold">
          {title}
        </Typography>
        {description && <Typography variant="Body/Regular">{description}</Typography>}
        <Button
          variant="secondary"
          size="medium"
          disabled={disabled}
          onClick={onClick}
          id={buttonId || `button-${sanitizeId(title)}-form-action-card`}
          loading={loading}
        >
          {buttonLabel}
        </Button>
      </section>
    );
  },
);
