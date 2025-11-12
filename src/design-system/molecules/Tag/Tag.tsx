import React from 'react';

import AlarmIcon from '@/core/assets/icons/alarm.svg';
import DeniedIcon from '@/core/assets/icons/block.svg';
import DraftIcon from '@/core/assets/icons/icon-draft.svg';
import SuccessIcon from '@/core/assets/icons/icon-success.svg';
import StopCircleIcon from '@/core/assets/icons/stop_circle.svg';
import { Text } from '@/design-system/atoms';

import styles from './Tag.module.css';

/**
 * Tag variant types for status indication.
 */
export type TagVariant =
  | 'active'
  | 'concept'
  | 'planned'
  | 'expired'
  | 'denied'
  | 'waitingforapproval'
  | string;

/**
 * Configuration for each tag variant.
 *
 * @property Icon - Optional SVG icon component for the tag.
 * @property ariaLabel - Optional accessibility label for the tag.
 */
interface TagConfig {
  Icon?: React.FC<{ id: string } & React.SVGProps<SVGSVGElement>>;
  ariaLabel?: string;
}

const TAG_VARIANT_MAP: Record<string, string> = {
  Aktivní: 'active',
  Koncept: 'concept',
  Naplánovaný: 'planned',
  Expirovaný: 'expired',
  WaitingForApproval: 'waitingforapproval',
};

const TAG_VARIANTS: Record<string, TagConfig> = {
  active: {
    Icon: ({ id }) => <SuccessIcon id={id} width={20} height={20} data-testid="tag-svg" />,
    ariaLabel: 'Active',
  },
  concept: {
    Icon: ({ id }) => <DraftIcon id={id} width={20} height={20} data-testid="tag-svg" />,
    ariaLabel: 'Concept',
  },
  planned: {
    Icon: ({ id }) => <AlarmIcon id={id} width={20} height={20} data-testid="tag-svg" />,
    ariaLabel: 'Planned',
  },
  waitingforapproval: {
    Icon: ({ id }) => <AlarmIcon id={id} width={20} height={20} data-testid="tag-svg" />,
    ariaLabel: 'WaitingForApproval',
  },
  denied: {
    Icon: ({ id }) => (
      <DeniedIcon
        id={id}
        width={20}
        height={20}
        data-testid="tag-svg-denied"
        className="icon_red-500"
      />
    ),
    ariaLabel: 'Denied',
  },
  expired: {
    Icon: ({ id }) => (
      <StopCircleIcon
        id={id}
        width={20}
        height={20}
        data-testid="tag-svg"
        className="icon_alpha-600"
      />
    ),
    ariaLabel: 'Expired',
  },
};

/**
 * Props for the Tag component.
 *
 * @property variant - Tag variant for status indication.
 * @property children - Content to display inside the tag.
 * @property index - Optional index for the tag.
 * @property id - Unique identifier for the tag.
 * @property className - Optional additional CSS class.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: TagVariant;
  children: React.ReactNode;
  index?: number;
  id: string;
}

/**
 * Tag component for displaying status or state with optional icon and label.
 *
 * Renders a styled tag with variant-based icon, color, and accessibility label.
 *
 * @param props TagProps
 * @returns React component
 */
export const Tag = React.memo(({ variant, className, children, index, id, ...props }: TagProps) => {
  const normalizedVariant = TAG_VARIANT_MAP[variant] || variant;
  const config = TAG_VARIANTS[normalizedVariant] || {};
  const Icon = config.Icon;

  return (
    <span
      className={`${styles[normalizedVariant]} ${styles.tag} ${className || ''}`}
      role="status"
      aria-label={config.ariaLabel}
      {...props}
    >
      {Icon && (
        <span className={styles.icon} aria-hidden="true" data-testid="tag-icon">
          <Icon id={id} />
        </span>
      )}
      <Text variant="caption" className={styles.content}>
        {children}
      </Text>
    </span>
  );
});

Tag.displayName = 'Tag';
