import React from 'react';

import CalendarIcon from '@/core/assets/icons/icon-calendar.svg';

import styles from '../DatePicker.module.css';

/**
 * Props for the {@link Picker} component.
 *
 * @property date - The current date string to display in the input.
 * @property handleSelect - Callback to open or toggle the calendar.
 * @property handleInputChange - Callback for input value changes.
 * @property isCalendarVisible - Whether the calendar popover is visible.
 * @property placeholder - Placeholder text for the input field.
 * @property disabled - Whether the picker is disabled.
 */
interface PickerProps {
  date: string;
  handleSelect: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCalendarVisible: boolean;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Picker component for date selection input and calendar toggle.
 *
 * Renders a text input for manual date entry and a calendar icon to open the calendar popover.
 * Supports accessibility, keyboard navigation, and disabled state.
 *
 * @param props.date - The current date string to display.
 * @param props.handleSelect - Callback to open/toggle the calendar.
 * @param props.handleInputChange - Callback for input changes.
 * @param props.isCalendarVisible - Whether the calendar is visible.
 * @param props.placeholder - Placeholder text for the input.
 * @param props.disabled - Whether the picker is disabled.
 *
 * @example
 * <Picker
 *   date="01. 01. 2025"
 *   handleSelect={openCalendar}
 *   handleInputChange={onInputChange}
 *   isCalendarVisible={true}
 * />
 */
export const Picker = ({
  date,
  handleSelect,
  handleInputChange,
  isCalendarVisible,
  placeholder = 'dd. mm. rrrr',
  disabled = false,
}: PickerProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const charCode = e.charCode;
    if (charCode === 13 || charCode === 32) {
      handleSelect();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter') {
      handleSelect();
    }
  };

  const handleIconClick = () => {
    if (disabled) return;
    handleSelect();
  };

  return (
    <div
      className={`${styles.picker} ${disabled ? styles.disabled : ''}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyPress}
      role="button"
      aria-label="Datepicker"
      data-testid="date-input"
      aria-expanded={isCalendarVisible}
    >
      <input
        type="text"
        value={date}
        className={styles.dateContainer}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      <CalendarIcon
        id="icon-picker-calendar"
        onClick={handleIconClick}
        onKeyDown={handleKeyDown}
        width={24}
        height={24}
        data-testid="calendar-icon"
        tabIndex={disabled ? -1 : 0}
        style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}
      />
    </div>
  );
};
