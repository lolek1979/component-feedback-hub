import React from 'react';

import { Text } from '../Text';
import styles from './Card.module.css';

/**
 * Props for the {@link Card} component.
 *
 * @property title - The card title text.
 * @property icon - The icon to display in the card.
 * @property onClick - Function called when the card is clicked.
 * @property className - Optional additional CSS class names.
 * @property hoverTitle - Optional tooltip text shown on hover.
 * @property disabled - Whether the card is disabled.
 * @property id - Unique identifier for the card.
 */
interface CardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  hoverTitle?: string;
  disabled?: boolean;
  id: string;
}

/**
 * Card component for displaying an icon and title in a clickable container.
 *
 * @example
 * <Card
 *   id="dashboard-card"
 *   title="Dashboard"
 *   icon={<DashboardIcon />}
 *   onClick={() => navigate('/dashboard')}
 *   hoverTitle="Go to dashboard"
 * />
 */
export const Card = ({
  title,
  icon,
  onClick,
  hoverTitle,
  className = '',
  id,
  disabled = false,
}: CardProps) => {
  return (
    <div
      id={id}
      className={`${styles.card} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={onClick}
      role="button"
      title={hoverTitle}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <span className={`${styles.iconWrapper} ${disabled ? styles.disabledIcon : ''}`}>{icon}</span>
      <Text variant="subtitle" selectable={false} className={disabled ? styles.disabledText : ''}>
        {title}
      </Text>
    </div>
  );
};
