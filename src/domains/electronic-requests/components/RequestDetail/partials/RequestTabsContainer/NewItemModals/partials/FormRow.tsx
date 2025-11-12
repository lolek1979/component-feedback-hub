import React from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { Text } from '@/design-system/atoms';

import styles from '../EmptyItemsModal.module.css';

import { Typography } from '@/design-system';

interface FormRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormRow = ({ label, required = true, children, className }: FormRowProps) => {
  const tFieldsLabels = useTranslations(
    'requests.requestDetail.tabs.items.emptyItemsModal.fieldsLabels',
  );

  return (
    <div className={clsx(styles.formRow, className)}>
      <div className={styles.labelContainer}>
        <Text variant="subtitle" regular>
          {label}
          {!required && (
            <Typography variant="Subtitle/Default/Regular" className={styles.notRequiredText}>
              ({tFieldsLabels('notRequired')})
            </Typography>
          )}
        </Text>
      </div>
      <div className={styles.inputContainer}>{children}</div>
    </div>
  );
};
