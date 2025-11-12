/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';

import { useAppContext } from '@/core/providers/context';
import { FeesPageProvider } from '@/domains/limits-copayments-center/providers/FeesPageContext';

import { SideBar } from './SideBar';

import '@testing-library/jest-dom';

// Set up initial mock data
const mockSetIsSideMenuOpened = jest.fn();
const mockUseAppContext = {
  state: { isSideMenuOpened: true },
  actions: { setIsSideMenuOpened: mockSetIsSideMenuOpened },
};

const mockMessages = {
  navigaton: {
    home: 'Domovská stránka',
    fees: 'Doplatky a poplatky',
    settings: 'Nastavení',
    administration: 'Administrace',
    csc: 'Správa číselníků',
    administrativeProceedings: 'Správní řízení',
    bugReport: 'Nahlásit problém',
  },
  bugReport: {
    modalTitle: 'Nahlásit problém',
    titleLabel: 'Název',
    descriptionLabel:
      'Něco nefunguje, nebo máte nápad na vylepšení? Dejte nám vědět, vaše zpětná vazba je důležitá!',
    descriptionPlaceholder: 'Vaše zpráva',
    captureScreenshot: 'Pořídit snímek obrazovky',
    screenshotAlt: 'Pořízený snímek obrazovky',
    submit: 'Odeslat',
    cancel: 'Zrušit',
  },
  common: {
    close: 'Zrušit',
    error: 'Něco se pokazilo. Zkuste to za chvíli znovu.',
    networkError: 'Chybí připojení k internetu.',
    loading: 'Načítání...',
    unPublishPlanned: 'Čiselník byl úspěšně depublikován.',
    unPublishError: 'Publikování se nepodařilo zrušit.',
    publishConcept: 'Koncept byl publikován.',
    publishConceptError: 'Koncept není možné publikovat do minulosti',
    publishConceptErrorStructure: 'Doplňte prosím názvy sloupců, nebo typ sloupce',
    requiredFields: 'Vyplňte prosím všechna povinná pole.',
    formEmpty: 'Vyplňte prosím všechna povinná pole.',
    deleteConceptSuccess: 'Koncept byl smazán.',
    invalidDate: 'Zadejte datum, které není v minulosti.',
    copyLinkMessage: 'Odkaz byl zkopírován do schránky.',
    deleteConceptError: 'Koncept se nepodařilo smazat.',
  },
};
const queryClinet = new QueryClient();
const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      <QueryClientProvider client={queryClinet}>
        <FeesPageProvider>{component}</FeesPageProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>,
  );
};

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/providers/context', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
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

jest.mock('nuqs', () => ({
  useQueryState: jest.fn(() => [false, jest.fn()]),
  parseAsBoolean: {
    withDefault: jest.fn(() => ({
      parseAsBoolean: { withDefault: jest.fn() },
    })),
  },
}));

describe('SideBar component', () => {
  const mockPathname = jest.requireMock('next/navigation').usePathname;

  beforeEach(() => {
    // Mock context and translations
    (useAppContext as jest.Mock).mockReturnValue(mockUseAppContext);
  });

  it('renders navigation links with correct text', () => {
    mockPathname.mockReturnValue('/home');
    renderWithIntl(<SideBar />);

    expect(screen.getByText('Domovská stránka')).toBeInTheDocument();
    expect(screen.getByText('Doplatky a poplatky')).toBeInTheDocument();
    expect(screen.getByText('Správa číselníků')).toBeInTheDocument();
  });

  it('calls setIsSideMenuOpened(false) when a NavLink is clicked', () => {
    mockPathname.mockReturnValue('/home');
    renderWithIntl(<SideBar />);

    const homeLink = screen.getByText('Domovská stránka');
    fireEvent.click(homeLink);

    expect(mockSetIsSideMenuOpened).toHaveBeenCalledWith(false);
  });

  it('does not apply active class to non-current pathname links', () => {
    mockPathname.mockReturnValue('/home');
    renderWithIntl(<SideBar />);

    const feesLink = screen.getByText('Doplatky a poplatky').closest('a');
    expect(feesLink).not.toHaveClass('active');
  });
});
