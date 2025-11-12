'use client';

import { useTranslations } from 'next-intl';

import AddAboveIcon from '@/core/assets/icons/add_row_above.svg';
import AddBelowIcon from '@/core/assets/icons/add_row_below.svg';
import DeleteIcon from '@/core/assets/icons/delete_forever.svg';
import { Button } from '@/design-system/atoms';

import styles from '../CodelistTab.module.css';

interface CodelistRowOptionsProps {
  index: number;
  onRowAction: (action: string) => void;
}

export const CodelistRowOptions = ({ index, onRowAction }: CodelistRowOptionsProps) => {
  const t = useTranslations('Table');

  return (
    <div className={`${styles.codelistRowOptions} primary-shadow`}>
      <Button
        variant="unstyled"
        id={`button-codelist-row-add-above-${index}`}
        onClick={() => onRowAction('above')}
        className={styles.codelistRowOptionButton}
      >
        <AddAboveIcon id={`icon-codelist-row-add-above-${index}`} width={16} height={16} />
        <span>{t('addRowAbove')}</span>
      </Button>

      <Button
        variant="unstyled"
        id={`button-codelist-row-add-below-${index}`}
        onClick={() => onRowAction('below')}
        className={styles.codelistRowOptionButton}
      >
        <AddBelowIcon id={`icon-codelist-row-add-below-${index}`} width={16} height={16} />
        {t('addRowBelow')}
      </Button>

      <Button
        variant="unstyled"
        id={`button-codelist-row-delete-${index}`}
        onClick={() => onRowAction('delete')}
        className={styles.codelistRowOptionButton}
      >
        <DeleteIcon id={`icon-codelist-row-delete-${index}`} width={16} height={16} />
        {t('deleteRow')}
      </Button>
    </div>
  );
};
