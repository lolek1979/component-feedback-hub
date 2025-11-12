import { StepProgressBar } from '@/design-system/molecules/StepProgressBar';
import { WFState } from '@/domains/electronic-requests/api/services/types';

import styles from '../EmptyItemsModal.module.css';
import { FormData } from './useEmptyItemsForm';
import { isEmpty, mapWorkflowStateToSteps } from './utils';

import { Avatar, Text } from '@/design-system';

interface ItemApproverProps {
  approverName: string;
  formField?: string;
  currentItemWfState: WFState;
}

const validWatchFields: (keyof FormData)[] = [
  'title',
  'description',
  'numberInSAP',
  'supplierNumber',
  'measureUnit',
  'quantity',
  'unitPrice',
  'contract',
  'categoryId',
  'expectedDeliveryDate',
  'hyperlink',
  'bindingToContract',
  'attachments',
];
type FieldValue = string | number | Date | Array<{ name: string; id?: string }> | undefined;

const getFormFieldValue = ({ value }: { value: FieldValue }) => {
  if (Array.isArray(value)) {
    return value.map((f) => (typeof f === 'string' ? f : f.name)).join(', ');
  } else if (value instanceof Date) {
    return value.toLocaleDateString();
  } else {
    return value;
  }
};

const FieldRender = ({ value }: { value: FieldValue }) => {
  if (isEmpty(value)) {
    return <Text variant="subtitle">-</Text>;
  }

  return <Text variant="subtitle">{getFormFieldValue({ value })}</Text>;
};

export const ItemApprover = ({
  approverName,
  formField,
  currentItemWfState,
}: ItemApproverProps) => {
  if (formField === 'approver') {
    if (approverName) {
      return (
        <div className={styles.userContainer}>
          <Avatar name={approverName} className={styles.user} />
          <Text variant="subtitle" regular className={styles.userText}>
            {approverName}
          </Text>
        </div>
      );
    } else {
      return <Text variant="subtitle">-</Text>;
    }
  } else if (formField === 'approvalProcess') {
    return (
      <StepProgressBar
        steps={mapWorkflowStateToSteps(currentItemWfState)}
        orientation="horizontal"
      />
    );
  } else {
    (() => {
      if (!formField || !validWatchFields.includes(formField as keyof FormData)) {
        return <FieldRender value={undefined} />;
      }

      const fieldValue = formField as keyof FormData;

      if (formField === 'attachments' && Array.isArray(fieldValue)) {
        const attachments = fieldValue.map((att) => ({
          name: att.name || 'Unknown file',
          id: att.id,
        }));

        return <FieldRender value={attachments} />;
      }

      return <FieldRender value={fieldValue as FieldValue} />;
    })();
  }
};
