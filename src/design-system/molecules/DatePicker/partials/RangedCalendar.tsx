'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  setDate,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { cs } from 'date-fns/locale';
import { chunk } from 'lodash';

import LeftArrow from '@/core/assets/icons/chevron_left.svg';
import RightArrow from '@/core/assets/icons/chevron_right.svg';
import { Divider, Text } from '@/design-system/atoms';

import styles from '../DatePicker.module.css';
import { CalendarGrid } from './CalendarGrid';

/**
 * Side type for the year picker in {@link RangeCalendar}.
 */
type YearPickerSide = 'left' | 'right' | null;

/**
 * Props for the {@link RangeCalendar} component.
 *
 * @property id - Unique identifier for the calendar.
 * @property date - The base date for the calendar.
 * @property handleSelectDate - Callback when a date range is selected.
 * @property closeCalendar - Callback to close the calendar.
 * @property minDate - Minimum year allowed for selection.
 * @property popoverCalendar - Whether to use popover styling for the calendar.
 * @property range - The currently selected date range.
 */
interface RangeCalendarProps {
  id: string;
  date: Date;
  handleSelectDate: (range: { startDate: Date | null; endDate: Date | null }) => void;
  closeCalendar: () => void;
  minDate: number;
  popoverCalendar?: boolean;
  range: { startDate: Date | null; endDate: Date | null };
}

/**
 * RangeCalendar component for selecting a date range across two months.
 *
 * Supports keyboard navigation, year picker, Czech localization, and minimum year restriction.
 * Displays two side-by-side month views for easier range selection.
 *
 * @param props.id - Unique identifier for the calendar.
 * @param props.date - The base date for the calendar.
 * @param props.handleSelectDate - Callback when a date range is selected.
 * @param props.closeCalendar - Callback to close the calendar.
 * @param props.minDate - Minimum year allowed for selection.
 * @param props.popoverCalendar - Whether to use popover styling.
 * @param props.range - The currently selected date range.
 *
 * @example
 * <RangeCalendar
 *   id="calendar-range"
 *   date={new Date()}
 *   handleSelectDate={handleRange}
 *   closeCalendar={closeCalendar}
 *   minDate={2020}
 *   range={{ startDate: null, endDate: null }}
 * />
 */
export const RangeCalendar = ({
  id,
  date,
  handleSelectDate,
  closeCalendar,
  minDate,
  popoverCalendar = false,
  range,
}: RangeCalendarProps) => {
  const tDates = useTranslations('common.dates');
  const tDays = useTranslations('common.dates.days');

  const [leftMonth, setLeftMonth] = useState<Date>(startOfMonth(date));
  const [rightMonth, setRightMonth] = useState<Date>(addMonths(startOfMonth(date), 1));
  const [showYearPicker, setShowYearPicker] = useState<YearPickerSide>(null);
  const [yearRangeStart, setYearRangeStart] = useState(minDate);

  /**
   * Checks if a day is within the selected range.
   *
   * @param day - Date to check.
   * @returns True if the day is in the range.
   */
  const isInRange = (day: Date) => {
    if (range.startDate && range.endDate) {
      return isWithinInterval(day, { start: range.startDate, end: range.endDate });
    }

    return false;
  };

  /**
   * Checks if a day is the start of the range.
   *
   * @param day - Date to check.
   * @returns True if the day is the range start.
   */
  const isRangeStart = (day: Date) => range.startDate && isSameDay(day, range.startDate);

  /**
   * Checks if a day is the end of the range.
   *
   * @param day - Date to check.
   * @returns True if the day is the range end.
   */
  const isRangeEnd = (day: Date) => range.endDate && isSameDay(day, range.endDate);

  /**
   * Sets the left and right months to the previous month.
   */
  const setPreviousMonth = () => {
    const prev = subMonths(leftMonth, 1);
    if (prev.getFullYear() >= minDate) {
      setLeftMonth(startOfMonth(prev));
      setRightMonth(startOfMonth(addMonths(prev, 1)));
    }
  };

  /**
   * Synchronizes the left and right months with the selected range.
   */
  const syncMonths = useCallback(() => {
    if (range.startDate && range.endDate) {
      setLeftMonth(startOfMonth(range.startDate));
      const nextMonth = addMonths(startOfMonth(range.startDate), 1);
      setRightMonth(range.endDate > nextMonth ? startOfMonth(range.endDate) : nextMonth);
    } else if (range.startDate) {
      setLeftMonth(startOfMonth(range.startDate));
      setRightMonth(addMonths(startOfMonth(range.startDate), 1));
    } else {
      setLeftMonth(startOfMonth(date));
      setRightMonth(addMonths(startOfMonth(date), 1));
    }
  }, [range.startDate, range.endDate, date]);

  useEffect(() => {
    syncMonths();
  }, [syncMonths]);

  /**
   * Sets the left and right months to the next month.
   */
  const setNextMonth = () => {
    const next = addMonths(rightMonth, 1);
    setRightMonth(startOfMonth(next));
    setLeftMonth(startOfMonth(subMonths(next, 1)));
  };

  /**
   * Checks if the previous month is disabled based on minDate.
   *
   * @returns True if previous month is disabled.
   */
  const isPreviousMonthDisabled = () => {
    const previousMonth = subMonths(leftMonth, 1);

    return previousMonth.getFullYear() < minDate;
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
   * Renders the year picker for the left or right calendar.
   *
   * @param side - Which side ('left' or 'right') to render.
   * @returns JSX for the year picker.
   */
  const renderYearPicker = (side: YearPickerSide) => {
    const currentMonth = side === 'left' ? leftMonth : rightMonth;

    return (
      <div>
        <div className={styles.yearPickerHeaderRanged}>
          <div
            role="button"
            className={styles.icons}
            onClick={() => setYearRangeStart(yearRangeStart - 20)}
          >
            <LeftArrow id="icon-calendar-arrow-left" />
          </div>
          <Text variant="subtitle" regular>
            {yearRangeStart} - {yearRangeStart + 19}
          </Text>
          <div
            role="button"
            className={styles.icons}
            onClick={() => setYearRangeStart(yearRangeStart + 20)}
          >
            <RightArrow id="icon-calendar-arrow-right" />
          </div>
        </div>
        <Divider />
        <div className={styles.yearGridRanged}>
          {Array.from({ length: 20 }, (_, i) => yearRangeStart + i).map((year) => {
            const isSelected = year === currentMonth.getFullYear();
            const isCurrentYear = year === new Date().getFullYear();

            return (
              <div
                key={year}
                role="button"
                className={`${styles.yearCell} ${isSelected ? styles.selectedYear : ''} ${isCurrentYear ? styles.today : ''}`}
                onClick={() => {
                  if (side === 'left') {
                    const newLeft = startOfMonth(new Date(year, leftMonth.getMonth(), 1));
                    setLeftMonth(newLeft);
                    if (!(rightMonth > newLeft)) {
                      setRightMonth(startOfMonth(addMonths(newLeft, 1)));
                    }
                  } else if (side === 'right') {
                    const newRight = startOfMonth(new Date(year, rightMonth.getMonth(), 1));
                    if (!(newRight > leftMonth)) {
                      const newLeft = startOfMonth(subMonths(newRight, 1));
                      setLeftMonth(newLeft);
                      setRightMonth(newRight);
                    } else {
                      setRightMonth(newRight);
                    }
                  }
                  setShowYearPicker(null);
                }}
              >
                <Text variant="caption" regular>
                  {year}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Handles click on a day cell to select a range.
   *
   * @param day - The clicked date.
   */
  const handleDayClick = (day: Date) => {
    if (!range.startDate || (range.startDate && range.endDate)) {
      handleSelectDate({ startDate: day, endDate: null });
    } else if (range.startDate && !range.endDate) {
      if (isBefore(day, range.startDate)) {
        handleSelectDate({ startDate: day, endDate: null });
      } else if (isSameDay(day, range.startDate)) {
        handleSelectDate({ startDate: day, endDate: day });
        closeCalendar();
      } else {
        handleSelectDate({ startDate: range.startDate, endDate: day });
        closeCalendar();
      }
    }
  };

  /**
   * Renders a calendar date cell for the range calendar.
   *
   * @param date - Date to render.
   * @param index - Index of the day in the week.
   * @param weekIndex - Index of the week.
   * @param monthDate - The month being rendered.
   * @returns Table cell element.
   */
  const renderCalendarDate = (date: Date, index: number, weekIndex: number, monthDate: Date) => {
    const isCurrentMonth = isSameMonth(date, monthDate);
    if (!isCurrentMonth) return <td key={`${date.toISOString()}-${weekIndex}-${index}`} />;

    const isSelected = isRangeStart(date) || isRangeEnd(date);
    const inRange = isInRange(date);
    const isTodayDate = isToday(date);

    let className = styles.cell + ' ';
    if (isSelected) className += styles.selectedDay + ' ';
    if (inRange && !isSelected) className += styles.inRange + ' ';
    if (isTodayDate) className += styles.today + ' ';

    return (
      <td
        key={`${date.toISOString()}-${weekIndex}-${index}`}
        className={className.trim()}
        id={`week-${weekIndex}-day-${date.toISOString()}`}
        onClick={() => handleDayClick(date)}
        role="gridcell"
        aria-selected={!!isSelected}
      >
        <Text variant="caption" regular={!isTodayDate || !isSelected}>
          {getDate(date)}
        </Text>
      </td>
    );
  };

  /**
   * Generates the calendar grid for a given month.
   *
   * @param monthDate - The month to generate.
   * @returns Array of weeks, each containing date objects.
   */
  const generateMonth = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const startOfCurrentMonth = startOfMonth(monthDate);
    const endOfCurrentMonth = endOfMonth(monthDate);
    const startWeekday = (getDay(startOfCurrentMonth) + 6) % 7;
    const endWeekday = (getDay(endOfCurrentMonth) + 6) % 7;

    const previousMonthDays = Array.from({ length: startWeekday }).map((_, index) => {
      return subDays(startOfCurrentMonth, startWeekday - index);
    });

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) =>
      setDate(monthDate, i + 1),
    );

    const nextMonthDays = Array.from({ length: 6 - endWeekday }).map((_, index) => {
      return addDays(endOfCurrentMonth, index + 1);
    });

    return chunk([...previousMonthDays, ...currentMonthDays, ...nextMonthDays], 7);
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

  // Generate month names in Czech language
  const MONTHS_NUMS = 12;
  const months = Array.from({ length: MONTHS_NUMS }, (_, i) => {
    const month = format(new Date(0, i), 'LLLL', { locale: cs });

    return month.charAt(0).toUpperCase() + month.slice(1);
  });

  return (
    <div
      className={`${styles.rangedCalendar} ${popoverCalendar && styles.popover} primary-shadow`}
      data-testid="calendar"
      id={id}
    >
      <div id={'wrapper-' + id} className={styles.wrapper}>
        <div id="left-ranged-calendar">
          {showYearPicker === 'left' ? (
            renderYearPicker('left')
          ) : (
            <>
              <div className={styles.rangedTitle}>
                <div
                  className={`${styles.icons} ${isPreviousMonthDisabled() ? styles.disabled : ''}`}
                  onClick={setPreviousMonth}
                  role="button"
                >
                  <div
                    tabIndex={isPreviousMonthDisabled() ? -1 : 0}
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
                      {months[leftMonth.getMonth()]}
                    </Text>
                  </div>
                  <div
                    role="button"
                    className={styles.year}
                    onClick={() => setShowYearPicker('left')}
                  >
                    <Text variant="subtitle" underline style={{ cursor: 'pointer' }}>
                      {leftMonth.getFullYear()}
                    </Text>
                  </div>
                </div>
                {showYearPicker === 'right' && (
                  <div className={styles.icons} role="button" onClick={setNextMonth}>
                    <div
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyPress(e, setNextMonth)}
                      role="button"
                      aria-label={tDates('nextMonth')}
                    >
                      <RightArrow id="icon-calendar-arrow-right" />
                    </div>
                  </div>
                )}
              </div>
              <Divider />

              <CalendarGrid
                monthDate={leftMonth}
                generateMonth={generateMonth}
                renderCalendarDate={renderCalendarDate}
                isDateDisabled={isDateDisabled}
                tDays={tDays}
                styles={styles}
                tableId="left-grid"
              />
            </>
          )}
        </div>

        <div id="right-ranged-calendar">
          {showYearPicker === 'right' ? (
            renderYearPicker('right')
          ) : (
            <>
              <div
                className={styles.rangedTitle}
                style={
                  !showYearPicker ? { justifyContent: 'end' } : { justifyContent: 'space-between' }
                }
              >
                {showYearPicker === 'left' && (
                  <div
                    role="button"
                    className={`${styles.icons} ${isPreviousMonthDisabled() ? styles.disabled : ''}`}
                    onClick={setPreviousMonth}
                  >
                    <div
                      tabIndex={isPreviousMonthDisabled() ? -1 : 0}
                      role="button"
                      aria-label={tDates('previousMonth')}
                      aria-disabled={isPreviousMonthDisabled()}
                    >
                      <LeftArrow id="icon-calendar-arrow-left" />
                    </div>
                  </div>
                )}
                <div className={styles.dateSelector}>
                  <div className={styles.month}>
                    <Text variant="subtitle" regular>
                      {months[rightMonth.getMonth()]}
                    </Text>
                  </div>
                  <div
                    className={styles.year}
                    role="button"
                    onClick={() => setShowYearPicker('right')}
                  >
                    <Text variant="subtitle" underline style={{ cursor: 'pointer' }}>
                      {rightMonth.getFullYear()}
                    </Text>
                  </div>
                </div>
                <div className={styles.icons} role="button" onClick={setNextMonth}>
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

              <CalendarGrid
                monthDate={rightMonth}
                generateMonth={generateMonth}
                renderCalendarDate={renderCalendarDate}
                isDateDisabled={isDateDisabled}
                tDays={tDays}
                styles={styles}
                tableId="right-grid"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
