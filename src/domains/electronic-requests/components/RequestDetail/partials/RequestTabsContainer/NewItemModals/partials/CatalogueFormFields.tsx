import { WFState } from '@/domains/electronic-requests/api/services/types';

import { FormRow } from './FormRow';
import { ItemApprover } from './ItemApprover';

import { Divider } from '@/design-system';

export type FormFieldName =
  | 'title'
  | 'description'
  | 'attachments'
  | 'numberInSAP'
  | 'supplierNumber'
  | 'measureUnit'
  | 'amount'
  | 'price'
  | 'contract'
  | 'categoryId'
  | 'expectedDeliveryDate'
  | 'hyperlink'
  | 'bindingToContract'
  | 'approvalProcess'
  | 'approver'
  | 'status'
  | undefined;

interface CatalogueFormFieldsProps {
  formFields: {
    label: string;
    name?: FormFieldName;
  }[];
  approverName: string;
  currentItemWfState: WFState;
}
export const CatalogueFormFields = ({
  formFields,
  approverName,
  currentItemWfState,
}: CatalogueFormFieldsProps) => {
  return (
    <>
      {formFields.map(({ label, name }) => (
        <div key={label}>
          <FormRow label={label} key={name}>
            <ItemApprover
              approverName={approverName}
              currentItemWfState={currentItemWfState}
              formField={name}
            />
          </FormRow>
          <Divider variant="dotted" />
        </div>
      ))}
    </>
  );
};
