'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { Text } from '@/design-system/atoms/Text';

import style from './Tooltip.module.css';

/**
 * Props for the {@link Tooltip} component.
 *
 * @property content - The tooltip content to display (string or React node).
 * @property placement - Tooltip placement relative to the target ('tooltipBottom', 'tooltipTop', etc.).
 * @property children - The element that triggers the tooltip on hover/focus.
 * @property variant - Visual style of the tooltip ('default' or 'inverse').
 * @property className - Additional CSS class names for the trigger element.
 * @property disabled - Whether the tooltip is disabled.
 * @property id - Unique identifier for the tooltip.
 */
export interface TooltipProps {
  content: string | React.ReactNode;
  placement?:
    | 'tooltipBottom'
    | 'tooltipBottomStart'
    | 'tooltipBottomEnd'
    | 'tooltipLeft'
    | 'tooltipRight'
    | 'tooltipTop'
    | 'tooltipTopStart'
    | 'tooltipTopEnd';
  children: React.ReactNode;
  variant?: 'default' | 'inverse';
  className?: string;
  disabled?: boolean;
  id: string;
}

/**
 * Tooltip component for displaying contextual information on hover or focus.
 *
 * Renders a floating tooltip near the target element, with customizable placement and style.
 * Uses a portal to render the tooltip outside the DOM hierarchy for proper positioning.
 *
 * @example
 * <Tooltip content="More info" placement="tooltipBottom" id="info-tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = ({
  content,
  placement = 'tooltipTop',
  children,
  className,
  variant = 'default',
  disabled = false,
  id,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Updates the tooltip position based on the target and placement.
   * @internal
   */
  const updateTooltipPosition = () => {
    if (!targetRef.current || !tooltipRef.current || !isVisible) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    switch (placement) {
      case 'tooltipTop':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'tooltipTopStart':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left;
        break;
      case 'tooltipTopEnd':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.right - tooltipRect.width;
        break;
      case 'tooltipBottom':
        top = targetRect.bottom + 10;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'tooltipBottomStart':
        top = targetRect.bottom + 10;
        left = targetRect.left;
        break;
      case 'tooltipBottomEnd':
        top = targetRect.bottom + 10;
        left = targetRect.right - tooltipRect.width;
        break;
      case 'tooltipLeft':
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - 10;
        break;
      case 'tooltipRight':
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

  const handleMouseOver = () => {
    setIsVisible(!disabled);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && tooltipRef.current?.contains(relatedTarget)) {
      return;
    }
    setIsVisible(false);
  };

  if (typeof window === 'undefined') return null;

  let tooltipContent: ReactNode = content;
  if (typeof content === 'string') {
    tooltipContent = (
      <Text variant="caption" regular>
        {content}
      </Text>
    );
  }

  return (
    <>
      <span
        ref={targetRef}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleMouseOver}
        onBlur={() => setIsVisible(false)}
        className={className}
        id={id}
      >
        {children}
      </span>
      {isVisible &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className={`primary-shadow ${style.tooltip} ${style[variant]}  ${style[placement]}`}
            style={{
              position: 'absolute',
              zIndex: 1000,
            }}
            onMouseOver={() => setIsVisible(!disabled)}
            onMouseOut={handleMouseOut}
            role="tooltip"
            aria-hidden={!isVisible}
            id={`${id}-content`}
          >
            {tooltipContent}
          </div>,
          document.body,
        )}
    </>
  );
};
