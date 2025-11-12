import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  it('renders without crashing', () => {
    render(<RadioButton id="test" />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<RadioButton id="test" className="custom-class" />);
    const { firstChild } = container;
    expect(firstChild).toHaveClass('custom-class');
  });

  it('passes props correctly', () => {
    render(<RadioButton id="test" name="testName" value="testValue" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id', 'test');
    expect(radio).toHaveAttribute('name', 'testName');
    expect(radio).toHaveAttribute('value', 'testValue');
  });

  it('handles checked state', () => {
    render(<RadioButton id="test" checked={true} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('handles disabled state', () => {
    render(<RadioButton id="test" disabled={true} />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = jest.fn();
    render(<RadioButton id="test" name="test" value="1" onChange={handleChange} />);

    // Simulate user click
    await userEvent.click(screen.getByRole('radio'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<RadioButton id="test" disabled={true} />);
    const { firstChild } = container;
    expect(firstChild).toHaveClass('disabled');
  });
});
