import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';

import { MonthHeader } from './MonthHeader';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );

describe('MonthHeader', () => {
  it('should render the month and year', () => {
    renderWithIntl(<MonthHeader month="1" year="2023" limit={500} />);
    screen.getByRole('heading', { name: /Leden 2023/i });
  });

  it('should display the limit if limit is greater than 0', () => {
    renderWithIntl(<MonthHeader month="1" year="2023" limit={500} />);
    screen.getByText(/Nastavený limit 500,00 Kč/i);
  });

  it('should display the "limit reached" message if limit is 0', () => {
    renderWithIntl(
      <MonthHeader month="1" year="2023" isLimitReached={true} limit={0} limitTotal={1000} />,
    );
    screen.getByText(/Byl dosažen limit/i);
    screen.getByText(/1 000,00 Kč/i);
  });
});
