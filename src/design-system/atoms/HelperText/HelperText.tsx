import clsx from 'clsx';

import ISuccess from '@/core/assets/icons/icon-success.svg';
import IError from '@/core/assets/icons/icon-warning.svg';
import IWarning from '@/core/assets/icons/icon-warning.svg';
import { Text } from '@/design-system/atoms';

import styles from './HelperText.module.css';

/**
 * Props for the {@link HelperText} component.
 *
 * @property variant - Visual style of the helper text ('error', 'warning', 'success', 'default').
 * @property text - The helper text content to display.
 * @property className - Optional additional CSS class names.
 * @property id - Unique identifier for the helper text.
 */
interface HelperTextProps {
  variant?: 'error' | 'warning' | 'success' | 'default';
  text: string | React.ReactNode;
  className?: string;
  id: string;
}

/**
 * HelperText component for displaying contextual messages below form fields.
 *
 * Supports error, warning, success, and default variants, with corresponding icons and styles.
 *
 * @example
 * <HelperText variant="error" text="This field is required." id="username-helper" />
 */
export const HelperText = ({ variant = 'default', text, className = '', id }: HelperTextProps) => {
  const Icon = () => {
    switch (variant) {
      case 'error':
        return <IError id={`icon-${id}-helperText-error`} />;
      case 'warning':
        return <IWarning id={`icon-${id}-helperText-warning`} />;
      case 'success':
        return <ISuccess id={`icon-${id}-helperText-success`} />;
      default:
        return;
    }
  };

  const helperTextClassNames = clsx(styles.helperText, styles[variant], className);

  return (
    <div id={id} className={helperTextClassNames} role="alert" aria-live="assertive">
      {variant !== 'default' && (
        <div className={clsx(styles.iconWrapper, styles[variant])}>
          <Icon />
        </div>
      )}
      <Text
        variant="caption"
        regular
        className={`${styles[variant]} ${styles.text}`}
        selectable={false}
      >
        {text}
      </Text>
    </div>
  );
};
