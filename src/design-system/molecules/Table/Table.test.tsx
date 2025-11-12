import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/cs.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';
import { cleanup, render, screen } from '@/core/tests/test-utils';

import { Table } from './Table';

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30, role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, role: 'User' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 28, role: 'Moderator' },
  { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', age: 35, role: 'User' },
];

const renderWithProviders = (component: ReactNode) =>
  render(
    <FeedBackHubProvider>
      <NextIntlClientProvider locale="cs" messages={messages}>
        <UnsavedChangesProvider>{component}</UnsavedChangesProvider>
      </NextIntlClientProvider>
    </FeedBackHubProvider>,
  );

afterEach(() => {
  cleanup();
});

describe('Table', () => {
  it('should render the table data', () => {
    renderWithProviders(
      <Table
        data={sampleData}
        editable={true}
        headers={['id', 'name', 'email', 'age', 'role']}
        setHeaders={() => {}}
        disabledKeys={[]}
      />,
    );

    const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
    names.forEach((name) => {
      expect(screen.getByDisplayValue(name)).toBeInTheDocument();
    });
  });

  it('should render the table with editable cells when editable is true', () => {
    const headers = Object.keys(sampleData[0]);

    renderWithProviders(
      <Table
        data={sampleData}
        headers={headers}
        editable={true}
        disabledKeys={[]}
        columnTypes={{
          id: 'Integer',
          name: 'String',
          email: 'String',
          age: 'Integer',
          role: 'String',
        }}
      />,
    );

    const tableContainer = screen.getByRole('table').closest('.tableContainer');
    expect(tableContainer).toHaveClass('TableContext-edit');

    expect(screen.getAllByText('Číslo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Text').length).toBeGreaterThan(0);

    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells.length).toBeGreaterThan(headers.length);

    const svgElements = document.querySelectorAll('svg-mock');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should render an empty state message when no data is provided', () => {
    renderWithProviders(<Table data={[]} editable={false} />);

    const emptyStateMessage = screen.getByText(/Tento číselník neobsahuje žádná data/i);
    expect(emptyStateMessage).toBeInTheDocument();
  });
});
