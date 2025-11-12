import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('should render spinner with default props', () => {
    render(<Spinner />);
    const container = screen.getByTestId('spinner-container');
    expect(container).toBeInTheDocument();
    expect(container).not.toHaveClass('full-screen');
  });

  it('should render spinner with fullScreen prop', () => {
    render(<Spinner fullScreen />);
    const container = screen.getByTestId('spinner-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('fullScreen');
  });
});
