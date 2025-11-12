import { fireEvent, render, screen } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Multiselect } from './Multiselect';

import '@testing-library/jest-dom';

const mockItems = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const renderWithProvider = (component: React.ReactNode) => {
  return render(<FeedBackHubProvider>{component}</FeedBackHubProvider>);
};

describe('Multiselect', () => {
  test('renders the placeholder when no items are selected', () => {
    renderWithProvider(
      <Multiselect id="multiselect-placeholder" items={mockItems} placeholder="Select options" />,
    );
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  test('opens the dropdown when clicked', () => {
    renderWithProvider(<Multiselect id="multiselect-dropdown" items={mockItems} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('selects an item when clicked', () => {
    renderWithProvider(<Multiselect id="multiselect-select" items={mockItems} />);
    fireEvent.click(screen.getByRole('button'));

    // Click on the option item (which contains the checkbox)
    const optionItem = screen.getByRole('option', { name: /Option 1/i });
    fireEvent.click(optionItem);

    // Check if the selected text appears in the input
    expect(
      screen.getByText('Option 1', { selector: '[id="text-selected-options-multiselect-select"]' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // count badge
  });

  test('selects and deselects an item correctly', () => {
    renderWithProvider(<Multiselect id="multiselect-deselect" items={mockItems} />);
    fireEvent.click(screen.getByRole('button'));

    const option1Item = screen.getByRole('option', { name: /Option 1/i });

    // Select the item
    fireEvent.click(option1Item);

    // Find all checkboxes and get the first one (Option 1)
    const checkboxes = screen.getAllByRole('checkbox', { name: 'checkbox' });
    const checkbox1 = checkboxes[0];
    expect(checkbox1).toBeChecked();

    // Deselect the item
    fireEvent.click(option1Item);
    expect(checkbox1).not.toBeChecked();
  });

  test('selects all items when "Select all" button is clicked', () => {
    renderWithProvider(<Multiselect id="multiselect-select-all" items={mockItems} />);
    fireEvent.click(screen.getByRole('button'));

    // Find and click the "Select all" button
    const selectAllButton = screen.getByText('Select all');
    fireEvent.click(selectAllButton);

    // Check that all checkboxes are checked
    const checkboxes = screen.getAllByRole('checkbox', { name: 'checkbox' });
    expect(checkboxes).toHaveLength(3);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  test('clears all items when "Clear filter" button is clicked', () => {
    renderWithProvider(<Multiselect id="multiselect-clear-filter" items={mockItems} />);
    fireEvent.click(screen.getByRole('button'));

    // First select some items
    const option1Item = screen.getByRole('option', { name: /Option 1/i });
    const option2Item = screen.getByRole('option', { name: /Option 2/i });
    fireEvent.click(option1Item);
    fireEvent.click(option2Item);

    // Verify items are selected
    const checkboxes = screen.getAllByRole('checkbox', { name: 'checkbox' });
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();

    // Find and click the "Clear filter" button
    const clearFilterButton = screen.getByText('Remove all');
    fireEvent.click(clearFilterButton);

    // All checkboxes should be unchecked
    const checkboxesAfterClear = screen.getAllByRole('checkbox', { name: 'checkbox' });
    checkboxesAfterClear.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test('closes the dropdown when clicking outside', () => {
    const { container } = renderWithProvider(
      <Multiselect id="multiselect-outside-click" items={mockItems} />,
    );
    fireEvent.click(screen.getByRole('button')); // Open the dropdown

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(container); // Click outside the component
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('disables the dropdown when the disabled prop is true', () => {
    renderWithProvider(<Multiselect id="multiselect-disabled" items={mockItems} disabled={true} />);
    fireEvent.click(screen.getByRole('button')); // Try to open dropdown
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Shouldn't open
  });

  test('renders with search functionality when searchable is true', () => {
    renderWithProvider(
      <Multiselect
        id="multiselect-search"
        items={mockItems}
        searchable={true}
        searchPlaceholder="Search..."
      />,
    );
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('renders with helper text', () => {
    renderWithProvider(
      <Multiselect id="multiselect-helper" items={mockItems} helperText="Please select options" />,
    );

    expect(screen.getByText('Please select options')).toBeInTheDocument();
  });
});
