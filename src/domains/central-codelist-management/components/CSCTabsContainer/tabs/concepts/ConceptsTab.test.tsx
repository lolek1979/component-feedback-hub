import { NextIntlClientProvider } from 'next-intl';
import { render } from '@testing-library/react';

import messages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { ConceptsTab } from './ConceptsTab';
const transformedDataCSCTabs = [
  {
    id: '1',
    name: 'Concept 1',
    type: 'Type 1',
    status: 'Active',
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
    status: 'Inactive',
    validUntil: '2022-12-31',
    description: 'Description 2',
    validFrom: '2020-01-01',
    validTo: '2022-12-31',
    versionType: 'v2',
  },
];

describe('ConceptsTab', () => {
  it('renders without crashing', () => {
    render(
      <FeedBackHubProvider>
        <NextIntlClientProvider messages={messages} locale="en">
          <UnsavedChangesProvider>
            <ConceptsTab data={transformedDataCSCTabs} parentId={undefined} />
          </UnsavedChangesProvider>
        </NextIntlClientProvider>
      </FeedBackHubProvider>,
    );
  });
});
