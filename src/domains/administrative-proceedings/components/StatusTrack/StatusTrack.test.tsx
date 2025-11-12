import { render, screen } from '@/core/tests/test-utils';

import { StatusTrack } from '.';

const mockItems = [
  { label: 'Step 1', completed: true },
  { label: 'Step 2', active: true },
  { label: 'Step 3' },
  { label: 'Step 4', disabled: true },
];

describe('StatusTrack', () => {
  it('renders all status items correctly', () => {
    render(<StatusTrack items={mockItems} />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
  });

  it('renders connectors between items', () => {
    render(<StatusTrack items={mockItems} />);

    // Check for the connectorWrapper class instead of .connector
    const connectors = document.querySelectorAll(`.connectorWrapper`);
    expect(connectors.length).toBe(mockItems.length - 1);
  });
});
