import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isEqual,
  isSameMonth,
  isToday,
  setDate,
  setYear,
  startOfMonth,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { cs } from 'date-fns/locale';
import { chunk } from 'lodash';

import LeftArrow from '@/core/assets/icons/chevron_left.svg';
import RightArrow from '@/core/assets/icons/chevron_right.svg';
import { Divider, Text } from '@/design-system/atoms';

import styles from '../DatePicker.module.css';

/**
 * Props for the {@link Calendar} component.
 *
 * @property id - Unique identifier for the calendar.
 * @property date - The currently selected date.
 * @property handleSelectDate - Callback when a date is selected.
 * @property closeCalendar - Callback to close the calendar.
 * @property minDate - Minimum year allowed for selection.
 * @property popoverCalendar - Whether to use popover styling for the calendar.
 */
interface CalendarProps {
  id: string;
  date: Date;
  handleSelectDate: (date: Date) => void;
  closeCalendar: () => void;
  minDate: number;
  popoverCalendar?: boolean;
}

const MONTHS_NUMS = 12;

/**
 * Calendar component for selecting a date within a month view.
 *
 * Supports keyboard navigation, year picker, Czech localization, and minimum year restriction.
 *
 * @param props.id - Unique identifier for the calendar.
 * @param props.date - The currently selected date.
 * @param props.handleSelectDate - Callback when a date is selected.
 * @param props.closeCalendar - Callback to close the calendar.
 * @param props.minDate - Minimum year allowed for selection.
 * @param props.popoverCalendar - Whether to use popover styling.
 *
 * @example
 * <Calendar
 *   id="calendar-1"
 *   date={new Date()}
 *   handleSelectDate={handleDate}
 *   closeCalendar={closeCalendar}
 *   minDate={2020}
 * />
 */
export const Calendar = ({
  id,
  date,
  handleSelectDate,
  closeCalendar,
  minDate,
  popoverCalendar = false,
}: CalendarProps) => {
  const tDates = useTranslations('common.dates');
  const tDays = useTranslations('common.dates.days');

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearRangeStart, setYearRangeStart] = useState(minDate);

  /**
   * Sets the selected date to the previous month.
   */
  const setPreviousMonth = () => {
    const previousMonth = subMonths(selectedDate, 1);
    if (previousMonth.getFullYear() >= minDate) {
      setSelectedDate(startOfMonth(previousMonth));
    }
  };

  /**
   * Checks if the previous month is disabled based on minDate.
   *
   * @returns True if previous month is disabled.
   */
  const isPreviousMonthDisabled = () => {
    const previousMonth = subMonths(selectedDate, 1);

    return previousMonth.getFullYear() < minDate;
  };

  /**
   * Sets the selected date to the next month.
   */
  const setNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(startOfMonth(nextMonth));
  };

  /**
   * Handles key press events for navigation and selection.
   *
   * @param e - Keyboard event.
   * @param cb - Callback to execute on Enter/Space.
   */
  const handleKeyPress = (e: React.KeyboardEvent, cb: () => void) => {
    const charCode = e.charCode;
    if (charCode === 13 || charCode === 32) {
      cb();
    }
  };

  /**
   * Renders a calendar date cell.
   *
   * @param date - Date to render.
   * @param index - Index of the day in the week.
   * @param weekIndex - Index of the week.
   * @returns Table cell element.
   */
  const renderCalendarDate = (date: Date, index: number, weekIndex: number) => {
    const isCurrentMonth = isSameMonth(date, selectedDate);
    const isSelected = isEqual(date, selectedDate);
    const handleClick = () => handleDateSelection(date);
    const isTodayDate = isToday(date);

    const className = `${isCurrentMonth ? styles.cell : styles.outOfMonthDay} ${isSelected ? styles.selectedDay : ''} ${isTodayDate ? styles.today : ''}`;

    return (
      <td
        key={index}
        className={className}
        id={'week-' + weekIndex + '-day-' + getDate(date) + '-' + index}
        onClick={handleClick}
        role="gridcell"
        aria-selected={isSelected}
      >
        <Text variant="caption" regular={!isTodayDate || !isSelected}>
          {getDate(date)}
        </Text>
      </td>
    );
  };

  // Generate month options in Czech language
  const months = Array.from({ length: MONTHS_NUMS }, (_, i) => {
    const month = format(new Date(0, i), 'LLLL', { locale: cs });

    return month.charAt(0).toUpperCase() + month.slice(1);
  });

  /**
   * Generates the calendar grid for the current month.
   *
   * @returns Array of weeks, each containing date objects.
   */
  const generateMonth = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const startOfCurrentMonth = startOfMonth(selectedDate);
    const endOfCurrentMonth = endOfMonth(selectedDate);
    const startWeekday = (getDay(startOfCurrentMonth) + 6) % 7;
    const endWeekday = (getDay(endOfCurrentMonth) + 6) % 7;

    // Get dates from the previous month to fill the start of the grid
    const previousMonthDays = Array.from({ length: startWeekday }).map((_, index) => {
      return subDays(startOfCurrentMonth, startWeekday - index);
    });

    // Get dates from the current month
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) =>
      setDate(selectedDate, i + 1),
    );

    // Get dates from the next month to fill the end of the grid
    const nextMonthDays = Array.from({ length: 6 - endWeekday }).map((_, index) => {
      return addDays(endOfCurrentMonth, index + 1);
    });

    // Combine the previous, current, and next month days
    return chunk([...previousMonthDays, ...currentMonthDays, ...nextMonthDays], 7);
  };

  /**
   * Handles key press events for the calendar table.
   *
   * @param e - Keyboard event.
   */
  const handleTableKeyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.keyCode;
    const control = e.shiftKey;
    switch (keyCode) {
      case 13: // Enter
      case 32: // Space
        handleDateSelection(selectedDate);

        return;
      case 27: // Esc
        closeCalendar();

        return;
      case 33: // Page Up
        control
          ? setSelectedDate(subYears(selectedDate, 1))
          : setSelectedDate(subMonths(selectedDate, 1));

        return;
      case 34: // Page Down
        control
          ? setSelectedDate(addYears(selectedDate, 1))
          : setSelectedDate(addMonths(selectedDate, 1));

        return;
      case 35: // End
        setSelectedDate(endOfMonth(selectedDate));

        return;
      case 36: // Home
        setSelectedDate(startOfMonth(selectedDate));

        return;
      case 37: // Left
        setSelectedDate(subDays(selectedDate, 1));

        return;
      case 38: // Up
        setSelectedDate(subWeeks(selectedDate, 1));

        return;
      case 39: // Right
        setSelectedDate(addDays(selectedDate, 1));

        return;
      case 40: // Down
        setSelectedDate(addWeeks(selectedDate, 1));

        return;
      default:
        return;
    }
  };

  /**
   * Handles selection of a date.
   *
   * @param date - The selected date.
   */
  const handleDateSelection = (date: Date) => {
    handleSelectDate(date);
  };

  /**
   * Checks if a date is disabled based on minDate.
   *
   * @param date - Date to check.
   * @returns True if date is disabled.
   */
  const isDateDisabled = (date: Date) => {
    if (minDate) {
      return date < new Date(minDate, 0, 1);
    }

    return false;
  };

  return (
    <>
      <div
        className={`${styles.calendar} ${popoverCalendar && styles.popover} primary-shadow`}
        data-testid="calendar"
        id={id}
      >
        <div className={styles.title}>
          <div
            className={`${styles.icons} ${isPreviousMonthDisabled() ? styles.disabled : ''}`}
            onClick={setPreviousMonth}
          >
            <div
              tabIndex={isPreviousMonthDisabled() ? -1 : 0}
              onKeyDown={(e) => !isPreviousMonthDisabled() && handleKeyPress(e, setPreviousMonth)}
              role="button"
              aria-label={tDates('previousMonth')}
              aria-disabled={isPreviousMonthDisabled()}
            >
              <LeftArrow id="icon-calendar-arrow-left" />
            </div>
          </div>
          <div className={styles.dateSelector}>
            <div className={styles.month}>
              <Text variant="subtitle" regular>
                {months[selectedDate.getMonth()]}
              </Text>
            </div>
            <div className={styles.year} onClick={() => setShowYearPicker(true)}>
              <Text variant="subtitle" underline style={{ cursor: 'pointer' }}>
                {selectedDate.getFullYear()}
              </Text>
            </div>
          </div>
          <div className={styles.icons} onClick={setNextMonth}>
            <div
              tabIndex={0}
              onKeyDown={(e) => handleKeyPress(e, setNextMonth)}
              role="button"
              aria-label={tDates('nextMonth')}
            >
              <RightArrow id="icon-calendar-arrow-right" />
            </div>
          </div>
        </div>
        <Divider />

        <table
          id="grid"
          className={styles.calendarGrid}
          tabIndex={0}
          role="grid"
          aria-label={tDates('month')}
          onKeyDown={handleTableKeyPress}
        >
          <thead>
            <tr role="row">
              <th role="columnheader" aria-label={tDays('monday')}>
                <Text variant="subtitle" selectable={false}>
                  Po
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('tuesday')}>
                <Text variant="subtitle" selectable={false}>
                  Út
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('wednesday')}>
                <Text variant="subtitle" selectable={false}>
                  St
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('thursday')}>
                <Text variant="subtitle" selectable={false}>
                  Čt
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('friday')}>
                <Text variant="subtitle" selectable={false}>
                  Pá
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('saturday')}>
                <Text variant="subtitle" selectable={false}>
                  So
                </Text>
              </th>
              <th role="columnheader" aria-label={tDays('sunday')}>
                <Text variant="subtitle" selectable={false}>
                  Ne
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {generateMonth().map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  if (isDateDisabled(day)) {
                    return (
                      <td key={dayIndex} className={styles.outOfMonthDay} role="gridcell">
                        {getDate(day)}
                      </td>
                    );
                  }

                  return renderCalendarDate(day, dayIndex, weekIndex);
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showYearPicker && (
        <div className={`${styles.yearPickerPopup} primary-shadow`}>
          <div className={styles.yearPickerHeader}>
            <div className={styles.icons} onClick={() => setYearRangeStart(yearRangeStart - 20)}>
              <LeftArrow id="icon-calendar-arrow-left" />
            </div>
            <Text variant="subtitle" regular>
              {yearRangeStart} - {yearRangeStart + 19}
            </Text>
            <div className={styles.icons} onClick={() => setYearRangeStart(yearRangeStart + 20)}>
              <RightArrow id="icon-calendar-arrow-right" />
            </div>
          </div>
          <Divider />

          <div className={styles.yearGrid}>
            {Array.from({ length: 20 }, (_, i) => yearRangeStart + i).map((year) => {
              const isSelected = year === selectedDate.getFullYear();
              const isCurrentYear = year === new Date().getFullYear();

              return (
                <div
                  key={year}
                  className={`${styles.yearCell} ${isSelected ? styles.selectedYear : ''} ${isCurrentYear ? styles.today : ''}`}
                  onClick={() => {
                    setSelectedDate(setYear(selectedDate, year));
                    setShowYearPicker(false);
                  }}
                >
                  <Text variant="subtitle" regular>
                    {year}
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
