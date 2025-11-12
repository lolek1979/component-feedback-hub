'use client';
import React, { useCallback, useRef } from 'react';

import IActive from '@/core/assets/icons/icon_check_active.svg';
import ISuccess from '@/core/assets/icons/icon_check_done.svg';
import INext from '@/core/assets/icons/icon_check_next.svg';
import IPrevious from '@/core/assets/icons/icon_check_previous.svg';
import { Badge, Divider } from '@/design-system/atoms';
import { BadgeStatus } from '@/design-system/atoms/ToggleContent';

import styles from './StatusTrack.module.css';

export interface StatusItem {
  label: string;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
  badgeContent?: React.ReactNode;
  onClick?: () => void;
  isInCompletedGroup?: boolean;
  groupBadgeStatus?: BadgeStatus;
}

interface StatusTrackProps {
  items: StatusItem[];
  onItemClick?: (index: number) => void;
}

export const StatusTrack = ({ items, onItemClick }: StatusTrackProps) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleItemClick = useCallback(
    (index: number, disabled: boolean) => {
      if (!disabled && onItemClick) {
        onItemClick(index);
      }
    },
    [onItemClick],
  );

  return (
    <div className={styles.statusTrackWrapper}>
      <div className={styles.statusTrack} role="list" aria-label="Status track">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={index}
              className={styles.statusItemContainer}
              role="listitem"
              aria-current={item.active ? 'step' : undefined}
              ref={(el) => {
                containerRefs.current[index] = el;
              }}
            >
              <div
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`${styles.statusItem} ${item.active ? styles.active : ''} ${
                  item.completed ? styles.completed : ''
                } ${item.disabled ? styles.disabled : ''}`}
                onClick={() => handleItemClick(index, !!item.disabled)}
              >
                <div
                  className={styles.statusIconContainer}
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                >
                  {item.active ? (
                    <div className={styles.activeIconWrapper}>
                      <div className={styles.pulseEffect}></div>
                      <IActive id={'icon-status-track-active-' + index} width={17} height={17} />
                    </div>
                  ) : item.completed &&
                    item.isInCompletedGroup &&
                    item.groupBadgeStatus === 'finished' ? (
                    <IPrevious id={'icon-status-track-pervious-' + index} width={17} height={17} />
                  ) : item.completed ? (
                    <ISuccess id={'icon-status-track-success-' + index} width={17} height={17} />
                  ) : (
                    <INext id={'icon-status-track-next-' + index} width={17} height={17} />
                  )}
                </div>

                <div className={styles.statusContent}>
                  <div className={styles.statusLabel}>{item.label}</div>
                  {item.badgeContent && <Badge size="small">{item.badgeContent}</Badge>}
                </div>
              </div>

              {!isLast && items.length > 1 && (
                <div className={styles.connectorWrapper}>
                  <Divider
                    id={`connector-${index}`}
                    orientation="vertical"
                    className={styles.connectorDivider}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
