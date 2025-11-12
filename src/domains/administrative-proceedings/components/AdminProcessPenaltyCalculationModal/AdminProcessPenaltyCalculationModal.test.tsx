import React from 'react';
import { render, screen } from '@testing-library/react';

import { AdminProcessPenaltyCalculationModal } from './AdminProcessPenaltyCalculationModal';

import '@testing-library/jest-dom';

// Mock next-intl hooks
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useFormatter: () => ({
    number: (value: number) => `${value}`,
  }),
}));

// Mock nuqs
jest.mock('nuqs', () => ({
  parseAsBoolean: {
    withDefault: jest.fn().mockReturnValue(jest.fn()),
  },
  parseAsFloat: {
    withDefault: jest.fn().mockReturnValue(jest.fn()),
  },
  useQueryState: jest.fn().mockReturnValue([false, jest.fn()]),
}));

describe('AdminProcessPenaltyCalculationModal', () => {
  const defaultProps = {
    insuranceDebt: 1000,
    penaltyDebt: 200,
  };

  test('renders modal button correctly', () => {
    render(<AdminProcessPenaltyCalculationModal {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
