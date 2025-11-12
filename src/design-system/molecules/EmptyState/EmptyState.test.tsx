import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { EmptyState } from '.';

const queryClient = new QueryClient();

const defaultProps = {
  title: 'No Data Found',
  description: 'Try adjusting your filters or add new items.',
  icon: <span data-testid="empty-state-icon" />,
  btnPrimText: 'Add Item',
  onPrimaryAction: jest.fn(),
};
const mockMessages = {
  EmptyState: {
    Bugbtn: 'Bugbtn',
  },
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        {component}
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
};
jest.mock('nuqs');
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));
const setupPortalRoot = () => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(portalRoot);

  return portalRoot;
};
jest.mock('nuqs');
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));
describe('EmptyState', () => {
  let portalRoot: HTMLElement;
  const mockSetBugReportVisible = jest.fn().mockResolvedValue(undefined);
  const mockSetCaptureScreenshot = jest.fn().mockResolvedValue(undefined);
  beforeEach(() => {
    jest.clearAllMocks();
    portalRoot = setupPortalRoot();

    (useQueryState as jest.Mock).mockImplementation((param: string) => {
      if (param === 'bugReport') {
        return [true, mockSetBugReportVisible];
      }
      if (param === 'captureScreenshot') {
        return [false, mockSetCaptureScreenshot];
      }

      return [false, jest.fn()];
    });
  });

  afterEach(() => {
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });
  it('should render the heading', () => {
    renderWithIntl(<EmptyState {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /No Data Found/i })).toBeInTheDocument();
  });

  it('should render the description', () => {
    renderWithIntl(<EmptyState {...defaultProps} />);
    expect(screen.getByText(/Try adjusting your filters or add new items./i)).toBeInTheDocument();
  });

  it('should render the icon', () => {
    renderWithIntl(<EmptyState {...defaultProps} />);
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
  });

  it('should render the primary button with correct text', () => {
    renderWithIntl(<EmptyState {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
  });

  it('should call onPrimaryAction when primary button is clicked', () => {
    renderWithIntl(<EmptyState {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));
    expect(defaultProps.onPrimaryAction).toHaveBeenCalled();
  });

  it('should render the secondary button if btnScndText and onSecondaryAction are provided', () => {
    const onSecondaryAction = jest.fn();
    renderWithIntl(
      <EmptyState {...defaultProps} btnScndText="Cancel" onSecondaryAction={onSecondaryAction} />,
    );
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('should call onSecondaryAction when secondary button is clicked', () => {
    const onSecondaryAction = jest.fn();
    renderWithIntl(
      <EmptyState {...defaultProps} btnScndText="Cancel" onSecondaryAction={onSecondaryAction} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onSecondaryAction).toHaveBeenCalled();
  });

  it('should render bug report button if bugReport is true', () => {
    renderWithIntl(<EmptyState {...defaultProps} bugReport />);
    expect(screen.getByRole('button', { name: /Bugbtn/i })).toBeInTheDocument();
  });
});
