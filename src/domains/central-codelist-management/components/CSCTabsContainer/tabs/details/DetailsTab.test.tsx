import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import enMessages from '@/core/messages/en.json';
import { CodeListByIdResponse } from '@/domains/central-codelist-management/api/services';

import { DetailsTab } from './DetailsTab';
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));
jest.mock('@/domains/central-codelist-management/hooks/useCSCAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isEditAuth: true,
    isLoading: false,
  })),
}));

jest.mock('@/providers/context', () => ({
  useAppContext: jest.fn(),
}));

const queryClinet = new QueryClient();

describe('DetailsTab', () => {
  const mockData: CodeListByIdResponse = {
    state: 'Success',
    messages: [],
    payload: {
      id: 'TEST-ID',
      name: 'Test Title',
      description: 'Test Description',
      garants: [
        {
          id: 'DAWD',
          abbrev: 'JD',
          fullName: 'John Doe',
          mail: 'john.doe@example.com',
          department: 'IT',
          businessPhones: ['+420 111 222 333'],
        },
      ],
      content: {
        data: [],
        structure: {
          name: 'Test Structure',
          fields: [],
        },
      },
      versionType: 'Internal',
      validFrom: '2024-01-01',
      codeListId: '',
      code: '',
      editors: [],
    },
  };

  it('renders with default props', () => {
    render(
      <QueryClientProvider client={queryClinet}>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <DetailsTab data={mockData} codeListId="TEST-CODELIST-ID" parentId="TEST-PARENT-ID" />
        </NextIntlClientProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Codelist title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Guarantor')).toBeInTheDocument();
    expect(screen.getByText('Validity from')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders with custom data', () => {
    render(
      <QueryClientProvider client={queryClinet}>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <DetailsTab data={mockData} codeListId="TEST-CODELIST-ID" parentId="TEST-PARENT-ID" />
        </NextIntlClientProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1. 1. 2024')).toBeInTheDocument();
    expect(screen.getByText('TEST-ID')).toBeInTheDocument();
    expect(screen.getByText('Interní')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
