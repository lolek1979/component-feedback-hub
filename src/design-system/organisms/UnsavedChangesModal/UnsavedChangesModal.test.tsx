import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import messages from '@/core/messages/cs.json';
import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { fireEvent, render, screen } from '@/core/tests/test-utils';

import UnsavedChangesModal from './UnsavedChangesModal';

const queryClient = new QueryClient();

jest.mock('@/providers/UnsavedChangesProvider', () => ({
  useUnsavedChanges: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const renderElement = () => {
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <UnsavedChangesModal />
      </QueryClientProvider>
    </NextIntlClientProvider>,
  );
};

describe('UnsavedChangesModal', () => {
  beforeEach(() => {
    (useUnsavedChanges as jest.Mock).mockReturnValue({
      hasUnsavedChanges: true,
      updateUnsavedChanges: jest.fn(),
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('should not be visible initially', () => {
    renderElement();
    expect(
      screen.queryByText(
        'Zatím jste neuložili svou práci. Pokud teď odejdete, všechna neuložená data budou ztracena.',
      ),
    ).not.toBeInTheDocument();
  });

  it('should display modal when navigation attempt is detected', () => {
    renderElement();

    const link = document.createElement('a');
    link.href = '/test';
    document.body.appendChild(link);

    fireEvent.click(link);

    expect(
      screen.getByText(
        'Zatím jste neuložili svou práci. Pokud teď odejdete, všechna neuložená data budou ztracena.',
      ),
    ).toBeInTheDocument();

    document.body.removeChild(link);
  });

  it('should close modal when stay button is clicked', () => {
    renderElement();

    const link = document.createElement('a');
    link.href = '/test';
    document.body.appendChild(link);

    fireEvent.click(link);
    expect(
      screen.getByText(
        'Zatím jste neuložili svou práci. Pokud teď odejdete, všechna neuložená data budou ztracena.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Odejít bez uložení'));
    expect(
      screen.queryByText(
        'Zatím jste neuložili svou práci. Pokud teď odejdete, všechna neuložená data budou ztracena.',
      ),
    ).not.toBeInTheDocument();

    document.body.removeChild(link);
  });
});
