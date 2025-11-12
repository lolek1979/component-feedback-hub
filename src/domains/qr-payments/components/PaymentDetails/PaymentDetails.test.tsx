import React from 'react';
import { render, screen } from '@testing-library/react';

import { PaymentDetails } from './PaymentDetails';
// Minimal mocks for dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/core/assets/icons/picture_as_pdf.svg', () => () => <svg data-testid="pdf-icon" />);
jest.mock('@/design-system/atoms', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Divider: () => <hr data-testid="divider" />,
  Text: ({ children }: any) => <span>{children}</span>,
}));
jest.mock('../../stores/paymentStore', () => ({
  usePaymentDetailsStore: (cb: any) =>
    cb({
      rows: [
        { type: 'A', amount: '1', symbol: '$' },
        { type: 'B', amount: '2', symbol: '€' },
        { type: 'C', amount: '3', symbol: '£' },
      ],
      setRow: jest.fn(),
      removeRow: jest.fn(),
    }),
}));
jest.mock('./partials/PaymentRow', () => ({
  PaymentRow: ({ id }: any) => <div data-testid={id}>row</div>,
}));

describe('PaymentDetails', () => {
  it('renders three payment rows', () => {
    render(<PaymentDetails />);
    expect(screen.getByTestId('payment-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('payment-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('payment-row-2')).toBeInTheDocument();
  });
});
