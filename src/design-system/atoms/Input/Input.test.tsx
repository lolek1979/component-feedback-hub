import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ProfileIcon from './icons/profileIcon.svg';
import { Input } from './Input';
import styles from './Input.module.css';

import '@testing-library/jest-dom';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input id="input-test-placeholder" placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(
      <Input
        id="input-test-styles"
        placeholder="Custom styles"
        inputSize="large"
        borderColor="#007bff"
        padding="12px"
      />,
    );
    const input = screen.getByPlaceholderText('Custom styles');
    expect(input).toHaveStyle('border-color: #007bff');
    expect(input).toHaveStyle('padding: 12px');
  });

  it('calls onChange handler', () => {
    const handleChange = jest.fn();
    render(<Input id="input-test-change" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Input id="input-test-size-small" inputSize="small" />);
    expect(screen.getByTestId('input-wrapper')).toHaveClass(styles.inputWrapper, styles.small);

    rerender(<Input id="input-test-size-medium" inputSize="medium" />);
    expect(screen.getByTestId('input-wrapper')).toHaveClass(styles.inputWrapper, styles.medium);

    rerender(<Input id="input-test-size-large" inputSize="large" />);
    expect(screen.getByTestId('input-wrapper')).toHaveClass(styles.inputWrapper, styles.large);
  });

  it('renders with an icon', () => {
    render(<Input id="input-test-icon" placeholder="Input with icon" icon={<ProfileIcon />} />);
    expect(screen.getByPlaceholderText('Input with icon')).toBeInTheDocument();
  });
});
