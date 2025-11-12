import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';

import { CodeListStatus } from '@/core/lib/definitions';
import messages from '@/core/messages/en.json';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { CSCTabsContainer } from './CSCTabsContainer';

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <UnsavedChangesProvider>{component}</UnsavedChangesProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>,
  );

const mockData = {
  codeListId: 'mockCodeListId',
  status: 'mockStatus' as CodeListStatus,
  parentId: 'mockParentId',
  data: {
    state: 'Success' as const,
    messages: [
      {
        severity: 'info',
        code: 'mockCode',
        data: {
          additionalProp1: 'value1',
          additionalProp2: 'value2',
          additionalProp3: 'value3',
        },
      },
    ],
    payload: {
      id: '1',
      codeListId: 'mockCodeListId',
      name: 'Mock Name',
      code: 'Mock Code',
      description: 'Mock Description',
      validFrom: '2023-01-01',
      garants: [
        {
          id: '1',
          abbrev: 'MG',
          fullName: 'Mock Garant',
          mail: 'mock@garant.com',
          department: 'Mock Department',
          businessPhones: ['123456789'],
        },
      ],
      editors: [
        {
          id: '1',
          abbrev: 'ME',
          fullName: 'Mock Editor',
          mail: 'mock@editor.com',
          department: 'Mock Department',
          businessPhones: ['987654321'],
        },
      ],
      content: {
        data: [['1', 'Mock Data']],
        structure: {
          name: 'Mock Structure',
          fields: [
            {
              code: '1',
              name: 'Mock Field',
              index: 0,
              length: 10,
              default: 'default',
              valueType: 1,
              description: 'Mock Description',
              validations: [],
            },
          ],
        },
      },
      versionType: 'Mock Version',
    },
  },
  setTableData: jest.fn(),
  setColumnTypes: jest.fn(),
  setColumnNames: jest.fn(),
  tableData: [{ id: 1, name: 'Mock Table Data' }],
  isLoading: false,
  isError: false,
};

describe('CSCTabsContainer', () => {
  const renderComponent = (isEditable = false) =>
    renderWithProviders(
      <CSCTabsContainer
        codeListId={mockData.codeListId}
        isEditable={isEditable}
        status={mockData.status}
        parentId={mockData.parentId}
        data={mockData.data}
        setTableData={mockData.setTableData}
        setColumnTypes={mockData.setColumnTypes}
        setColumnNames={mockData.setColumnNames}
        tableData={mockData.tableData}
        currentPage={0}
        setCurrentPage={jest.fn()}
      />,
    );

  it('shows and allows switching between tabs when not in edit mode', async () => {
    renderComponent(false);

    const detailsTab = await screen.findByText(/Details/i, undefined, { timeout: 3000 });
    fireEvent.click(detailsTab);

    const versionsTab = await screen.findByText(/Version/i, undefined, { timeout: 3000 });
    fireEvent.click(versionsTab);
  });

  it('hides tabs when in edit mode', () => {
    renderComponent(true);

    expect(screen.queryByText(/Details/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Version/i)).not.toBeInTheDocument();
  });
});
