import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { render, screen } from '@testing-library/react';

import { useAppContext } from '@/core/providers/context';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { Header } from './Header';

const mockSetIsSideMenuOpened = jest.fn();
const mockUseAppContext = {
  state: { isSideMenuOpened: true },
  actions: { setIsSideMenuOpened: mockSetIsSideMenuOpened },
};

interface Translations {
  signIn: string;
  [key: string | number]: string | number;
}

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockReturnValue((key: string | number) => {
    const translations: Translations = {
      signIn: 'Príhlasit se',
    };

    return translations[key as string] || key;
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams() {},
}));

describe('Header', () => {
  beforeEach(() => {
    // Mock context, translations, and pathname
    (useAppContext as jest.Mock).mockReturnValue(mockUseAppContext);
    (useMsalAuthentication as jest.Mock).mockReturnValue({ login: jest.fn() });
    (useMsal as jest.Mock).mockReturnValue({
      accounts: [
        {
          homeAccountId: '1',
          environment: 'dev',
          tenantId: 'tenantId',
          username: 'user@example.com',
          localAccountId: 'localAccountId',
        },
      ],
    });
  });

  it('renders all main elements', () => {
    render(
      <FeedBackHubProvider>
        <UnsavedChangesProvider>
          <Header />
        </UnsavedChangesProvider>
      </FeedBackHubProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Príhlasit se')).toBeInTheDocument();
    expect(screen.getByTestId('Menu')).toBeInTheDocument();
  });
});
