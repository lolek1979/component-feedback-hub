import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/cs.json';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { render, screen } from '@/core/tests/test-utils';

import { ClientTable } from '.';

describe('ClientTable', () => {
  const renderWithIntl = (component: React.ReactNode) =>
    render(
      <NextIntlClientProvider locale="cs" messages={messages}>
        <UnsavedChangesProvider>{component}</UnsavedChangesProvider>
      </NextIntlClientProvider>,
    );
  const clientData = {
    firstName: 'Ondra',
    surname: 'Vašek',
    applicant: 'Pepa Dub',
    mobilePhone: '123456789',
    countryCode: 'CZ',
    email: 'pepa.vasek@vzp.cz',
    bankAccount: {
      accountNumber: '1234567890',
      bankCode: '0100',
    },
    address: {
      street: 'Vinohradská',
      city: 'Praha',
      zip: '13000',
      houseNumber: '12',
    },
    dataBox: 'abc1234',
  };

  it('should display the full name', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/Ondra/i)).toBeInTheDocument();
  });

  it('should display the applicant', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/Pepa Dub/i)).toBeInTheDocument();
  });

  it('should display the mobile phone number', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/CZ - 123456789/i)).toBeInTheDocument();
  });

  it('should display the email address', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/pepa.vasek@vzp.cz/i)).toBeInTheDocument();
  });

  it('should display the full address', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/Vinohradská 12, 13000 Praha/i)).toBeInTheDocument(); // Assuming formatted address
  });

  it('should display the data box ID', () => {
    renderWithIntl(<ClientTable data={clientData} />);
    expect(screen.getByText(/abc1234/i)).toBeInTheDocument();
  });
});
