'use client';

import { ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { useFeedBackHub } from '@/core/providers/FeedBackHubProvider';
import { Text } from '@/design-system/atoms';

import styles from './Popover.module.css';

/**
 * Placement options for the Popover component.
 */
type PlacementType =
  | 'tooltip-bottom-end'
  | 'tooltip-bottom-start'
  | 'tooltip-bottom'
  | 'tooltip-left'
  | 'tooltip-right'
  | 'tooltip-top';

/**
 * Props for the Popover component.
 *
 * @template T - Type of the item passed to the content renderer.
 * @property content - Function that returns the popover content, given an item of type T.
 * @property trigger - React node that triggers the popover.
 * @property title - Optional title for the popover.
 * @property placement - Placement of the popover relative to the trigger.
 * @property setIsVisible - Function to set popover visibility.
 * @property isVisible - Controls popover visibility.
 * @property id - Unique identifier for the popover.
 * @property isColumn - Whether to use column positioning.
 */
export interface PopoverProps<T> {
  content: (item: T) => React.ReactNode;
  trigger: ReactNode;
  title?: string;
  placement?: PlacementType;
  setIsVisible?: (isVisible: boolean) => void;
  isVisible?: boolean;
  id?: string;
  isColumn?: boolean;
}

/**
 * Popover component for displaying contextual content in a floating dialog.
 *
 * Handles positioning, accessibility, and closing on outside click or Escape key.
 *
 * @template T - Type of the item passed to the content renderer.
 * @param props PopoverProps<T>
 * @returns React component
 */

export const Popover = <T extends object>({
  content,
  trigger,
  title = '',
  isVisible = false,
  setIsVisible,
  placement = 'tooltip-bottom-start',
  id = Math.random().toString(36).substring(2, 8),
  isColumn = false,
}: PopoverProps<T>) => {
  const { isFeedBackHubOpen } = useFeedBackHub();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (!targetRef.current || !tooltipRef.current || !isVisible) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    switch (placement) {
      case 'tooltip-top':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'tooltip-bottom':
        top = targetRect.bottom + 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'tooltip-bottom-start':
        top = targetRect.top + 25;
        left = targetRect.right - tooltipRect.width * 1.3;
        break;
      case 'tooltip-bottom-end':
        top = targetRect.bottom + 10;
        left = targetRect.right - tooltipRect.width;
        break;
      case 'tooltip-left':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - 10;
        break;
      case 'tooltip-right':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right + 10;
        break;
      default:
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
    }

    const padding = 10;
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }

    if (top < padding) {
      top = targetRect.bottom + 10;
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.top = `${top + window.scrollY}px`;
      tooltipRef.current.style.left = `${left}px`;
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();

      const handleReposition = () => {
        requestAnimationFrame(updateTooltipPosition);
      };

      window.addEventListener('scroll', handleReposition);
      window.addEventListener('resize', handleReposition);

      return () => {
        window.removeEventListener('scroll', handleReposition);
        window.removeEventListener('resize', handleReposition);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, placement]);

  useEffect(() => {
    if (isVisible && !isFeedBackHubOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (!(event.target as HTMLElement).closest(`.${styles.popover}`)) {
          setIsVisible && setIsVisible(false);
        }
      };

      const handleEscPress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsVisible && setIsVisible(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscPress);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscPress);
      };
    }
  }, [isFeedBackHubOpen, isVisible, setIsVisible]);

  return (
    <div className={styles.popoverContainer} onClick={(e) => e.stopPropagation()}>
      <div ref={targetRef} aria-haspopup="dialog" aria-expanded={isVisible} role="button">
        {trigger}
      </div>
      {isVisible &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className={`primary-shadow ${styles.popover} ${styles[placement]} ${isColumn ? styles.columnPosition : ''}`}
            role="dialog"
            aria-live="polite"
            aria-labelledby={`title-${id}`}
          >
            <Text
              id={`title-${id}`}
              variant="subtitle"
              className={styles.popoverTitle}
              data-testid="title-id"
              selectable={false}
              ariaLabel={title}
            >
              {title}
            </Text>
            <div>{content({} as T)}</div>
          </div>,
          document.body,
        )}
    </div>
  );
};
