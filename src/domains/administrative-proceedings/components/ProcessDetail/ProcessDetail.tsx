'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import IError from '@/core/assets/icons/icon-error.svg';
import IWarning from '@/core/assets/icons/icon-warning.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { Text } from '@/design-system/atoms';
import { InlineMessage } from '@/design-system/molecules';

import { AdminProcessLayout } from '../AdminProcessLayout/AdminProcessLayout';
import {
  FormsProvider,
  useFormsContext,
  useWorkflowSteps,
} from './AdminProcessWorkFlow/WorkflowSteps';
import styles from './ProcessDetail.module.css';

interface ProcessDetailProps {
  id: string;
}

const ProcessDetailContent = ({ id }: ProcessDetailProps) => {
  const t = useTranslations('common');
  const tAdminProcess = useTranslations('administrativeProceedings.workflowSteps');
  const { adminProceedingsReferent } = useRoles();
  const [currentStep, setCurrentStep] = useState(0);
  const { saveCurrentForm } = useFormsContext();

  const workflowSteps = useWorkflowSteps(id);

  const handleProceed = async () => {
    const currentWorkflowStep = workflowSteps[currentStep];

    await saveCurrentForm(id, currentWorkflowStep.id);

    if (currentStep < workflowSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.error('Workflow completed');
    }
  };

  if (!adminProceedingsReferent) {
    return (
      <InlineMessage
        id="inline-message-missing-role"
        data-testid="inline-message-missing-role"
        icon={
          <IError
            id="icon-inline-message-mising-role-error"
            className="icon_red-500"
            width={20}
            height={20}
          />
        }
        message={t('missingRole')}
        variant="error"
      />
    );
  }

  const currentWorkflowStep = workflowSteps[currentStep];
  const isRequestStep = currentWorkflowStep.id === 'admin-process-request-step';

  return (
    <div className={styles.relativeContainer}>
      {isRequestStep && (
        <div className={styles.messageOverlay}>
          <div className={styles.messageHeader}>
            <IWarning
              id="icon-message-warning"
              className="icon_orange-1000"
              width={24}
              height={24}
            />
            <InlineMessage
              id="request-step-message"
              message={tAdminProcess('requestStep.note.title')}
              variant="warning"
            />
          </div>
          <div className={styles.messageBody}>
            <Text variant="caption" regular>
              {tAdminProcess('requestStep.note.body')}
            </Text>
          </div>
        </div>
      )}

      <AdminProcessLayout
        id="admin-process-detail"
        title={currentWorkflowStep.title}
        formBlocks={currentWorkflowStep.formBlocks}
        footerButton={{
          label: currentWorkflowStep.buttonText,
          onClick: handleProceed,
        }}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        workflowSteps={workflowSteps}
      />
    </div>
  );
};

export const ProcessDetail = (props: ProcessDetailProps) => {
  return (
    <FormsProvider adminProcessId={props.id}>
      <ProcessDetailContent {...props} />
    </FormsProvider>
  );
};
