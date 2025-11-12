import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import styles from '../EmptyItemsModal.module.css';
import { FormRow } from './FormRow';
import { NumericInput } from './NumericInput';
import { FormData } from './useEmptyItemsForm';

interface AmountFormRowProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  tLabels: (key: string) => string;
  getCurrentUnit: () => string;
  readonly?: boolean;
}

export const AmountFormRow = ({
  control,
  errors,
  tLabels,
  getCurrentUnit,
  readonly = false,
}: AmountFormRowProps) => {
  return (
    <FormRow label={tLabels('amount')}>
      <Controller
        name="quantity"
        control={control}
        render={({ field: { onChange, value } }) => (
          <NumericInput
            id="input-modal-amount"
            value={value}
            onChange={onChange}
            currency={getCurrentUnit()}
            error={!!errors.unitPrice}
            helperText={errors.quantity?.message}
            maxLength={10}
            className={styles.inputField}
            disabled={readonly}
            allowDecimals={false}
            useSpaceSeparators={false}
          />
        )}
      />
    </FormRow>
  );
};
