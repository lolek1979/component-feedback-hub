import React from 'react';

import { StepSeparatorIcon } from '@/core/assets/icons/StepSeparatorIcon';
import { Typography } from '@/design-system/molecules/Typography/Typography';

import styles from './ComplaintsStepper.module.css';

interface Step {
  label: string;
  isActive: boolean;
}

interface ComplaintsStepperProps {
  steps: Step[];
}

export const ComplaintsStepper = ({ steps }: ComplaintsStepperProps) => {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={styles.stepItem}>
            <div className={styles.stepNumberCircle}>
              <Typography
                variant={step.isActive ? 'Subtitle/Default/Bold' : 'Subtitle/Default/Regular'}
                className={step.isActive ? styles.activeNumberText : styles.inactiveNumberText}
              >
                {index + 1}
              </Typography>
            </div>
            <Typography
              variant={step.isActive ? 'Subtitle/Default/Bold' : 'Subtitle/Default/Regular'}
              className={step.isActive ? styles.activeText : styles.inactiveText}
            >
              {step.label}
            </Typography>
          </div>

          {index < steps.length - 1 && <StepSeparatorIcon className={styles.separator} />}
        </React.Fragment>
      ))}
    </div>
  );
};
