'use client';

import { useState } from 'react';

import { Button } from '../Button';
import styles from './SegmentedControl.module.css';

/**
 * Option type for the {@link SegmentedControl} component.
 *
 * @property value - The value associated with the option.
 * @property label - The label to display for the option.
 */
interface SegmentedControlOption {
  value: string;
  label: string;
}

/**
 * Props for the {@link SegmentedControl} component.
 *
 * @property options - 2D array of options to display in rows and columns.
 * @property setSelectedValue - Optional callback when an option is selected.
 */
interface SegmentedControlProps {
  options: SegmentedControlOption[][];
  setSelectedValue?: (item: string) => void;
}

/**
 * SegmentedControl component for selecting options in a grid layout.
 *
 * Renders a set of buttons organized in rows and columns, allowing users to select one option per row.
 * Calls `setSelectedValue` when an option is selected.
 *
 * @param props.options - 2D array of options to display.
 * @param props.setSelectedValue - Callback when an option is selected.
 *
 * @example
 * <SegmentedControl
 *   options={[
 *     [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
 *     [{ value: 'c', label: 'C' }, { value: 'd', label: 'D' }]
 *   ]}
 *   setSelectedValue={(val) => console.log(val)}
 * />
 */
export const SegmentedControl = ({ options, setSelectedValue }: SegmentedControlProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>(Array(options.length).fill(0));

  const handleClick = (item: string, rowIndex: number, colIndex: number) => {
    setSelectedValue && setSelectedValue(item);
    setSelectedIndices((prev) => {
      const updated = [...prev];
      updated[rowIndex] = colIndex;

      return updated;
    });
  };

  return (
    <div className={styles.container}>
      {options.map((row, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {row.map((item, colIndex) => {
            const shouldHaveBorder =
              colIndex > 0 &&
              colIndex !== selectedIndices[rowIndex] &&
              colIndex !== selectedIndices[rowIndex] + 1;

            const borderClass = shouldHaveBorder ? styles.borderLeft : '';

            return (
              <div className={borderClass} key={colIndex}>
                <Button
                  variant="tertiary"
                  className={`${styles.cell} ${
                    selectedIndices[rowIndex] === colIndex ? styles.selected : ''
                  }`}
                  onClick={() => handleClick(item.value, rowIndex, colIndex)}
                  id={`button-segmented-control-${rowIndex}-${colIndex}`}
                >
                  {item.label}
                </Button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
