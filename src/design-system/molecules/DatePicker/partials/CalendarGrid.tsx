import React from 'react';
import { getDate } from 'date-fns';

import { Text } from '@/design-system/atoms';

/**
 * Props for the {@link CalendarGrid} component.
 *
 * @property monthDate - The date representing the current month.
 * @property generateMonth - Function to generate a 2D array of dates for the month grid.
 * @property renderCalendarDate - Function to render a calendar date cell.
 * @property isDateDisabled - Function to determine if a date is disabled.
 * @property tDays - Translation function for day names.
 * @property styles - CSS module styles object.
 * @property tableId - Unique identifier for the table element.
 */
interface CalendarGridProps {
  monthDate: Date;
  generateMonth: (monthDate: Date) => Date[][];
  renderCalendarDate: (
    date: Date,
    index: number,
    weekIndex: number,
    monthDate: Date,
  ) => React.ReactNode;
  isDateDisabled: (date: Date) => boolean;
  tDays: any;
  styles: any;
  tableId: string;
}

/**
 * CalendarGrid component for rendering a month view table of dates.
 *
 * Displays a table with days of the week as headers and date cells for each day in the month.
 * Supports custom rendering and disabling of dates.
 *
 * @param props.monthDate - The date representing the current month.
 * @param props.generateMonth - Function to generate the month grid.
 * @param props.renderCalendarDate - Function to render each date cell.
 * @param props.isDateDisabled - Function to determine if a date is disabled.
 * @param props.tDays - Translation function for day names.
 * @param props.styles - CSS module styles object.
 * @param props.tableId - Unique identifier for the table element.
 *
 * @example
 * <CalendarGrid
 *   monthDate={new Date()}
 *   generateMonth={generateMonth}
 *   renderCalendarDate={renderCalendarDate}
 *   isDateDisabled={isDateDisabled}
 *   tDays={tDays}
 *   styles={styles}
 *   tableId="calendar-table"
 * />
 */
export const CalendarGrid = ({
  monthDate,
  generateMonth,
  renderCalendarDate,
  isDateDisabled,
  tDays,
  styles,
  tableId,
}: CalendarGridProps) => (
  <table id={tableId} className={styles.calendarGrid} tabIndex={0} role="grid" aria-label="month">
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
      {generateMonth(monthDate).map((week, weekIndex) => (
        <tr key={weekIndex}>
          {week.map((day, dayIndex) => {
            if (isDateDisabled(day)) {
              return (
                <td key={dayIndex} className={styles.outOfMonthDay} role="gridcell">
                  {getDate(day)}
                </td>
              );
            }

            return renderCalendarDate(day, dayIndex, weekIndex, monthDate);
          })}
        </tr>
      ))}
    </tbody>
  </table>
);
