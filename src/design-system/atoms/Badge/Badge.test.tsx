import React from 'react';
import { render, screen } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders badge with text content', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Badge className={customClass}>Badge with custom class</Badge>);
    expect(screen.getByTestId('badge')).toHaveClass('badge', customClass);
  });
});
