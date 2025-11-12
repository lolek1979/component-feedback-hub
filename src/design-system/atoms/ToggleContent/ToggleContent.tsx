'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

import IArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';
import IArrowUp from '@/core/assets/icons/keyboard_arrow_up.svg';
import { ChipColors } from '@/design-system/molecules/Chip';

import { Badge } from '../Badge';
import { Text } from '../Text';
import styles from './ToggleContent.module.css';

/**
 * Supported badge status values for {@link ToggleContent}.
 *
 * - `'finished'`: Step is finished
 * - `'opened'`: Step is opened
 * - `'pending'`: Step is pending
 * - `'error'`: Step has an error
 * - `undefined`: No status
 */
export type BadgeStatus = 'finished' | 'opened' | 'pending' | 'error' | undefined;

/**
 * Props for the {@link ToggleContent} component.
 *
 * @property title - The header title text.
 * @property collapsed - Initial collapsed state.
 * @property content - Content to display inside the body (alternative to children).
 * @property children - React children to display inside the body.
 * @property borderColor - Custom border color for the container.
 * @property width - Custom width for the container.
 * @property headerColor - Custom background color for the header.
 * @property isActiveStep - Highlights the header as active.
 * @property isDisabled - Disables toggling and interaction.
 * @property onToggle - Callback when toggled.
 * @property badgeStatus - Status for the badge indicator.
 * @property badgeLabel - Label for the badge indicator.
 */
type ToggleContentProps = {
  title: string;
  collapsed?: boolean;
  content?: ReactNode;
  children?: ReactNode;
  borderColor?: string;
  width?: string;
  headerColor?: string;
  isActiveStep?: boolean;
  isDisabled?: boolean;
  onToggle?: () => void;
  badgeStatus?: BadgeStatus;
  badgeLabel?: string;
};

/**
 * Returns the badge color for a given status.
 *
 * @param status - The badge status.
 * @returns The corresponding {@link ChipColors} value.
 */
const getBadgeInfo = (status: BadgeStatus): ChipColors => {
  switch (status) {
    case 'finished':
      return 'lightBlue';
    case 'opened':
      return 'lightGreen';
    case 'pending':
      return 'gray';
    case 'error':
      return 'lightRed';
    default:
      return 'gray';
  }
};

/**
 * ToggleContent component for displaying collapsible content sections with a header and optional status badge.
 *
 * Supports custom styling, accessibility, and toggling between collapsed and expanded states.
 *
 * @example
 * <ToggleContent
 *   title="Step 1"
 *   collapsed={false}
 *   badgeStatus="opened"
 *   badgeLabel="In Progress"
 * >
 *   <div>Step details...</div>
 * </ToggleContent>
 */
export const ToggleContent = ({
  title,
  collapsed = false,
  content,
  children,
  borderColor,
  width,
  headerColor,
  isActiveStep = false,
  isDisabled = false,
  onToggle,
  badgeStatus,
  badgeLabel,
}: ToggleContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const toggle = () => {
    if (!isDisabled) {
      setIsCollapsed(!isCollapsed);
      onToggle?.();
    }
  };

  const containerStyle: CSSProperties = {
    ...(borderColor && { borderColor }),
    ...(width && { width }),
  };

  const headerStyle: CSSProperties = {
    ...(headerColor && { background: headerColor }),
  };

  const titleStyle: CSSProperties = {
    fontWeight: isActiveStep ? 600 : 400,
  };

  return (
    <div className={styles.toggleContentWrapper}>
      <div
        className={`${styles.toggleContentContainer} ${isDisabled ? styles.disabled : ''}`}
        style={containerStyle}
      >
        <div
          className={`${styles.toggleHeader} ${isActiveStep ? styles.activeHeader : ''}`}
          onClick={toggle}
          style={headerStyle}
        >
          <div className={styles.toggleContentRow}>
            <div className={styles.toggleTitleContainer}>
              <span className={styles.toggleTitle} style={titleStyle}>
                {title}
              </span>
            </div>
            {badgeStatus && (
              <Badge
                aria-label={badgeLabel || `Status: ${badgeStatus}`}
                color={
                  badgeStatus === 'pending' || isDisabled ? 'disabled' : getBadgeInfo(badgeStatus)
                }
              >
                <Text variant="caption">{badgeLabel || badgeStatus}</Text>
              </Badge>
            )}
          </div>

          {!isDisabled && (
            <button
              className={styles.toggleButton}
              type="button"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <IArrowDown
                  id="icon-group-steps-collapsed"
                  width={26}
                  height={26}
                  aria-hidden="true"
                />
              ) : (
                <IArrowUp
                  id="icon-group-steps-expanded"
                  width={26}
                  height={26}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </div>

        <div
          className={`${styles.toggleBody} ${isCollapsed ? styles.collapsed : styles.expanded}`}
          ref={contentRef}
          aria-hidden={isCollapsed}
        >
          {content ? content : children}
        </div>
      </div>
    </div>
  );
};
