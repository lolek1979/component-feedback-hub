'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import TableSettingsIcon from '@/core/assets/icons/view_week.svg';
import buttonStyles from '@/design-system/atoms/Button/Button.module.css';
import { TableSettings } from '@/design-system/molecules/TableSettings';

import { Popover } from '../../Popover';

/**
 * Props for the TableSettingsPopover component.
 *
 * @property status - Optional status for the popover.
 * @property keys - Array of setting options with label and value.
 * @property disabledItems - Array of item values that are disabled.
 * @property onOptionsChange - Callback when options change, receives excluded keys.
 */
interface RowActionsPopoverProps {
  status?: string;
  keys?: Array<{
    label: string;
    value: string;
  }>;
  disabledItems?: string[];
}

/**
 * TableSettingsPopover displays a popover for table settings options.
 *
 * Renders a trigger button and a popover with selectable table settings.
 * Handles option changes and disabled items.
 *
 * @param props RowActionsPopoverProps & { onOptionsChange: (excludedKeys: string[]) => void }
 * @returns React component
 */
export const TableSettingsPopover = ({
  onOptionsChange,
  disabledItems,
  keys,
}: RowActionsPopoverProps & { onOptionsChange: (excludedKeys: string[]) => void }) => {
  const t = useTranslations('TableSettings');
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (keys) {
      const initialOptions = keys.reduce(
        (acc, item) => ({ ...acc, [item.value]: true }),
        {} as { [key: string]: boolean },
      );
      setOptions(initialOptions);
    }
  }, [keys]);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  const handleOptionsChange = (excludedKeys: string[]) => {
    const newOptions =
      keys?.reduce(
        (acc, item) => ({ ...acc, [item.value]: !excludedKeys.includes(item.value) }),
        {},
      ) || {};
    setOptions(newOptions);
    onOptionsChange(excludedKeys);
  };

  return (
    <Popover
      content={() => (
        <TableSettings
          items={keys || []}
          onOptionsChange={handleOptionsChange}
          disabledItems={disabledItems}
          initialOptions={options}
        />
      )}
      placement="tooltip-bottom-start"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      trigger={
        <button
          onClick={handleButtonClick}
          id="button-table-settings-open"
          className={buttonStyles.nonStyle}
          title={t('TableSettingsButton')}
        >
          <TableSettingsIcon id="icon-table-settings-open" width={26} height={26} />
        </button>
      }
    />
  );
};
