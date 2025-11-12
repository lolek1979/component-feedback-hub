import React from 'react';
import { render, screen } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import ProcessListFilter from './ProcessListFilter';

jest.mock('@/providers/FeedBackHubProvider', () => ({
  FeedBackHubProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFeedBackHub: () => ({}),
}));
jest.mock('../../api', () => ({
  useAdminProcessStatuses: () => ({
    data: [{ code: 'open', name: 'Open' }],
  }),
  useAdminProcessUsers: () => ({
    data: [{ id: '1', name: 'User 1' }],
  }),
}));
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('nuqs', () => ({
  useQueryState: () => [null, jest.fn()],
}));

describe('ProcessListFilter', () => {
  it('renders input and selects', () => {
    render(
      <FeedBackHubProvider>
        <ProcessListFilter />
      </FeedBackHubProvider>,
    );
    expect(screen.getByTestId('adminProcess-input-fullText')).toBeInTheDocument();
    expect(screen.getByTestId('adminProcess-select-status')).toBeInTheDocument();
    expect(screen.getByTestId('adminProcess-select-responsibleUser')).toBeInTheDocument();
  });
});
