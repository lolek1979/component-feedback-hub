import React from 'react';
import { render, screen } from '@testing-library/react';

import { UsersInfo } from './UsersInfo';

import '@testing-library/jest-dom';

describe('UsersInfo Component', () => {
  const users = [
    {
      abbrev: 'MF',
      fullName: 'Milan Fousek',
      mail: 'milan.fousek@vzp.cz',
      department: 'MVP',
      businessPhones: ['+420 123 456 789'],
    },
    {
      abbrev: 'MH',
      fullName: 'Miroslav Hakl',
      mail: 'miroslav.hakl@vzp.cz',
      department: 'MVP',
      businessPhones: ['+420 123 456 789'],
    },
    {
      abbrev: 'JP',
      fullName: 'Jana Potužáková',
      mail: 'jana.potuzakova@vzp.cz',
      businessPhones: ['+420 123 456 789'],
      department: 'MVP',
    },
  ];

  it('renders the component with title', () => {
    render(<UsersInfo title="Users Info" users={users} />);
    expect(screen.getByText('Users Info')).toBeInTheDocument();
  });

  it('renders all user names', () => {
    render(<UsersInfo title="Users Info" users={users} />);
    users.forEach((user) => {
      expect(screen.getByText(user.fullName)).toBeInTheDocument();
    });
  });

  it('renders all user emails', () => {
    render(<UsersInfo title="Users Info" users={users} />);
    users.forEach((user) => {
      expect(screen.getByText(user.mail)).toBeInTheDocument();
    });
  });

  it('renders all user phone numbers', () => {
    render(<UsersInfo title="Users Info" users={users} />);
    const phoneElements = screen.getAllByText('+420 123 456 789');
    expect(phoneElements).toHaveLength(users.length);
  });
});
