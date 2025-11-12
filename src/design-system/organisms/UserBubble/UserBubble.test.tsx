import { useTranslations } from 'next-intl';
import { useAccount, useMsal } from '@azure/msal-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { UserBubble } from './UserBubble';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
  useAccount: jest.fn(),
  useMsalAuthentication: jest.fn(),
  AuthenticatedTemplate: jest.fn(({ children }) => <>{children}</>),
  UnauthenticatedTemplate: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({
    acquireTokenSilent: jest.fn().mockResolvedValue({ accessToken: 'mockedAccessToken' }),
    loginPopup: jest.fn().mockImplementation(() => Promise.resolve(true)),
  })),
  InteractionType: {
    Silent: 'Silent',
    Popup: 'Popup',
    Redirect: 'Redirect',
  },
}));

jest.mock('@/services/localStorage', () => ({
  clearLocalStorage: jest.fn(),
  setToLocalStorage: jest.fn(),
  getFromLocalStorage: jest.fn().mockReturnValue(null),
}));

jest.mock('@/services/msalConfig', () => ({
  msalInstance: {
    logoutPopup: jest.fn(),
  },
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
  useLocale: jest.fn(),
}));

describe('UserBubble Component', () => {
  const mockSetIsOpen = jest.fn();

  const mockAccount = {
    idTokenClaims: {
      given_name: 'John',
      family_name: 'Doe',
      email: 'john.doe@example.com',
    },
  };

  const renderUserBubble = (isOpen: boolean) => {
    render(
      <FeedBackHubProvider>
        <UnsavedChangesProvider>
          <UserBubble isOpen={isOpen} setIsOpen={mockSetIsOpen} />
        </UnsavedChangesProvider>{' '}
      </FeedBackHubProvider>,
    );
  };

  beforeEach(() => {
    // Reset mocks before each test
    (useMsal as jest.Mock).mockReturnValue({ accounts: [{}] });
    (useAccount as jest.Mock).mockReturnValue(mockAccount);
    (useTranslations as jest.Mock).mockReturnValue((key: string) => key); // Simply return the key as the translation
  });

  it('renders the UserBubble when isMenuOpen is true', () => {
    renderUserBubble(true);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('does not render the UserBubble when isMenuOpen is false', () => {
    renderUserBubble(false);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('closes UserBubble when clicked outside', async () => {
    renderUserBubble(true);

    screen.getByText('John Doe');
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it('calls setIsOpen when clicked outside and isMenuOpen is true', async () => {
    renderUserBubble(true);

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });
});
