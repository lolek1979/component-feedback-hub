import { usePathname } from 'next/navigation';

import { render, screen } from '@/core/tests/test-utils';

import { ProcessHeader } from '.';

jest.mock('../../api', () => ({
  useAdminProcessById: jest.fn().mockReturnValue({
    data: {
      id: '12345',
      agenda: { code: 'AG-2023-001' },
      recordFolder: { number: 'REC-12345' },
      responsibleUsers: [{ id: 'user1', name: 'John Doe', email: 'john@example.com' }],
      insurancePayer: {
        id: 'payer1',
        name: 'Example Insurance Company',
        identificationNumber: '12345678',
      },
    },
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

// Mock the next-intl hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `${key}-translated`,
}));

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mock the useRoles hook from RolesProvider
jest.mock('@/providers/RolesProvider', () => ({
  useRoles: () => ({
    roles: ['admin'],
    permissions: [],
    hasRole: () => true,
    setRoles: () => {},
    setPermissions: () => {},
  }),
}));

// Mock the DetailHeader component
jest.mock('./DetailHeader/DetailHeader', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="admin-process-detail-header">Detail Header</div>),
}));

// Mock the CreateNewAdminProcessModal component
jest.mock('../CreateNewAdminProcessModal', () => ({
  __esModule: true,
  CreateNewAdminProcessModal: () => <div data-testid="create-new-admin-process-modal" />,
}));

const mockUseAdminProcessById = jest.requireMock('../../api').useAdminProcessById;

describe('ProcessHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the overview header when on the main admin process page', () => {
    // Mock the pathname to be the main admin proceedings page
    (usePathname as jest.Mock).mockReturnValue('/spravni-rizeni');

    render(<ProcessHeader />);

    // Assert the overview header is rendered
    expect(screen.getByTestId('admin-process-overview-header')).toBeInTheDocument();

    // Assert the DetailHeader is not rendered
    expect(screen.queryByTestId('admin-process-detail-header')).not.toBeInTheDocument();
  });

  it('should render the DetailHeader when on an admin process detail page', () => {
    // Mock the pathname to be a detail page with an ID
    const mockAdminProcessId = '12345';
    (usePathname as jest.Mock).mockReturnValue(`/spravni-rizeni/${mockAdminProcessId}`);

    mockUseAdminProcessById.mockReturnValue({
      data: {
        id: mockAdminProcessId,
        agenda: { code: 'AG-2023-001' },
        recordFolder: { number: 'REC-12345' },
        responsibleUsers: [{ id: 'user1', name: 'John Doe', email: 'john@example.com' }],
        insurancePayer: {
          id: 'payer1',
          name: 'Example Insurance Company',
          identificationNumber: '12345678',
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProcessHeader />);

    expect(screen.getByTestId('admin-process-detail-header')).toBeInTheDocument();

    // Assert the overview header is not rendered
    expect(screen.queryByTestId('admin-process-overview-header')).not.toBeInTheDocument();
  });

  it('should not render anything for unmatched routes', () => {
    // Mock an unrelated pathname
    (usePathname as jest.Mock).mockReturnValue('/some-other-path');

    render(<ProcessHeader />);

    // Assert neither header is rendered
    expect(screen.queryByTestId('admin-process-detail-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('admin-process-overview-header')).not.toBeInTheDocument();
  });
});
