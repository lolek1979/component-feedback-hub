import useCodeListBycode from '@/core/api/query/useCodeListBycode';
import { Option, Select } from '@/design-system/atoms';

import styles from './DynamicSelect.module.css';

interface DynamicSelectProps {
  /** Code of the registry for data loading (required) */
  code: string;

  /** Timestamp for the desired version of the registry */
  time?: string;

  /** Indexes of columns used to compose the label displayed in the Select */
  labelColumnIndexes: number[];

  /** Separator between label values (default: " ") */
  labelSeparator?: string;

  /** Index of the column representing the Select value */
  valueColumnIndex: number;

  /** Component ID */
  id: string;

  /** Handler for value change */
  onChange?: (value: string) => void;

  /** Handler for when the field loses focus */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;

  /** Optional CSS class for styling */
  className?: string;

  /** Placeholder when no value is selected */
  placeholder?: string;

  /** Optional default value for controlled component */
  value?: string;

  /** Disabled state setting (e.g., during loading) */
  disabled?: boolean;
}

export const DynamicSelect = ({
  code,
  id,
  time,
  labelColumnIndexes,
  labelSeparator,
  disabled,
  onBlur,
  onChange,
  valueColumnIndex,
  className,
  placeholder,
  value = '',
}: DynamicSelectProps) => {
  const codeResponse = useCodeListBycode({ code, time });
  const codeData = codeResponse.data?.content;

  return (
    <div id={id} className={styles.container}>
      <Select
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        onBlur={onBlur && onBlur}
        onChange={onChange}
        value={value}
        id={id + '-select'}
      >
        {codeData?.data.map((row) => {
          const value = row[valueColumnIndex];
          const label = labelColumnIndexes.map((index) => row[index]).join(labelSeparator ?? ' ');

          return (
            <Option key={value} value={value}>
              {label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};
