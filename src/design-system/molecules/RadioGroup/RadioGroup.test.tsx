import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    render(
      <RadioGroup id="radio-group-test-1" options={options} name="test" onChange={() => {}} />,
    );
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(options.length);
  });
  it('calls onChange when an option is selected', () => {
    const handleChange = jest.fn();
    render(
      <RadioGroup id="radio-group-test-2" options={options} name="test" onChange={handleChange} />,
    );
    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('sets the default value correctly', () => {
    render(
      <RadioGroup
        id="radio-group-test-3"
        options={options}
        name="test"
        defaultValue="option2"
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  it('disables all radio buttons when disabled prop is true', () => {
    render(
      <RadioGroup
        id="radio-group-test-4"
        options={options}
        name="test"
        disabled
        onChange={() => {}}
      />,
    );
    const radioButtons = screen.getAllByRole('radio');
    radioButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <RadioGroup
        id="radio-group-test-5"
        options={options}
        name="test"
        onChange={() => {}}
        className="custom-class"
      />,
    );
    const { firstChild } = container;
    expect(firstChild).toHaveClass('custom-class');
  });
});
