import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { FeesPagePDFProps } from 'src/domains/limits-copayments-center/components/FeesPagePDF';

import messages from '@/core/messages/cs.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { render, screen } from '@/core/tests/test-utils';

import { DownloadPrintButtons } from './DownloadPrintButtons';

// Mock data for feesPageProps
const mockFeesPageProps: FeesPagePDFProps = {
  insuranceNum: '123456',
  suklLimits: undefined,
  suklLimitsName: undefined,
  hasToPayTotal: 100,
  limit: undefined,
  period: '2023-12',
  translations: {
    t: jest.fn((key) => key),
    tKDPResultHeader: jest.fn((key) => key),
    tTable: jest.fn((key) => key),
    tErrors: function (key: string): string {
      throw new Error('Function not implemented.');
    },
  },
  suklData: {},
  downloadDate: '',
  year: 0,
  sumInsuer: 0,
  sumVZP: 0,
};

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <FeedBackHubProvider>{ui}</FeedBackHubProvider>
    </NextIntlClientProvider>,
  );
};

describe('DownloadPrintButtons', () => {
  const mockProps = {
    onDownload: jest.fn(),
    onPrint: jest.fn(),
    feesPageProps: mockFeesPageProps,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both buttons', () => {
    renderWithProvider(<DownloadPrintButtons {...mockProps} />);

    expect(screen.getByText(messages.DownloadPrintButtons.downloadPDF)).toBeInTheDocument();
    expect(screen.getByText(messages.DownloadPrintButtons.print)).toBeInTheDocument();
  });

  it('calls onDownload when download button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DownloadPrintButtons {...mockProps} />);

    const downloadButton = screen.getByRole('button', {
      name: messages.DownloadPrintButtons.downloadPDF,
    });
    await user.click(downloadButton);

    expect(mockProps.onDownload).toHaveBeenCalledTimes(1);
  });

  it('calls onPrint with correct orientation when print menu options are clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DownloadPrintButtons {...mockProps} />);

    // Click print button to open menu
    const printButton = screen.getByRole('button', { name: messages.DownloadPrintButtons.print });
    await user.click(printButton);

    // Click portrait option
    const portraitButton = screen.getByText('Na výšku');
    await user.click(portraitButton);
    expect(mockProps.onPrint).toHaveBeenCalledWith('portrait');

    // Reset and test landscape option
    jest.clearAllMocks();
    await user.click(printButton);
    const landscapeButton = screen.getByText('Na šířku');
    await user.click(landscapeButton);
    expect(mockProps.onPrint).toHaveBeenCalledWith('landscape');
  });

  it('disables buttons when loading', () => {
    renderWithProvider(<DownloadPrintButtons {...mockProps} isLoading />);

    const downloadButton = screen.getByRole('button', {
      name: messages.DownloadPrintButtons.downloadPDF,
    });
    const printButton = screen.getByRole('button', { name: messages.DownloadPrintButtons.print });

    expect(downloadButton).toBeDisabled();
    expect(printButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    renderWithProvider(<DownloadPrintButtons {...mockProps} className={customClass} />);

    expect(screen.getByRole('group')).toHaveClass(customClass);
  });

  it('disables the download button when isDownloading is true', () => {
    renderWithProvider(<DownloadPrintButtons {...mockProps} isDownloading />);

    const downloadButton = screen.getByRole('button', {
      name: messages.DownloadPrintButtons.downloadPDF,
    });

    expect(downloadButton).toBeDisabled();
  });
});
