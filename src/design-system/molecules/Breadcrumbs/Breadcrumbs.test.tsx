import { render, screen } from '@/core/tests/test-utils';

import { Breadcrumbs } from '.';

describe('Breadcrumbs', () => {
  it('should render breadcrumbs correctly', () => {
    const breadcrumbs = [
      { value: 'Home', link: '/' },
      { value: 'Products', link: '/products' },
      { value: 'Electronics', link: '/products/electronics', current: true },
    ];

    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Electronics/i })).toBeInTheDocument();
  });

  it('should render separators correctly', () => {
    const breadcrumbs = [
      { value: 'Home', link: '/' },
      { value: 'Products', link: '/products' },
      { value: 'Electronics', link: '/products/electronics', current: true },
    ];

    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(breadcrumbs.length - 1);
  });
  it('should render back link when showBackLink is true and breadcrumbs has one item', () => {
    const breadcrumbs = [{ value: 'Home', link: '/' }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} showBackLink />);
    // Assert
    const backLink = screen.getByRole('link', { name: /Home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });
});
