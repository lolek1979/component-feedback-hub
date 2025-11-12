'use client';

import { Fragment, ReactNode } from 'react';

import IProcessArrow from '@/core/assets/icons/subdirectory_arrow_right.svg';
import { Button, Divider, Text } from '@/design-system/atoms';

import { AdminProcessStepper } from '../ProcessDetail/AdminProcessStepper/AdminProcessStepper';
import { WorkflowStep } from '../ProcessDetail/AdminProcessWorkFlow/WorkflowSteps';
import styles from './AdminProcessLayout.module.css';

export interface FormListItem {
  label?: string | ReactNode;
  value?: ReactNode;
}

export interface FormBlock {
  title: string;
  items?: FormListItem[];
  component?: ReactNode;
}

export interface AdminProcessLayoutProps {
  title: string;
  formBlocks: FormBlock[];
  footerButton?: {
    label: string;
    onClick: () => void;
  };
  currentStep: number;
  onStepChange: (step: number) => void;
  id?: string;
  workflowSteps?: WorkflowStep[];
}

export const AdminProcessLayout = (props: AdminProcessLayoutProps) => {
  const {
    title,
    formBlocks,
    footerButton,
    currentStep,
    onStepChange,
    id = 'admin-process-layout',
    workflowSteps = [],
  } = props;

  return (
    <div data-testid={id} className={styles.adminProcessLayoutContainer}>
      <div className={styles.formContainer}>
        <div className={styles.formTitle}>
          <Text variant="headline">{title}</Text>
        </div>
        <div className={styles.formBody}>
          {formBlocks.map((block, blockIndex) => {
            const blockItems = block.items || [];

            return (
              <div key={`form-block-${blockIndex}`} className={styles.formBlock}>
                <div className={styles.formBlockHeader}>
                  <Text variant="subtitle">{block.title}</Text>
                </div>
                <div className={styles.formBlockDetails}>
                  <ul>
                    {blockItems.map((item, itemIndex) => (
                      <Fragment key={`block-${blockIndex}-item-${itemIndex}`}>
                        <li>
                          <div className={styles.detailRow}>
                            <div
                              className={
                                item.value === undefined
                                  ? styles.detailRowTextNoValue
                                  : styles.detailRowText
                              }
                            >
                              <Text variant="subtitle" regular className={styles.detailRowLabel}>
                                {item.label}
                              </Text>
                            </div>
                            <div className={styles.detailRowValue}>
                              <Text variant="subtitle">{item.value}</Text>
                            </div>
                          </div>
                        </li>
                        {itemIndex < blockItems.length - 1 && (
                          <li className={styles.dividerContainer}>
                            <Divider variant="dotted" />
                          </li>
                        )}
                      </Fragment>
                    ))}
                  </ul>
                  {block.component && <div>{block.component}</div>}
                </div>
              </div>
            );
          })}
        </div>
        {footerButton && (
          <div className={styles.formFooter}>
            <Button
              id={`button-${id}-proceed`}
              className={styles.proceedButton}
              onClick={footerButton.onClick}
              icon={<IProcessArrow className="icon_white" id={`icon-${id}-proceed`} />}
            >
              {footerButton.label}
            </Button>
          </div>
        )}
      </div>

      <div>
        <Divider orientation="vertical" />
      </div>

      <div>
        <AdminProcessStepper
          activeStep={currentStep}
          onStepChange={onStepChange}
          workflowSteps={workflowSteps}
        />
      </div>
    </div>
  );
};
