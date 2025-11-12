import React from 'react';

import { Button } from '@/design-system/atoms';

import { Typography } from '../Typography';
import styles from './InlineMessage.module.css';

/**
 * Props for the InlineMessage component.
 *
 * @property icon - Optional icon to display.
 * @property message - Optional message text.
 * @property children - Optional custom content to display instead of message.
 * @property variant - Message style variant ('default', 'error', 'success', 'info', 'warning').
 * @property className - Optional additional CSS class.
 * @property id - Unique identifier for the message container.
 * @property buttonText - Optional text for an action button.
 * @property onClick - Optional callback for the action button.
 */
interface InlineMessageProps {
  icon?: React.ReactNode;
  message?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'error' | 'success' | 'info' | 'warning';
  centeredText?: boolean;
  className?: string;
  id: string;
  buttonText?: string;
  onClick?: () => void;
}

/**
 * InlineMessage displays a styled message with optional icon and action button.
 *
 * @param props InlineMessageProps
 * @returns React component
 */
export const InlineMessage = ({
  icon,
  message,
  children,
  variant = 'default',
  centeredText = false,
  className = '',
  id,
  buttonText,
  onClick,
}: InlineMessageProps) => {
  const variantClasses = {
    default: styles.default,
    error: styles.error,
    success: styles.success,
    info: styles.info,
    warning: styles.warning,
  };

  return (
    <div
      id={id}
      className={`${styles.container} ${variantClasses[variant]} ${centeredText ? styles.centered : ''} ${className}`}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children || <Typography variant="Subtitle/Default/Bold">{message}</Typography>}
      {onClick && buttonText && (
        <Button variant="oncolor" onClick={() => onClick()} id={id + '-button'}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};
