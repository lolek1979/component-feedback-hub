import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { SearchPrescriptionForm } from './SearchPrescriptionForm';

// Mock the translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('SearchPrescriptionForm', () => {
  const defaultProps = {
    selectedYear: '2024',
    selectedMonth: '1',
    searchQuery: '',
    onYearChange: jest.fn(),
    onMonthChange: jest.fn(),
    onSearchChange: jest.fn(),
  };

  const renderElement = (props = {}) => {
    const utils = render(
      <FeedBackHubProvider>
        <SearchPrescriptionForm {...defaultProps} {...props} />
      </FeedBackHubProvider>,
    );

    return { ...utils };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form elements', () => {
    renderElement();

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3); // 2 selects + 1 search icon
  });

  // TEMP - dont need enabled this select for now
  // it('handles year selection', async () => {
  //   setup();

  //   const yearSelect = screen.getByRole('button', { name: /2024/i });
  //   await userEvent.click(yearSelect);

  //   const yearOption = screen.getByRole('option', { name: '2023' });
  //   await userEvent.click(yearOption);

  //   expect(defaultProps.onYearChange).toHaveBeenCalledWith('2023');
  // });

  it('handles month selection', async () => {
    renderElement();

    const monthSelect = screen.getByRole('button', { name: /months.1/i });
    await userEvent.click(monthSelect);

    const monthOption = screen.getByRole('option', { name: 'months.2' });
    await userEvent.click(monthOption);

    expect(defaultProps.onMonthChange).toHaveBeenCalledWith('2');
  });

  it('displays the search query', () => {
    const searchQuery = 'test query';
    renderElement({ searchQuery });

    const searchInput = screen.getByRole('searchbox') as HTMLInputElement;
    expect(searchInput.value).toBe(searchQuery);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    renderElement({ className: customClass });

    expect(screen.getByRole('search')).toHaveClass(customClass);
  });
});
