import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { useTranslations } from 'use-intl';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { fireEvent, screen } from '@/core/tests/test-utils';

import { postImportCodeList } from '../../api/services/postImportCodeList';
import { postNewCodeList } from '../../api/services/postNewCodeList';
import { CscHeaderButtons } from '.';
const queryClient = new QueryClient();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('use-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));

jest.mock('@/providers/context', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('@/providers/RolesProvider', () => ({
  useRoles: jest.fn(() => ({
    hasRole: jest.fn(() => true),
    suklReader: jest.fn(() => true),
    cscReader: jest.fn(() => true),
    cscEditor: jest.fn(() => true),
    cscPublisher: jest.fn(() => true),
    rszpReader: jest.fn(() => true),
  })),
}));

jest.mock('../../api/services/postNewCodeList', () => ({
  postNewCodeList: jest.fn(),
}));

jest.mock('../../api/services/postImportCodeList', () => ({
  postImportCodeList: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useSearchParams: jest.fn(() => {
    const params = new URLSearchParams();

    return {
      get: params.get.bind(params),
      set: params.set.bind(params),
    };
  }),
}));

const renderElement = () => {
  render(
    <FeedBackHubProvider>
      <QueryClientProvider client={queryClient}>
        <CscHeaderButtons />
      </QueryClientProvider>
    </FeedBackHubProvider>,
  );
};

describe('CscHeaderButtons', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      replace: jest.fn(),
      back: jest.fn(),
    });

    (useTranslations as jest.Mock).mockReturnValue((key: string) => key);

    (postNewCodeList as jest.Mock).mockResolvedValue({
      draftId: 'test-draft-id',
      codeListId: 'test-codelist-id',
    });

    (postImportCodeList as jest.Mock).mockResolvedValue({
      state: 'Success',
      draftId: 'test-draft-id',
      codeListId: 'test-codelist-id',
    });

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    // eslint-disable-next-line testing-library/no-node-access
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }

    jest.clearAllMocks();
  });

  it('should render the CscHeaderButtons component', () => {
    renderElement();
    expect(screen.getByText('ButtonNew')).toBeInTheDocument();
  });

  it('should open the create modal when the primary button is clicked', () => {
    renderElement();
    fireEvent.click(screen.getByText('ButtonNew'));
    expect(screen.getByText('newTitle')).toBeInTheDocument();
  });

  it('should close the create modal when the close button is clicked', () => {
    renderElement();
    fireEvent.click(screen.getByText('ButtonNew'));
    expect(screen.getByText('newTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('CloseBtn'));
    expect(screen.queryByText('newTitle')).not.toBeInTheDocument();
  });
});
