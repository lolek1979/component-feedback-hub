import { fireEvent, render, screen } from '@testing-library/react';

import { RadioGroupSection } from './RadioGroupSection';

import '@testing-library/jest-dom';

const mockOnChange = jest.fn();

const defaultProps = {
  title: 'Choose an option',
  description: 'Select one of the following:',
  radioButton: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
  value: 'option1',
  radioName: 'testRadio',
  onChange: mockOnChange,
};

describe('RadioGroupSection', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders title and description', () => {
    render(<RadioGroupSection {...defaultProps} />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
    expect(screen.getByText('Select one of the following:')).toBeInTheDocument();
  });

  it('renders all radio buttons', () => {
    render(<RadioGroupSection {...defaultProps} />);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when a radio button is clicked', () => {
    render(<RadioGroupSection {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('sets the correct value in the RadioGroup', () => {
    render(<RadioGroupSection {...defaultProps} />);
    const radio = screen.getByLabelText('Option 1') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });
});
