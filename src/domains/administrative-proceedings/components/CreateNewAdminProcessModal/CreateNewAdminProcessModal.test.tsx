import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import * as rolesProvider from '@/core/providers/RolesProvider';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { GetAdminProcessAgendasResponse } from '../../api/services/getAdminProcessAgendas';
import * as queryHooks from '../../api/useAdminProcessAgendas';
import { CreateNewAdminProcessModal } from './CreateNewAdminProcessModal';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useMutation: jest.fn(),
}));

jest.mock('@/design-system/molecules/Toast/Toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    dismiss: jest.fn(),
  },
  Toast: jest.fn(() => null),
}));

jest.mock('nuqs', () => ({
  parseAsBoolean: {
    withDefault: jest.fn(() => ({})),
  },
  useQueryState: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('CreateNewAdminProcessModal', () => {
  const mockAgendas = [
    { code: '123', name: 'Agenda 1' },
    { code: '456', name: 'Agenda 2' },
  ];

  const mockMutate = jest.fn();

  // Simulate state for isModalOpen
  let isModalOpenState: boolean;
  let setIsModalOpenMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    isModalOpenState = false;
    setIsModalOpenMock = jest.fn((val) => {
      isModalOpenState = val;
    });

    // Mock useRoles
    jest.spyOn(rolesProvider, 'useRoles').mockReturnValue({
      adminProceedingsReferent: true,
      roles: [],
      hasRole: function (role: string): boolean {
        throw new Error('Function not implemented.');
      },
      cscEditor: false,
      cscPublisher: false,
      suklReader: false,
      cscReader: false,
      isLoadingRoles: false,
      adminProceedingsReader: false,
      requestsReader: false,
      requestsApprover: false,
      auditReader: false,
      pdfComparisonReader: false,
    });

    // Mock useAdminProcessAgendas
    jest.spyOn(queryHooks, 'useAdminProcessAgendas').mockReturnValue({
      data: mockAgendas,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      isPlaceholderData: false,
      status: 'error',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: function (
        options?: RefetchOptions,
      ): Promise<QueryObserverResult<GetAdminProcessAgendasResponse | null, Error>> {
        throw new Error('Function not implemented.');
      },
      fetchStatus: 'fetching',

      // @ts-ignore
      promise: undefined,
    });

    // Mock useQueryState with stateful behavior
    (useQueryState as jest.Mock).mockImplementation(() => [isModalOpenState, setIsModalOpenMock]);

    // Mock useMutation
    (useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });

  it('should render the button with correct text', () => {
    render(<CreateNewAdminProcessModal />);

    const button = screen.getByRole('button', { name: /newCaseButton/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should disable button when user does not have admin proceedings referent role', () => {
    jest.spyOn(rolesProvider, 'useRoles').mockReturnValue({
      adminProceedingsReferent: false,
      roles: [],
      hasRole: function (role: string): boolean {
        throw new Error('Function not implemented.');
      },
      cscEditor: false,
      cscPublisher: false,
      suklReader: false,
      cscReader: false,
      isLoadingRoles: false,
      adminProceedingsReader: false,
      requestsReader: false,
      requestsApprover: false,
      auditReader: false,
      pdfComparisonReader: false,
    });

    render(<CreateNewAdminProcessModal />);

    const button = screen.getByRole('button', { name: /newCaseButton/i });
    expect(button).toBeDisabled();
  });

  it('should open modal when button is clicked', () => {
    render(<CreateNewAdminProcessModal />);

    const button = screen.getByTestId('newCodeListBtn');
    fireEvent.click(button);

    expect(setIsModalOpenMock).toHaveBeenCalledWith(true);
  });
});
