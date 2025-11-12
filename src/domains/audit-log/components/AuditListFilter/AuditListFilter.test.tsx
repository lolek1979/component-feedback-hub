import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { isEqualDates } from '../AuditTable/utils/AuditTableUtils';
import { AuditListFilterProps } from './types/FilterChange';
import { AuditListFilter } from './AuditListFilter';

jest.mock('@/api/services/getAllUsers', () => ({
  fetchAllUsers: jest.fn().mockResolvedValue({
    value: [{ id: '123', displayName: 'Test User' }],
    '@odata.nextLink': null,
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('AuditListFilter', () => {
  const defaultProps: AuditListFilterProps = {
    initialFromDate: null,
    initialToDate: null,
    idOrEntityIdOrSessionId: '',
    initialIdentityId: '',
    initialSuccess: '-',
    onFilterChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //
  const renderWithProviders = (ui: React.ReactElement<any>) => {
    return render(<FeedBackHubProvider>{ui}</FeedBackHubProvider>);
  };

  it('renders correctly', async () => {
    renderWithProviders(<AuditListFilter {...defaultProps} />);
    await act(async () => {
      expect(screen.getByText('success')).toBeInTheDocument();
      expect(screen.getByText('identityId')).toBeInTheDocument();
      expect(screen.getByText('idOrEntityOrSession')).toBeInTheDocument();
      expect(screen.getByText('to')).toBeInTheDocument();
      expect(screen.getByText('from')).toBeInTheDocument();
    });
  });

  it('calls onFilterChange when idOrEntityIdOrSessionId is changed', async () => {
    renderWithProviders(<AuditListFilter {...defaultProps} />);

    const input = screen.getByPlaceholderText('idOrEntityOrSession');

    fireEvent.change(input, { target: { value: 'entity123' } });

    await waitFor(() => {
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ idOrEntityIdOrSessionId: 'entity123' }),
      );
    });
  });

  it('renders correctly with initialFromDate and value initial value is set correctly', async () => {
    const testDate = new Date('1.1.2023');

    renderWithProviders(<AuditListFilter {...defaultProps} initialFromDate={testDate} />);

    const input = screen.getByPlaceholderText('from') as HTMLInputElement;

    await waitFor(() => {
      expect(isEqualDates(new Date(input.value), new Date('1.1.2023'))).toBe(true);
    });
  });

  it('test the util function isEqualDates', () => {
    expect(isEqualDates(null, null)).toBe(true);

    expect(isEqualDates(null, undefined)).toBe(false);

    expect(isEqualDates(new Date('1.1.2022'), null)).toBe(false);
  });
});
