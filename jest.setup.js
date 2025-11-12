// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => (name === 'locale' ? 'en' : undefined)),
    set: jest.fn(), // Mock set function
  })),
}));

jest.mock('@/services/locale', () => ({
  setUserLocale: jest.fn(),
}));

jest.mock('@/providers/context');

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

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
  useAccount: jest.fn(),
  useMsalAuthentication: jest.fn(),
  AuthenticatedTemplate: jest.fn(({ children }) => <>{children}</>),
  UnauthenticatedTemplate: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@/api/query/useUserPhoto', () => {
  return jest.fn(() => ({
    data: '/mocked-photo-url',
  }));
});
