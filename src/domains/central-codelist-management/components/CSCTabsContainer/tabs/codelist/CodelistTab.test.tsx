import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import enMessages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { CodelistTab } from './CodelistTab';

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

afterAll(() => {
  // @ts-ignore: Restore the original implementation if it exists
  delete global.ResizeObserver;
});

jest.mock('@/providers/context', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('@/providers/RolesProvider', () => ({
  useRoles: jest.fn(() => ({
    hasRole: jest.fn(() => true),
  })),
}));

jest.mock('nuqs', () => ({
  parseAsStringLiteral: jest.fn(() => ({
    withDefault: jest.fn(() => 'mockedQueryState'),
  })),
  useQueryState: jest.fn(() => ['mockedQueryState', jest.fn()]),
}));

describe('CodelistTab', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders with default data', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <UnsavedChangesProvider>
          <FeedBackHubProvider>
            <CodelistTab
              status={'concept'}
              data={null}
              setTableData={function (): void {}}
              setColumnTypes={function (): void {}}
              setColumnNames={function (): void {}}
              tableData={[]}
              columnTypes={{}}
              currentPage={0}
              setCurrentPage={function (): void {}}
            />
          </FeedBackHubProvider>
        </UnsavedChangesProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  /*
  it('renders with custom data', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <UnsavedChangesProvider>
          <FeedBackHubProvider>
          <CodelistTab
            status={'concept'}
            data={mockData}
            setTableData={function (): void {}}
            setColumnTypes={function (): void {}}
            setColumnNames={function (): void {}}
            tableData={[]}
            columnTypes={{}}
            currentPage={0}
            setCurrentPage={function (): void {}}
            pageSize={0}
            setPageSize={function (): void {}}
          />
          </FeedBackHubProvider>
        </UnsavedChangesProvider>
      </NextIntlClientProvider>,
    );
    const table = screen.getByTestId('code-list-table');
    expect(table).toBeInTheDocument();
  });
  */
});
