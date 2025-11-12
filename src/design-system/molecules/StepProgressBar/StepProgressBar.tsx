import React from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { IIconCheckActive, IIconCheckDone, IIconCheckNext } from '@/core/assets/icons';

import styles from './StepProgressBar.module.css';

import { Divider, Text } from '@/design-system';

/**
 * Status of a step in the StepProgressBar.
 */
export type StepStatus = 'passed' | 'active' | 'incomplete';

/**
 * A single step in the StepProgressBar.
 */
export interface Step {
  /** Optional label for the step. */
  label?: string;
  /** Status of the step. */
  status: StepStatus;
}

/**
 * Props for the StepProgressBar component.
 */
export interface StepProgressBarProps {
  /** Array of steps to display. */
  steps: Step[];
  /** Orientation of the progress bar. */
  orientation?: 'horizontal' | 'vertical';
  /** Optional additional class name. */
  className?: string;
}

const iconMap = {
  passed: { Icon: IIconCheckDone, id: 'icon-check-done' },
  active: { Icon: IIconCheckActive, id: 'icon-check-active' },
  incomplete: { Icon: IIconCheckNext, id: 'icon-check-incomplete' },
};
/**
 * Renders a step-based progress bar with optional labels and orientation.
 *
 * @remarks
 * This component displays a sequence of steps, each with a status and optional label.
 * The progress bar can be displayed horizontally or vertically.
 *
 * @param props - {@link StepProgressBarProps}
 * @returns The rendered StepProgressBar component.
 */
export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  orientation = 'horizontal',
  className,
}) => {
  const t = useTranslations('stepProgressBar');
  const hasLabels = steps.some((step) => !!step.label);

  return (
    <nav
      className={clsx(
        styles.stepProgressBar,
        styles[orientation],
        { [styles.withLabels]: hasLabels },
        className,
      )}
      data-testid="step-progress-bar"
      aria-label={t('progressBarLabel')}
    >
      <ul className={styles.stepsList} aria-label={t('stepsListLabel')}>
        {steps.map((step, idx) => {
          const { Icon, id } = iconMap[step.status];
          const key = step.label ? `${step.label}-${step.status}` : `step-${step.status}-${idx}`;

          return (
            <React.Fragment key={key}>
              <li
                className={clsx(styles.stepIconWrapper, styles[orientation])}
                aria-current={step.status === 'active' ? 'step' : undefined}
                data-testid="step-icon-wrapper"
              >
                <Icon className={styles.stepIcon} aria-hidden="true" id={id} />
                {step.label && (
                  <Text variant="subtitle" regular className={clsx(styles[orientation])}>
                    {step.label}
                  </Text>
                )}
              </li>
              {idx < steps.length - 1 && (
                <Divider
                  orientation={orientation}
                  className={clsx(styles.divider, styles[orientation])}
                  variant="subtle"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};
