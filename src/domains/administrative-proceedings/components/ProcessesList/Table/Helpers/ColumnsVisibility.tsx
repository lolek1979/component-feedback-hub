'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Table } from '@tanstack/table-core';

import TableSettingsIcon from '@/core/assets/icons/view_week.svg';
import { Button, Checkbox } from '@/design-system/atoms';
import { Popover } from '@/design-system/molecules';

import styles from './ColumnsVisibility.module.css';

interface ColumnsVisibilityProps<TData> {
  table: Table<TData>;
}

const ColumnsVisibility = <TData,>(props: ColumnsVisibilityProps<TData>) => {
  const { table } = props;
  const cols = table.getAllColumns();
  const t = useTranslations('administrativeProceedings.columns');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleToggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <Popover
      content={() => (
        <div className={styles.visibilityPopup}>
          <ul>
            {cols.map((column) => (
              <li key={column.id}>
                <label className={!column.getCanHide() ? styles.disabled : ''}>
                  <Checkbox
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    onChange={column.getToggleVisibilityHandler()}
                    id={`checkbox-column-visibility-${column.id}`}
                  />
                  <span>{t(String(column.id))}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      trigger={
        <Button
          id="button-column-visibility-open"
          variant="unstyled"
          onClick={handleToggleVisibility}
        >
          <TableSettingsIcon id="icon-column-visiblity-open" width={26} height={26} />
        </Button>
      }
    />
  );
};

export default ColumnsVisibility;
