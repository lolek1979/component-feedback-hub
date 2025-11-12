'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import IProcessArrow from '@/core/assets/icons/subdirectory_arrow_right.svg';
import { Button, Divider, Text, ToggleContent } from '@/design-system/atoms';
import type { BadgeStatus } from '@/design-system/atoms/ToggleContent';
import { Chip } from '@/design-system/molecules';
import { StatusTrack } from '@/domains/administrative-proceedings/components/StatusTrack';

import styles from './Stepper.module.css';

export type Step = {
  id?: string;
  label: string;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
  badgeContent?: React.ReactNode;
};

export type StepsGroupProps = {
  step: Step;
  index: number;
  activeStep: number;
  alternativeLabel: boolean;
  activeSubStep: number;
  isActiveStep: boolean;
  isExpanded: boolean;
  groupSteps?: Step[];
  onStepChange?: (step: number) => void;
};

interface StepperProps {
  activeStep?: number;
  alternativeLabel?: boolean;
  steps: Step[];
  groupSteps?: Record<number, Step[]>;
  onStepChange?: (step: number) => void;
  children?: React.ReactNode;
  showNavigation?: boolean;
  nextButtonLabel?: string;
  backButtonLabel?: string;
}

export const Stepper = ({
  activeStep = 0,
  alternativeLabel = false,
  steps,
  groupSteps = {},
  onStepChange,
  children,
  showNavigation = false,
  nextButtonLabel,
  backButtonLabel = '',
}: StepperProps) => {
  const t = useTranslations('stepper.badgeStatuses');
  // const tCommon = useTranslations('common');
  const stepsWithIds = useMemo(() => {
    return steps.map((step, index) => ({
      ...step,
      id: step.id || `step-${step.label.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    }));
  }, [steps]);

  const currentStepInfo = useMemo(() => {
    let stepIndex = 0;
    let subStepIndex = 0;
    let count = 0;

    for (let i = 0; i < steps.length; i++) {
      const groupLength = groupSteps[i]?.length || 0;

      if (count === activeStep) {
        stepIndex = i;
        subStepIndex = 0;
        break;
      } else if (count < activeStep && count + groupLength > activeStep) {
        stepIndex = i;
        subStepIndex = activeStep - count;
        break;
      }

      count += groupLength || 1;
    }

    return { stepIndex, subStepIndex };
  }, [activeStep, steps, groupSteps]);

  // Change back to a single expanded step index
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(
    currentStepInfo?.stepIndex !== undefined ? currentStepInfo.stepIndex : null,
  );

  // Function to check if a step should be expanded
  const isStepExpanded = (index: number) => {
    return expandedStepIndex === index;
  };

  // Helper function to get badge info for a step
  const getBadgeInfo = (index: number): { status?: BadgeStatus; label?: string } => {
    const hasGroupSteps = groupSteps[index] && groupSteps[index].length > 0;
    if (!hasGroupSteps) return {};

    const subSteps = groupSteps[index] || [];
    let count = 0;
    for (let i = 0; i < index; i++) {
      count += groupSteps[i]?.length || 1;
    }

    const isFirstGroup = index === 0;
    const isInitialStep = activeStep === 0;

    const subStepStatuses = subSteps.map((_, subIndex) => {
      const absoluteSubStepIndex = count + subIndex;

      return {
        completed: absoluteSubStepIndex + 1 < activeStep,
        active:
          isFirstGroup && isInitialStep && subIndex === 0
            ? true
            : absoluteSubStepIndex + 1 === activeStep,
      };
    });

    const allCompleted = subStepStatuses.every((status) => status.completed);
    const anyActive = subStepStatuses.some((status) => status.active);
    const anyPending = subStepStatuses.some((status) => !status.completed && !status.active);

    const nextGroupFirstStepIndex = count + subSteps.length;
    const isActiveStep = currentStepInfo?.stepIndex === index;
    const isCompleted = index < currentStepInfo?.stepIndex;
    const isDisabled = !isCompleted && !isActiveStep;

    if (isFirstGroup && isInitialStep) {
      return { status: 'opened', label: t('opened') };
    } else if (allCompleted) {
      return { status: 'finished', label: t('completed') };
    } else if (anyActive) {
      return { status: 'opened', label: t('opened') };
    } else if (activeStep === nextGroupFirstStepIndex && index === currentStepInfo.stepIndex + 1) {
      return { status: 'opened', label: t('opened') };
    } else if (isDisabled || anyPending) {
      return { status: 'pending', label: t('pending') };
    }

    return {};
  };

  useEffect(() => {
    if (currentStepInfo?.stepIndex !== undefined) {
      const newActiveStepIndex = currentStepInfo.stepIndex;

      if (expandedStepIndex !== null && expandedStepIndex !== newActiveStepIndex) {
        const { status: expandedStepStatus } = getBadgeInfo(expandedStepIndex);
        if (expandedStepStatus === 'finished') {
          setExpandedStepIndex(newActiveStepIndex);
        }
      } else if (expandedStepIndex === null) {
        setExpandedStepIndex(newActiveStepIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, currentStepInfo]);

  const handleToggleExpand = (index: number) => {
    setExpandedStepIndex(expandedStepIndex === index ? null : index);
  };

  const getTotalSteps = () => {
    return steps.reduce((total, _, index) => {
      return total + (groupSteps[index]?.length || 1);
    }, 0);
  };

  const canGoNext = activeStep < getTotalSteps() - 1;
  const canGoBack = activeStep > 0;

  const handleNext = () => {
    if (canGoNext && onStepChange) {
      let nextStep = activeStep + 1;

      const { stepIndex } = currentStepInfo;
      const currentGroupSteps = groupSteps[stepIndex];

      if (currentGroupSteps) {
        let previousStepsCount = 0;
        for (let i = 0; i < stepIndex; i++) {
          previousStepsCount += groupSteps[i]?.length || 1;
        }

        const currentSubStepIndex = activeStep - previousStepsCount;

        if (currentSubStepIndex === currentGroupSteps.length - 1 && stepIndex < steps.length - 1) {
          nextStep = previousStepsCount + currentGroupSteps.length;
        }
      }

      onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    if (canGoBack && onStepChange) {
      onStepChange(activeStep - 1);
    }
  };

  if (children) {
    return (
      <div className={`${styles.stepper}`}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement<any>, {
            index,
            active: index === activeStep,
            completed: index < activeStep,
            alternativeLabel,
            onClick: () => onStepChange?.(index),
          });
        })}
      </div>
    );
  }

  return (
    <div className={`${styles.stepper}`}>
      <div className={styles.stepperContent}>
        {stepsWithIds?.map((step, index) => {
          const isActiveStep = currentStepInfo?.stepIndex === index;
          const isCompleted = index < currentStepInfo?.stepIndex;
          const isDisabled = !isCompleted && !isActiveStep;
          const hasGroupSteps = groupSteps[index] && groupSteps[index].length > 0;

          const { status: badgeStatus, label: badgeLabel } = getBadgeInfo(index);

          return (
            <React.Fragment key={step.id || index}>
              <div
                className={`${styles.step} ${isActiveStep ? styles.active : ''} ${
                  step.completed ? styles.completed : ''
                } ${isDisabled ? styles.disabled : ''}`}
              >
                {hasGroupSteps ? (
                  <ToggleContent
                    title={`${index + 1}. ${step.label}`}
                    collapsed={!isStepExpanded(index)}
                    borderColor="transparent"
                    headerColor="transparent"
                    isActiveStep={isActiveStep}
                    isDisabled={isDisabled}
                    onToggle={() => handleToggleExpand(index)}
                    badgeStatus={badgeStatus}
                    badgeLabel={badgeLabel}
                  >
                    <div
                      className={styles.subSteps}
                      id={`substeps-${step.id}`}
                      role="region"
                      aria-labelledby={`step-label-${step.id}`}
                    >
                      {StatusTrack && (
                        <StatusTrack
                          items={groupSteps[index].map((subStep, subIndex) => {
                            let count = 0;
                            for (let i = 0; i < index; i++) {
                              count += groupSteps[i]?.length || 1;
                            }
                            const absoluteSubStepIndex = count + subIndex;

                            const isFirstGroup = index === 0;
                            const isInitialStep = activeStep === 0;

                            return {
                              label: subStep.label,
                              completed: absoluteSubStepIndex + 1 < activeStep,
                              active:
                                isFirstGroup && isInitialStep && subIndex === 0
                                  ? true
                                  : absoluteSubStepIndex + 1 === activeStep,
                              disabled: subStep.disabled,
                              badgeContent: subStep.badgeContent,
                              isInCompletedGroup: isCompleted,
                              groupBadgeStatus: badgeStatus,
                              onClick: () => {
                                if (!subStep.disabled) {
                                  onStepChange?.(absoluteSubStepIndex + 1);
                                }
                              },
                            };
                          })}
                        />
                      )}
                      {!StatusTrack && <div>StatusTrack component not available</div>}
                    </div>
                  </ToggleContent>
                ) : (
                  <div
                    className={styles.stepLabelContainer}
                    onClick={() => {
                      if (!isDisabled && onStepChange) {
                        onStepChange(index);
                      }
                    }}
                  >
                    <Text id={`step-label-${step.id}`}>
                      {index + 1}. {step.label}
                    </Text>
                    {step.badgeContent && (
                      <div className={styles.badgeContainer}>
                        <Chip ariaLabel="group badge">{step.badgeContent}</Chip>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {index < stepsWithIds.length - 2 && (
                <div className={styles.stepperDivider}>
                  <Divider orientation="horizontal" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {showNavigation && (
        <div className={styles.stepperControls}>
          {backButtonLabel !== '' && (
            <Button id="back-button" variant="secondary" onClick={handleBack} disabled={!canGoBack}>
              {backButtonLabel || 'Back'}
            </Button>
          )}
          <Button
            id="next-button"
            onClick={handleNext}
            disabled={!canGoNext}
            icon={<IProcessArrow className="icon_white" id="icon-stepper-next" />}
          >
            {nextButtonLabel || 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
};
