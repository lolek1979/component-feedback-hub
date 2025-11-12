import { render, screen } from '@testing-library/react';

import { ProcessDetail } from './ProcessDetail';

// Mock the RolesProvider hook
jest.mock('@/providers/RolesProvider', () => ({
  useRoles: jest.fn().mockReturnValue({
    adminProceedingsReferent: true,
  }),
}));

// Mock next-intl translation hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

// Mock the FormsContext
jest.mock('./AdminProcessWorkFlow/WorkflowSteps', () => {
  const originalModule = jest.requireActual('./AdminProcessWorkFlow/WorkflowSteps');

  return {
    ...originalModule,
    useFormsContext: () => ({
      notes: {},
      setNote: jest.fn(),
      saveCurrentForm: jest.fn(),
      setHighAttention: jest.fn(),
      highAttention: false,
      isSaving: false,
    }),
    FormsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useWorkflowSteps: () => [
      {
        id: 'admin-process-request-step',
        title: 'requestStep.title',
        group: 'requestStep.group',
        formBlocks: [],
        buttonText: 'requestStep.button',
      },
    ],
  };
});

// Mock the InlineMessage component
jest.mock('@/design-system/molecules', () => ({
  InlineMessage: ({ id, message }: { id: string; message: string }) => (
    <div data-testid={id}>{message}</div>
  ),
}));

jest.mock('../AdminProcessLayout/AdminProcessLayout', () => ({
  AdminProcessLayout: ({ id, footerButton }: any) => (
    <div data-testid={id}>
      <div>AdminProcessDetail {id}</div>
      {footerButton && (
        <button data-testid="proceed-button" onClick={footerButton.onClick}>
          {footerButton.label}
        </button>
      )}
    </div>
  ),
}));

const mockUseRoles = jest.requireMock('@/providers/RolesProvider').useRoles;

describe('ProcessDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoles.mockReturnValue({ adminProceedingsReferent: true });
  });

  it('renders the component when user has the required role', () => {
    render(<ProcessDetail id="123" />);

    const detailElement = screen.getByTestId('admin-process-detail');
    expect(detailElement).toBeInTheDocument();

    expect(screen.getByText(/AdminProcessDetail/)).toBeInTheDocument();
    expect(screen.getByTestId('proceed-button')).toBeInTheDocument();
  });

  it('renders inline message when user lacks required role', () => {
    mockUseRoles.mockReturnValue({ adminProceedingsReferent: false });

    render(<ProcessDetail id="123" />);

    expect(screen.getByTestId('inline-message-missing-role')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-process-detail')).not.toBeInTheDocument();
  });
});
