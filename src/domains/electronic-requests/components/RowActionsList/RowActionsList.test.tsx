import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { render, screen } from '@/core/tests/test-utils';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));

import { RowActionsList } from '.';

const onItemSelect = jest.fn();

jest.mock('@/providers/context', () => ({
  useAppContext: jest.fn(),
}));

describe('RowActionsList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    queryClient.clear();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider
          locale="en"
          messages={{
            requests: {
              title: 'Requests',
              actions: {
                approve: 'Approve',
                reject: 'Reject',
                cancel: 'Cancel',
              },
              approver: {
                header: {
                  outOfOffice: 'Out of Office',
                },
              },
              requestDetail: {
                tabs: {
                  items: {
                    tableRowActions: {
                      showDetails: 'Show Details',
                      deleteItem: 'Delete Item',
                      createNewItem: 'Create New Item',
                      viewDetail: 'View Detail',
                      edit: 'Edit',
                      delete: 'Delete',
                    },
                  },
                },
              },
            },
          }}
        >
          {component}
        </NextIntlClientProvider>
      </QueryClientProvider>,
    );
  };

  it('renders the component', () => {
    renderWithProviders(<RowActionsList onItemSelect={onItemSelect} />);

    const rowActionsList = screen.getByTestId('actions-list-test');
    expect(rowActionsList).toBeInTheDocument();
  });
});
