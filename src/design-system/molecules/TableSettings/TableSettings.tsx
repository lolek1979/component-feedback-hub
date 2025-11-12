'use client';

import { useContext, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Checkbox, Text } from '@/design-system/atoms';
import { TableContext } from '@/design-system/molecules/Table/Table';

import styles from './TableSettings.module.css';

/**
 * Props for the TableSettings component.
 *
 * @property items - Array of setting options with label and value.
 * @property disabledItems - Array of item values that are disabled.
 * @property onOptionsChange - Callback when options change, receives excluded keys.
 * @property initialOptions - Initial options state mapping item values to boolean.
 */
export interface TableSettingsProps {
  items: Array<{
    label: string;
    value: string;
  }>;
  disabledItems?: string[];
  onOptionsChange: (excludedKeys: string[]) => void;
  initialOptions?: { [key: string]: boolean };
}

/**
 * TableSettings displays a list of table setting options with checkboxes.
 *
 * Allows selecting, deselecting, and resetting options, and notifies changes via callback.
 *
 * @param props TableSettingsProps
 * @returns React component
 */

export const TableSettings = ({
  items,
  onOptionsChange,
  disabledItems = [],
  initialOptions = {},
}: TableSettingsProps) => {
  const { options, setOptions } = useContext(TableContext);

  useEffect(() => {
    if (Object.keys(options).length === 0) {
      const initial = items.reduce(
        (acc, item) => ({ ...acc, [item.value]: initialOptions[item.value] ?? false }),
        {} as { [key: string]: boolean },
      );
      setOptions(initial);
      onOptionsChange(Object.keys(initial).filter((key) => !initial[key]));
    }
  }, [items, initialOptions, onOptionsChange, options, setOptions]);
  const t = useTranslations('TableSettings');

  const handleCheckboxChange = (option: string) => (checked: boolean) => {
    const newOptions = { ...options, [option]: checked };
    setOptions(newOptions);
    onOptionsChange(Object.keys(newOptions).filter((key) => !newOptions[key]));
  };

  const handleReset = () => {
    const resetOptions = items.reduce(
      (acc, item) => ({
        ...acc,
        [item.value]: disabledItems.includes(item.value) ? options[item.value] : false,
      }),
      {},
    );
    setOptions(resetOptions);
    onOptionsChange(
      items.filter((item) => !disabledItems.includes(item.value)).map((item) => item.value),
    );
  };

  const handleSelectAll = () => {
    const allSelectedOptions = items.reduce((acc, item) => ({ ...acc, [item.value]: true }), {});
    setOptions(allSelectedOptions);
    onOptionsChange([]);
  };

  return (
    <div
      className={styles.tableSettings}
      id="table-settings"
      role="group"
      aria-label="Table settings"
    >
      <div>
        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={item.value} id={'table-settings-item-' + index} className={styles.item}>
              <Checkbox
                checked={options[item.value] || false}
                onChange={(e) => handleCheckboxChange(item.value)(e.target.checked)}
                data-testid={`checkbox-${item.label}`}
                id={`checkbox-table-settings-${item.label}`}
                disabled={disabledItems?.includes(item.value)}
                aria-labelledby={`label-${item.label}`}
                isMultiselect={true}
              />
              <Text
                variant="label"
                selectable={false}
                htmlFor={`checkbox-table-settings-${item.label}`}
                id={`label-table-settings-${item.label}`}
                regular
              >
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          id="button-table-settings-select"
          variant="tertiary"
          size="small"
          onClick={handleSelectAll}
          className={styles.filterButton}
          ariaLabel={t('SelectAllButton')}
        >
          <Text variant="subtitle">{t('SelectAllButton')}</Text>
        </Button>
        <Button
          id="button-table-settings-reset"
          variant="tertiary"
          size="small"
          onClick={handleReset}
          className={styles.filterButton}
          ariaLabel={t('ResetFiltersButton')}
        >
          <Text variant="subtitle">{t('ResetFiltersButton')}</Text>
        </Button>
      </div>
    </div>
  );
};
