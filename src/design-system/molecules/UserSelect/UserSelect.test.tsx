/* eslint-disable testing-library/no-unnecessary-act */
import { NextIntlClientProvider } from 'next-intl';

import { fetchUsers } from '@/core/api';
import csMessages from '@/core/messages/cs.json';
import { act, fireEvent, render, screen, waitFor } from '@/core/tests/test-utils';

import { UsersSelect } from './UserSelect';

jest.mock('@/api/services/getUsers', () => ({
  fetchUsers: jest.fn().mockResolvedValue({ value: [] }),
}));

const mockUsers = [
  {
    displayName: 'Uživatel 1',
    mail: 'user1@mail.com',
    mobilePhone: '123456789',
    givenName: 'Uživatel',
    surname: '1',
  },
  {
    displayName: 'Uživatel 2',
    mail: 'user2@mail.com',
    mobilePhone: '987654321',
    givenName: 'Uživatel',
    surname: '2',
  },
];

describe('UsersSelect', () => {
  const renderComponent = (onSelectsChange = jest.fn()) =>
    render(
      <NextIntlClientProvider locale="cs" messages={csMessages}>
        <UsersSelect
          onSelectsChange={onSelectsChange}
          initialUsers={[]}
          id="user"
          roles={['user']}
        />
      </NextIntlClientProvider>,
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render the UsersSelect component', async () => {
    renderComponent();
    await act(async () => {
      expect(screen.getByPlaceholderText('Vyberte…')).toBeInTheDocument();
    });
  });

  it('should allow typing and selecting a user', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue({ value: mockUsers });
    renderComponent();
    const input = screen.getByPlaceholderText('Vyberte…');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Uživatel 1' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Uživatel 1')).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Uživatel 1'));
    });

    expect(input).toHaveValue('Uživatel 1');
  });
});
