import React from 'react';
import { render, screen } from '@testing-library/react';

import { FieldLabel } from './FieldLabel';

import '@testing-library/jest-dom';

describe('Label', () => {
  it('renders with text', () => {
    render(<FieldLabel text="Test Label" htmlFor="custom-label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<FieldLabel text="Required Label" required htmlFor="required-input" />);
    expect(screen.getByText('Required Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(<FieldLabel text="Size Test" size="default" htmlFor="size-test" />);
    expect(screen.getByText('Size Test')).toHaveClass('text caption regular');
  });
});
