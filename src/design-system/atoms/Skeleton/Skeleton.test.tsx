import React from 'react';
import { render, screen } from '@testing-library/react';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders with default medium size', () => {
    render(<Skeleton />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('maxWidth: 366px');
    expect(skeleton).toHaveStyle('width: 100%');
    expect(skeleton).toHaveStyle('height: 32px');
  });

  it('renders with small size', () => {
    render(<Skeleton size="small" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveStyle('maxWidth: 120px');
    expect(skeleton).toHaveStyle('width: 100%');
    expect(skeleton).toHaveStyle('height: 32px');
  });

  it('renders with large size', () => {
    render(<Skeleton size="large" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveStyle('maxWidth: 717px');
    expect(skeleton).toHaveStyle('width: 100%');
    expect(skeleton).toHaveStyle('height: 32px');
  });
});
