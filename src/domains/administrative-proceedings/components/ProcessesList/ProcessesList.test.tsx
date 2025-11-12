import { render, screen } from '@testing-library/react';

import { useAdminProcesses } from '../../api';
import { AdminProcessDto } from '../../api/services/getAdminProcesses';
import { DataTable } from './DataTable';
import { ProcessesList } from './ProcessesList';

// Mock dependencies
jest.mock('../../api');
jest.mock('@/providers/RolesProvider', () => ({
  useRoles: jest.fn(() => ({
    adminProceedingsReferent: true,
  })),
}));
jest.mock('@/design-system/organisms/DataTableSkeleton/DataTableSkeleton', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="data-table-skeleton" />),
}));
jest.mock('./DataTable', () => ({
  DataTable: jest.fn(() => <div data-testid="admin-processes-list-data-table" />),
}));
jest.mock('./ProcessListFilter', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="admin-process-list-filter" />),
}));
jest.mock('nuqs', () => ({
  useQueryState: jest.fn().mockImplementation(() => {
    return [undefined, jest.fn()];
  }),
}));

const mockTranslateFunction = jest.fn((key) => key);
jest.mock('next-intl', () => ({
  useTranslations: () => mockTranslateFunction,
}));

// Mock the InlineMessage component
jest.mock('@/design-system/molecules', () => ({
  InlineMessage: ({ id, message }: { id: string; message: string }) => (
    <div data-testid={id}>{message}</div>
  ),
}));

// Create a properly typed mock for useAdminProcesses
const mockUseAdminProcesses = useAdminProcesses as jest.MockedFunction<typeof useAdminProcesses>;
const mockUseRoles = jest.requireMock('@/providers/RolesProvider').useRoles;

// Define the complete return type to fix the TypeScript error
type UseAdminProcessCasesReturn = {
  data: AdminProcessDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<any>;
};

describe('ProcessesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoles.mockReturnValue({ adminProceedingsReferent: true });
    mockTranslateFunction.mockImplementation((key) => key);
  });

  it('should render skeleton when loading', () => {
    // @ts-ignore
    mockUseAdminProcesses.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn().mockResolvedValue({}),
    } as UseAdminProcessCasesReturn);

    render(<ProcessesList />);

    expect(screen.getByTestId('data-table-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-processes-list-data-table')).not.toBeInTheDocument();
  });

  it('should render data table when data is loaded', () => {
    const mockData = [
      {
        id: '1',
        number: 'A123',
        agenda: { code: 'ABC' },
        recordFolder: { number: 'R456' },
        insurancePayer: 'Company Inc',
        status: { code: 'DEMO_END' },
        dateResolutionDeadline: '2023-12-31',
        responsibleUsers: [{ id: 'user1', name: 'John Doe' }],
      },
      {
        id: '2',
        number: 'B456',
        agenda: { code: 'DEF' },
        recordFolder: { number: 'R789' },
        insurancePayer: 'Other Corp',
        status: { code: 'APPL_PROC' },
        dateResolutionDeadline: null,
        responsibleUsers: [],
      },
    ] as unknown as AdminProcessDto[];

    // @ts-ignore
    mockUseAdminProcesses.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn().mockResolvedValue({}),
    } as UseAdminProcessCasesReturn);

    render(<ProcessesList />);

    expect(screen.queryByTestId('data-table-skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-processes-list-data-table')).toBeInTheDocument();

    // Check the last call to DataTable (after data is loaded)
    const lastCall = (DataTable as jest.Mock).mock.calls[
      (DataTable as jest.Mock).mock.calls.length - 1
    ];
    expect(lastCall[0]).toEqual(
      expect.objectContaining({
        columns: expect.any(Array),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            agendaNumber: 'A123',
            agendaCode: 'ABC',
            recordNumber: 'R456',
            insurancePayer: 'Company Inc',
            status: 'DEMO_END',
            resolutionDeadline: '2023-12-31',
            responsibleUsers: [{ id: 'user1', name: 'John Doe' }],
            tStatusPrefix: expect.any(Function),
          }),
          expect.objectContaining({
            id: '2',
            agendaNumber: 'B456',
            agendaCode: 'DEF',
            recordNumber: 'R789',
            insurancePayer: 'Other Corp',
            status: 'APPL_PROC',
            resolutionDeadline: null,
            responsibleUsers: [],
            tStatusPrefix: expect.any(Function),
          }),
        ]),
      }),
    );
  });

  it('should handle empty data array', () => {
    // @ts-ignore
    mockUseAdminProcesses.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn().mockResolvedValue({}),
    } as UseAdminProcessCasesReturn);

    render(<ProcessesList />);

    expect(screen.getByTestId('admin-processes-list-data-table')).toBeInTheDocument();

    // Check the last call to DataTable
    const lastCall = (DataTable as jest.Mock).mock.calls[
      (DataTable as jest.Mock).mock.calls.length - 1
    ];
    expect(lastCall[0]).toEqual(
      expect.objectContaining({
        columns: expect.any(Array),
        data: [],
      }),
    );
  });

  it('should render inline message when user lacks required role', () => {
    mockUseRoles.mockReturnValue({ adminProceedingsReferent: false });

    // @ts-ignore
    mockUseAdminProcesses.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn().mockResolvedValue({}),
    } as UseAdminProcessCasesReturn);

    render(<ProcessesList />);

    expect(screen.getByTestId('inline-message-missing-role')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-processes-list-data-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('data-table-skeleton')).not.toBeInTheDocument();
  });
});
