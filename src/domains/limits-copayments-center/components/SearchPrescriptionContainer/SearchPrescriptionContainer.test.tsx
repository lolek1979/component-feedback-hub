import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeesPagePDFProps } from 'src/domains/limits-copayments-center/components/FeesPagePDF';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { SearchPrescriptionContainer } from './SearchPrescriptionContainer';

// Mock the translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'orientation.portrait': 'Na výšku',
      'orientation.landscape': 'Na šířku',
    };

    return translations[key] || key;
  },
}));

const mockTranslations = {
  t: (key: string) => key,
  tKDPResultHeader: (key: string) => key,
  tTable: (key: string) => key,
};

const mockFeesPageProps: FeesPagePDFProps = {
  suklLimits: undefined,
  suklLimitsName: 'Test Name',
  hasToPayTotal: 100,
  limit: 200,
  period: '2024-01',
  insuranceNum: '123456789',
  translations: mockTranslations,
  suklData: {
    '2024-01': {
      monthLimit: 200,
      monthTables: [],
      beforeMonthLimit: null,
    },
  },
  downloadDate: '2024-01-01',
  year: 0,
  sumInsuer: 0,
  sumVZP: 0,
};

jest.mock('@react-pdf/renderer', () => {
  const originalModule = jest.requireActual('@react-pdf/renderer');

  return {
    ...originalModule,
    PDFDownloadLink: jest.fn(({ children }: any) => children({ loading: false })),
    Font: {
      register: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn(() => ({})),
    },
  };
});

describe('SearchPrescriptionContainer', () => {
  const defaultProps = {
    selectedYear: '2024',
    selectedMonth: '1',
    searchQuery: '',
    onYearChange: jest.fn(),
    onMonthChange: jest.fn(),
    onSearchChange: jest.fn(),
    onDownload: jest.fn(),
    onPrint: jest.fn(),
    isLoading: false,
    showDetails: false,
    onShowDetailsChange: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <FeedBackHubProvider>
        <SearchPrescriptionContainer
          feesPageProps={mockFeesPageProps}
          {...defaultProps}
          {...props}
        />
      </FeedBackHubProvider>,
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('calls onDownload when download button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const downloadButton = screen.getByRole('button', { name: 'downloadPDF' });
    await user.click(downloadButton);
    expect(defaultProps.onDownload).toHaveBeenCalled();
  });

  it('calls onPrint with correct orientation when print menu options are clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Click print button to open menu
    const printButton = screen.getByRole('button', { name: 'print' });
    await user.click(printButton);

    // Click portrait option
    const portraitButton = screen.getByText('Na výšku');
    await user.click(portraitButton);
    expect(defaultProps.onPrint).toHaveBeenCalledWith('portrait');

    // Reset and test landscape option
    jest.clearAllMocks();
    await user.click(printButton);
    const landscapeButton = screen.getByText('Na šířku');
    await user.click(landscapeButton);
    expect(defaultProps.onPrint).toHaveBeenCalledWith('landscape');
  });

  it('handles search input changes and form submission', async () => {
    const user = userEvent.setup();
    renderComponent();
    const searchInput = screen.getByRole('searchbox');
    const searchIcon = screen.getByRole('button', { name: 'search' });

    await user.type(searchInput, 'test search');
    await user.click(searchIcon);

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test search');
  });
});
