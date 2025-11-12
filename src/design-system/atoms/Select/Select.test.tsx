import { fireEvent, render, screen } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Option } from './partials/Option';
import { Select } from './Select';

const renderSelect = (props = {}, options = ['Option 1', 'Option 2']) => {
  return render(
    <FeedBackHubProvider>
      <Select {...props} id="select-test">
        {options.map((option, index) => (
          <Option key={index.toString()} value={`option${index + 1}`}>
            {option}
          </Option>
        ))}
      </Select>
    </FeedBackHubProvider>,
  );
};

describe('Select Component', () => {
  test('renders with placeholder', () => {
    renderSelect({ placeholder: 'Select an option' });
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    renderSelect();

    const selectInput = screen.getByRole('button');
    fireEvent.click(selectInput);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    renderSelect();

    const selectInput = screen.getByRole('button');
    fireEvent.click(selectInput); // Open dropdown

    fireEvent.click(document);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('selects an option when clicked', () => {
    renderSelect();

    const selectInput = screen.getByRole('button');
    fireEvent.click(selectInput); // Open dropdown

    const option = screen.getByText('Option 1');
    fireEvent.click(option); // Click on option

    expect(selectInput).toHaveTextContent('Option 1');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Dropdown should close
  });

  test('allows keyboard navigation', () => {
    renderSelect({}, ['Option 1', 'Option 2', 'Option 3']);

    const selectInput = screen.getByRole('button');
    fireEvent.click(selectInput); // Open dropdown

    // Navigate down the options
    fireEvent.keyDown(selectInput, { key: 'ArrowDown' });
    expect(screen.getByText('Option 2')).toHaveClass(`text subtitle regular`);

    fireEvent.keyDown(selectInput, { key: 'ArrowDown' });
    expect(screen.getByText('Option 3')).toHaveClass(`text subtitle regular`);

    // Select the focused option
    fireEvent.keyDown(selectInput, { key: 'Enter' });
    expect(selectInput).toHaveTextContent('Option 3');
  });

  test('closes dropdown with Escape key', () => {
    renderSelect();

    const selectInput = screen.getByRole('button');
    fireEvent.click(selectInput); // Open dropdown

    fireEvent.keyDown(selectInput, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('disables the select component', () => {
    renderSelect({ disabled: true, placeholder: 'Select an option' });

    fireEvent.click(screen.getByRole('button')); // Try to open dropdown
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // Shouldn't open
  });
});
