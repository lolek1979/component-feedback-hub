import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useCodeListBycode from '@/core/api/query/useCodeListBycode';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { DynamicSelect } from './DynamicSelect';

jest.mock('@/core/api/query/useCodeListBycode');

const mockData = {
  data: {
    content: {
      data: [
        ['A1', 'Label A'],
        ['B2', 'Label B'],
        ['C3', 'Label C'],
      ],
    },
  },
};

describe('DynamicSelect', () => {
  beforeEach(() => {
    (useCodeListBycode as jest.Mock).mockReturnValue(mockData);
  });

  it('renders options correctly based on code list data', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <FeedBackHubProvider>
        <DynamicSelect
          code="test-code"
          id="test-select"
          labelColumnIndexes={[1]}
          valueColumnIndex={0}
          onChange={handleChange}
          placeholder="Select an option"
        />
      </FeedBackHubProvider>,
    );

    // Open the dropdown
    const placeholder = screen.getByText('Select an option');
    expect(placeholder).toBeInTheDocument();

    await user.click(placeholder);

    // Check if options are rendered
    const option = screen.getByText('Label A');
    expect(option).toBeInTheDocument();

    await user.click(option);
    expect(handleChange).toHaveBeenCalledWith('A1');
  });

  it('handles empty data gracefully', () => {
    (useCodeListBycode as jest.Mock).mockReturnValue({ data: { content: { data: [] } } });

    render(
      <FeedBackHubProvider>
        <DynamicSelect
          code="test-code"
          id="test-select"
          labelColumnIndexes={[1]}
          valueColumnIndex={0}
          labelSeparator=" "
          placeholder="Select an option"
        />
      </FeedBackHubProvider>,
    );

    expect(screen.queryByText('Label A')).not.toBeInTheDocument();
  });
});
``;
