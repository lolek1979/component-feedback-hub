'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { format, isValid, lastDayOfMonth } from 'date-fns';

import { Calendar } from './partials/Calendar';
import { Picker } from './partials/Picker';
import { RangeCalendar } from './partials/RangedCalendar';
import styles from './DatePicker.module.css';

/**
 * Props for the {@link DatePicker} component.
 *
 * @property id - Unique identifier for the date picker.
 * @property onDateChange - Callback when the date or range changes.
 * @property placeholder - Placeholder text for the input.
 * @property initialDate - Initial selected date.
 * @property minDate - Minimum year allowed for selection.
 * @property hasPopoverCalendar - Whether to use a popover calendar.
 * @property disabled - Whether the date picker is disabled.
 * @property rangeCalendar - Enables range selection mode.
 */
interface DatePickerProps {
  id: string;
  onDateChange?: (
    selectedDate: Date | null,
    range?: { startDate: Date | null; endDate: Date | null },
  ) => void;
  placeholder?: string;
  initialDate?: Date | null;
  minDate?: number;
  hasPopoverCalendar?: boolean;
  disabled?: boolean;
  rangeCalendar?: boolean;
}

/**
 * Date format used by the {@link DatePicker} component.
 */
export const DATE_FORMAT = 'dd. MM. yyyy';

/**
 * DatePicker component for selecting a single date or a date range.
 *
 * Supports popover calendar, range selection, input validation, and accessibility features.
 *
 * @example
 * <DatePicker
 *   id="dob"
 *   initialDate={new Date()}
 *   onDateChange={(date) => setDate(date)}
 *   placeholder="Select date"
 * />
 */
export const DatePicker = ({
  id,
  onDateChange,
  placeholder,
  initialDate,
  minDate = 2025,
  hasPopoverCalendar = false,
  disabled = false,
  rangeCalendar = false,
}: DatePickerProps) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState<string>(initialDate ? format(initialDate, DATE_FORMAT) : '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const calendarRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the calendar visibility.
   */
  const handleToggleCalendar = () => {
    if (disabled) return;
    setCalendarVisible((prev) => !prev);
  };

  /**
   * Handles selection of a single date.
   *
   * @param date - The selected date.
   */
  const handleSelectDate = (date: Date) => {
    if (disabled) return;
    setCalendarVisible(false);
    date.setHours(0, 0, 0, 0);
    const formattedDate = format(date, DATE_FORMAT);
    setDate(formattedDate);
    setSelectedDate(date);
    onDateChange && onDateChange(date);
  };

  const [range, setRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  /**
   * Validates and corrects the input date.
   *
   * @param day - Day value.
   * @param month - Month value.
   * @param year - Year value.
   * @returns The corrected Date object or null if invalid.
   */
  const validateAndCorrectDate = (day: number, month: number, year: number): Date | null => {
    const date = new Date(year, month - 1, day, 0, 0, 0, 0);

    if (!isValid(date)) {
      return null;
    }

    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return lastDayOfMonth(new Date(year, month - 2, day, 0, 0, 0, 0));
    }

    return date;
  };

  /**
   * Handles input change for manual date entry.
   *
   * @param event - The input change event.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    let inputValue = event.target.value.replace(/[^\d]/g, '');

    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2) + '. ' + inputValue.slice(2);
    }
    if (inputValue.length > 6) {
      inputValue = inputValue.slice(0, 6) + '. ' + inputValue.slice(6);
    }
    inputValue = inputValue.slice(0, 12);

    setDate(inputValue);

    const dateMatch = inputValue.match(/^(\d{2})[.\s]+(\d{2})[.\s]+(\d{4})$/);
    if (!dateMatch) {
      setSelectedDate(null);
      onDateChange && onDateChange(null);

      return;
    }

    const [, day, month, year] = dateMatch;
    const correctedDate = validateAndCorrectDate(parseInt(day), parseInt(month), parseInt(year));

    if (correctedDate) {
      const formattedDate = format(correctedDate, DATE_FORMAT);
      if (formattedDate !== inputValue) {
        setDate(formattedDate);
      }
      setSelectedDate(correctedDate);
      onDateChange && onDateChange(correctedDate);
    } else {
      setSelectedDate(null);
      onDateChange && onDateChange(null);
    }
  };

  /**
   * Handles selection of a date range.
   *
   * @param range - The selected date range.
   */
  const handleSelectRange = (range: { startDate: Date | null; endDate: Date | null }) => {
    if (disabled) return;
    setRange(range);

    if (range.startDate && range.endDate) {
      setCalendarVisible(false);
      const formatted =
        format(range.startDate, DATE_FORMAT) + ' - ' + format(range.endDate, DATE_FORMAT);
      setDate(formatted);
      setSelectedDate(range.startDate);
      onDateChange && onDateChange(null, range);
    } else if (range.startDate) {
      setDate(format(range.startDate, DATE_FORMAT));
      setSelectedDate(range.startDate);
      onDateChange && onDateChange(null, range);
    } else {
      setDate('');
      setSelectedDate(null);
      onDateChange && onDateChange(null);
    }
  };

  /**
   * Handles closing the calendar when clicking outside.
   *
   * @param event - Mouse event.
   */
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      const target = event.target as HTMLElement;
      const isModalCloseButton =
        target.closest('button[title="close"]') ||
        target.closest('#FormModalBtnClose') ||
        target.closest('#ModalCloseIcon');

      if (!isModalCloseButton) {
        setCalendarVisible(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isCalendarVisible) {
      document.addEventListener('mousedown', handleClickOutside, { capture: true });
    } else {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, [isCalendarVisible, handleClickOutside]);

  return (
    <div className={styles.datePicker} role="application" id={id}>
      <Picker
        date={date}
        handleSelect={handleToggleCalendar}
        handleInputChange={handleInputChange}
        isCalendarVisible={isCalendarVisible}
        placeholder={placeholder}
        disabled={disabled}
      />
      {isCalendarVisible && !disabled && !rangeCalendar && (
        <div ref={calendarRef} role="dialog">
          <Calendar
            id={`calendar-${id}`}
            date={selectedDate || new Date()}
            minDate={minDate}
            handleSelectDate={handleSelectDate}
            closeCalendar={() => setCalendarVisible(false)}
            popoverCalendar={hasPopoverCalendar}
          />
        </div>
      )}
      {isCalendarVisible && !disabled && rangeCalendar && (
        <div ref={calendarRef} role="dialog">
          <RangeCalendar
            id={`calendar-${id}`}
            date={selectedDate || new Date()}
            minDate={minDate}
            popoverCalendar={hasPopoverCalendar}
            handleSelectDate={handleSelectRange}
            closeCalendar={() => setCalendarVisible(false)}
            range={range}
          />
        </div>
      )}
    </div>
  );
};
