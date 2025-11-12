import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';

import { KdpResultHeader } from './KdpResultHeader';

import '@testing-library/jest-dom';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );

describe('KdpResultHeader', () => {
  it('renders the name if provided', () => {
    renderWithIntl(<KdpResultHeader name="John Doe" insuranceNum="12345" />);
    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toBeInTheDocument();
  });

  it('renders the insurance number', () => {
    renderWithIntl(<KdpResultHeader insuranceNum="12345" />);
    const insuranceNumElement = screen.getByText(/Číslo pojištěnce: 12345/);
    expect(insuranceNumElement).toBeInTheDocument();
  });

  it('displays the loading skeleton when isLoading is true', () => {
    renderWithIntl(<KdpResultHeader insuranceNum="12345" isLoading />);
    const skeletons = screen.getAllByTestId('skeleton');

    expect(skeletons).toHaveLength(2);
  });

  it('displays limit information when hasToPayTotal > 0', () => {
    renderWithIntl(<KdpResultHeader insuranceNum="12345" hasToPayTotal={500} limit={500} />);
    const limitElement = screen.getByText(/ 500,00 Kč/);
    expect(limitElement).toBeInTheDocument();
  });

  it('renders "Limit dosažen" badge when hasToPayTotal is 0', () => {
    renderWithIntl(<KdpResultHeader insuranceNum="12345" hasToPayTotal={0} limit={500} />);
    const badgeElement = screen.getByText('Limit dosažen');
    expect(badgeElement).toBeInTheDocument();
  });
});
