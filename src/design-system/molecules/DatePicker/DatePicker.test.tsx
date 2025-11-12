import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/cs.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { DatePicker } from './DatePicker';

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(() => '2024.10.15'),
}));

const renderWithProviders = (component: ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <FeedBackHubProvider>{component}</FeedBackHubProvider>
    </NextIntlClientProvider>,
  );
describe('DatePicker', () => {
  it('should render the Picker initially', () => {
    renderWithProviders(<DatePicker id="datepicker-inital" />);

    const dateInput = screen.getByTestId('date-input');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
  });

  it('should open the Calendar when Picker is clicked', () => {
    renderWithProviders(<DatePicker id="datepicker-clicked" />);

    // Click to toggle the Calendar open
    const pickerButton = screen.getByTestId('calendar-icon');
    fireEvent.click(pickerButton);

    // Check if the Calendar is rendered
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('should select a date and close the Calendar', () => {
    const handleChange = jest.fn();
    renderWithProviders(<DatePicker id="datepicker-select-close" onDateChange={handleChange} />);

    const pickerButton = screen.getByTestId('calendar-icon');
    const dateInput = screen.getByTestId('date-input');

    fireEvent.click(pickerButton);

    const dayToSelect = screen.getByText('15');
    fireEvent.click(dayToSelect);

    // Ensure the Calendar is now closed and the selected date is displayed in the Picker

    // Verify the displayed date in the input
    expect(dateInput).toHaveValue;
  });
});
