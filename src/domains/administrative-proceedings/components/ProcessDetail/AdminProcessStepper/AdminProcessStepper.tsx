'use client';

import { useMemo, useState } from 'react';

import { Step, Stepper } from '../../Stepper';
import { WorkflowStep } from '../AdminProcessWorkFlow/WorkflowSteps';
import styles from './AdminProcessStepper.module.css';

interface AdminProcessStepperProps {
  activeStep?: number;
  onStepChange?: (step: number) => void;
  workflowSteps?: WorkflowStep[];
}

export const AdminProcessStepper = ({
  activeStep: externalActiveStep,
  onStepChange: externalOnStepChange,
  workflowSteps = [],
}: AdminProcessStepperProps = {}) => {
  const [internalActiveStep, setInternalActiveStep] = useState(0);

  const activeStep = externalActiveStep !== undefined ? externalActiveStep : internalActiveStep;
  const setActiveStep = externalOnStepChange || setInternalActiveStep;

  const steps = useMemo<Step[]>(() => {
    const groupedSteps = workflowSteps.reduce<Record<string, number[]>>((acc, step, index) => {
      if (!acc[step.group]) {
        acc[step.group] = [];
      }
      acc[step.group].push(index);

      return acc;
    }, {});

    return Object.entries(groupedSteps).map(([groupName, indexes]) => {
      const isCompleted = indexes.every((index) => activeStep > index);
      const isActive = indexes.some((index) => activeStep === index);

      return {
        id: groupName,
        label: groupName,
        completed: isCompleted,
        badgeContent: isCompleted ? 'Dokončeno' : isActive ? 'Otevřeno' : undefined,
      };
    });
  }, [activeStep, workflowSteps]);

  const groupSteps = useMemo<Record<number, Step[]>>(() => {
    const result: Record<number, Step[]> = {};

    const groupedByName = workflowSteps.reduce<Record<string, WorkflowStep[]>>((acc, step) => {
      if (!acc[step.group]) {
        acc[step.group] = [];
      }
      acc[step.group].push(step);

      return acc;
    }, {});

    const uniqueGroups = Array.from(new Set(workflowSteps.map((step) => step.group)));

    uniqueGroups.forEach((groupName, groupIndex) => {
      const stepsInGroup = groupedByName[groupName];

      result[groupIndex] = stepsInGroup.map((step) => ({
        id: `substep-${step.title}`,
        label: step.title,
        completed: activeStep > workflowSteps.findIndex((s) => s.title === step.title),
      }));
    });

    return result;
  }, [activeStep, workflowSteps]);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className={styles.stickyStepper}>
      <Stepper
        activeStep={activeStep}
        steps={steps}
        groupSteps={groupSteps}
        onStepChange={handleStepChange}
      />
    </div>
  );
};
