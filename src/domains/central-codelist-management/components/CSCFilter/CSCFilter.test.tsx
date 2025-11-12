import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import messages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { CSCFilter } from './CSCFilter';

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <FeedBackHubProvider>
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    </FeedBackHubProvider>,
  );
};

describe('CSCFilter', () => {
  const mockOnFilterChange = jest.fn();
  const defaultProps = {
    types: [
      { value: 'Interní', label: 'Interní' },
      { value: 'Interní - Placený', label: 'Interní - Placený' },
    ],
    states: [
      { value: 'Aktivní', label: 'Aktivní' },
      { value: 'Koncept', label: 'Koncept' },
    ],
    onFilterChange: mockOnFilterChange,
    showSubconceptsFilter: true,
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe('Rendering', () => {
    it('renders all filter components', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();

      // Check that multiselect buttons exist by their IDs
      expect(screen.getByRole('button', { name: /type/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /state/i })).toBeInTheDocument();
    });

    it('renders with default values', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      // Check that components exist
      expect(screen.getByRole('button', { name: /type/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /state/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('Interactions', () => {
    it('calls onFilterChange when search input changes', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test search' },
      });

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test search',
          types: [],
          states: [],
          showSubconcepts: false,
        }),
      );
    });

    it('calls onFilterChange when type select changes', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      // Find type multiselect by role and click it
      const typeSelect = screen.getByRole('button', { name: /type/i });
      fireEvent.click(typeSelect);

      // Find the option by role
      const option = screen.getByRole('option', { name: /Interní - Placený/i });
      fireEvent.click(option);

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          types: ['Interní - Placený'],
          states: [],
          showSubconcepts: false,
        }),
      );
    });

    it('calls onFilterChange when state select changes', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      // Find state multiselect by role and click it
      const stateSelect = screen.getByRole('button', { name: /state/i });
      fireEvent.click(stateSelect);

      // Find the option by role
      const option = screen.getByRole('option', { name: /Aktivní/i });
      fireEvent.click(option);

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          types: [],
          states: ['Aktivní'],
          showSubconcepts: false,
        }),
      );
    });

    it('calls onFilterChange when show subconcepts changes', () => {
      renderWithProvider(<CSCFilter {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          types: [],
          states: [],
          showSubconcepts: true,
        }),
      );
    });
  });
});
