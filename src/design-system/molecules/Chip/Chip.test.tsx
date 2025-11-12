import React from 'react';
import { render, screen } from '@testing-library/react';

import { Chip } from './Chip';

describe('Badge', () => {
  it('renders badge with text content', () => {
    render(<Chip>Test Badge</Chip>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Chip className={customClass}>Badge with custom class</Chip>);
    expect(screen.getByTestId('badge')).toHaveClass('badge', customClass);
  });
});
