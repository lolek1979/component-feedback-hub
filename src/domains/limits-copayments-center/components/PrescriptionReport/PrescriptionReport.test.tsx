import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { PrescriptionReport } from './PrescriptionReport';

// Mock useUserInfoStore to avoid state management issues in tests
jest.mock('../../stores/userInfoStore', () => ({
  useUserInfoStore: () => ({
    setUserInfo: jest.fn(),
  }),
}));

const mockProps = {
  patientName: 'Michal Novák',
  patientId: '1234567890',
  dateRange: '1. 1. 2024 - 31. 12. 2024',
  dataSource: 'Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv',
  limitAmount: 2000,
  transactions: [
    {
      date: '2024-12-17T14:24:00',
      receiptId: 'ERP-2024-00123',
      expenditureId: 'VYD-2024-98765',
      itemCode: 'LP-2024-54321',
      copayment: 300,
      paidByPatient: 0,
      paidByInsurance: 300,
      remainingLimit: null,
      items: [
        {
          itemCode: 'LP-2024-54321',
          copayment: 300,
          paidByPatient: 0,
          paidByInsurance: 300,
        },
      ],
    },
  ],
};

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <UnsavedChangesProvider>{ui}</UnsavedChangesProvider>
    </NextIntlClientProvider>,
  );
};

describe('PrescriptionReport', () => {
  it('renders patient information correctly', () => {
    renderWithProvider(<PrescriptionReport {...mockProps} />);

    expect(screen.getByText('Michal Novák')).toBeInTheDocument();
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
  });

  it('renders date range and data source', () => {
    renderWithProvider(<PrescriptionReport {...mockProps} />);

    expect(screen.getByText('1. 1. 2024 - 31. 12. 2024')).toBeInTheDocument();
    expect(
      screen.getByText('Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv'),
    ).toBeInTheDocument();
  });

  it('renders prescription header with formatted date', () => {
    renderWithProvider(<PrescriptionReport {...mockProps} />);

    expect(screen.getByText('17. 12. 2024 14:24')).toBeInTheDocument();
    expect(screen.getByText('eRecept ERP-2024-00123')).toBeInTheDocument();
  });

  it('renders limit message when limitAmount is provided', () => {
    renderWithProvider(<PrescriptionReport {...mockProps} />);

    expect(
      screen.getByText(/Byl dosažen limit doplatků hrazených pacientem 2 000,00 Kč/),
    ).toBeInTheDocument();
  });

  it('does not render limit message when limitAmount is 0', () => {
    const propsWithZeroLimit = { ...mockProps, limitAmount: 0 };
    renderWithProvider(<PrescriptionReport {...propsWithZeroLimit} />);

    expect(screen.queryByText(/Byl dosažen limit doplatků/)).not.toBeInTheDocument();
  });
});
