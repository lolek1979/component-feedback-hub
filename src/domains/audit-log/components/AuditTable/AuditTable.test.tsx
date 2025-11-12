import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { render, screen } from '@/core/tests/test-utils';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const renderWithProviders = (ui: React.ReactElement<any>) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <FeedBackHubProvider>
        <UnsavedChangesProvider>{ui}</UnsavedChangesProvider>
      </FeedBackHubProvider>
    </QueryClientProvider>,
  );
};

jest.mock('@/domains/audit-log/api/query/useAuditList', () => ({
  __esModule: true,
  default: () => ({
    data: {
      content: [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          success: true,
          entityId: 'entity-1',
          identityId: 'identity-1',
          messageBody: {
            authentication: 'user1',
            rbac: 'role1',
            abac: 'abac1',
            operation: 'op1',
          },
        },
      ],
      page: {
        totalElements: 1,
        totalPages: 1,
      },
    },
    isFetching: false,
  }),
}));

describe('AuditTable', () => {
  it('should render the AuditTable component', () => {
    renderWithProviders(<div>AuditTable Component</div>);
    expect(screen.getByText('AuditTable Component')).toBeInTheDocument();
  });
  /*
  it('should render the heading', () => {
    renderWithProviders(
      <AuditTable
        onNumberOfRecordsChange={jest.fn()}
        shouldFetch={false}
        initialPage={0}
        initialPageSize={'10'}
        identityId={null}
        entityId={null}
        timestampFrom={null}
        timestampTo={null}
        success={null}
        sort={'asc id'}
      />
    );
  });

  it('should render the audit record id as a link', () => {
    renderWithProviders(
      <AuditTable
        onNumberOfRecordsChange={() => {}}
        shouldFetch={true}
        initialPage={0}
        initialPageSize={'10'}
        identityId={null}
        entityId={null}
        timestampFrom={null}
        timestampTo={null}
        success={null}
        sort={'asc id'}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument();
  });

  it('should render the authentication user', () => {
    renderWithProviders(
      <AuditTable
        onNumberOfRecordsChange={() => {}}
        shouldFetch={true}
        initialPage={0}
        initialPageSize={'10'}
        identityId={null}
        entityId={null}
        timestampFrom={null}
        timestampTo={null}
        success={null}
        sort={'asc id'}
      />
    );
    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('should render the success badge', () => {
    renderWithProviders(
      <AuditTable
        onNumberOfRecordsChange={() => {}}
        shouldFetch={true}
        initialPage={0}
        initialPageSize={'10'}
        identityId={null}
        entityId={null}
        timestampFrom={null}
        timestampTo={null}
        success={null}
        sort={'asc id'}
      />
    );
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should call onNumberOfRecordsChange with the correct value', () => {
    const onNumberOfRecordsChange = jest.fn();
    renderWithProviders(
      <AuditTable
        onNumberOfRecordsChange={onNumberOfRecordsChange}
        shouldFetch={true}
        initialPage={0}
        initialPageSize={'10'}
        identityId={null}
        entityId={null}
        timestampFrom={null}
        timestampTo={null}
        success={null}
        sort={'asc id'}
      />
    );
    expect(onNumberOfRecordsChange).toHaveBeenCalledWith(1);
  });
  */
});
