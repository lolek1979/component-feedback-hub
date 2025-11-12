import { fireEvent, render, screen } from '@testing-library/react';

import { Toggle } from './Toggle';

describe('Toggle component', () => {
  test('renders correctly with defaultChecked prop', () => {
    render(<Toggle defaultChecked={true} />);
    const switchInput = screen.getByRole('switch');

    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toBeChecked();
  });

  test('changes checked state on click', () => {
    render(<Toggle defaultChecked={false} />);
    const switchInput = screen.getByRole('switch');

    expect(switchInput).not.toBeChecked();

    fireEvent.click(switchInput);

    expect(switchInput).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();

    render(<Toggle defaultChecked={false} onChange={handleChange} />);
    const switchInput = screen.getByRole('switch');

    fireEvent.click(switchInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('honors checked prop when controlled externally', () => {
    const { rerender } = render(<Toggle checked={false} />);
    const switchInput = screen.getByRole('switch');

    expect(switchInput).not.toBeChecked();

    rerender(<Toggle checked={true} />);

    expect(switchInput).toBeChecked();
  });

  test('changes checked state on click', () => {
    render(<Toggle defaultChecked={false} />);
    const switchInput = screen.getByRole('switch');

    expect(switchInput).not.toBeChecked();

    fireEvent.click(switchInput);

    expect(switchInput).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();

    render(<Toggle defaultChecked={false} onChange={handleChange} />);
    const switchInput = screen.getByRole('switch');

    fireEvent.click(switchInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('honors checked prop when controlled externally', () => {
    const { rerender } = render(<Toggle checked={false} />);
    const switchInput = screen.getByRole('switch');

    expect(switchInput).not.toBeChecked();

    rerender(<Toggle checked={true} />);

    expect(switchInput).toBeChecked();
  });
});
