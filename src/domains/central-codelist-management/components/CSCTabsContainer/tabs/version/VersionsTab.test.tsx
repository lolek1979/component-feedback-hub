import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { VersionsTab } from './VersionsTab';

const transformedDataCSCTabs = [
  {
    id: '1',
    name: 'Concept 1',
    type: 'Type 1',
    status: 'Expired',
    validUntil: '2023-12-31',
    description: 'Description 1',
    validFrom: '2021-01-01',
    validTo: '2023-12-31',
    versionType: 'v1',
  },

  {
    id: '2',
    name: 'Concept 2',
    type: 'Type 2',
    status: 'Expired',
    validUntil: '2022-12-31',
    description: 'Description 2',
    validFrom: '2020-01-01',
    validTo: '2022-12-31',
    versionType: 'v2',
  },
];

describe('VersionsTab', () => {
  it('renders table with data', async () => {
    render(
      <FeedBackHubProvider>
        <NextIntlClientProvider messages={messages} locale="en">
          <UnsavedChangesProvider>
            <VersionsTab data={transformedDataCSCTabs} parentId={undefined} codeListId={''} />
          </UnsavedChangesProvider>
        </NextIntlClientProvider>
      </FeedBackHubProvider>,
    );
    expect(screen.getByText('1. 1. 2021')).toBeInTheDocument();
    expect(screen.getByText('1. 1. 2020')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('Expired'));
  });
});
