import { fireEvent, render, screen } from '@testing-library/react';

import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  test('renders correctly with defaultChecked prop', () => {
    render(<Checkbox defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  test('changes checked state on click', () => {
    render(<Checkbox defaultChecked={false} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();

    render(<Checkbox defaultChecked={false} onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('honors checked prop when controlled externally', () => {
    const { rerender } = render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} />);

    expect(checkbox).toBeChecked();
  });

  test('changes checked state on click', () => {
    render(<Checkbox defaultChecked={false} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();

    render(<Checkbox defaultChecked={false} onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('honors checked prop when controlled externally', () => {
    const { rerender } = render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} />);

    expect(checkbox).toBeChecked();
  });
});
