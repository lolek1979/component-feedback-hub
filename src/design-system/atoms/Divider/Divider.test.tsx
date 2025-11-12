import { render, screen } from '@/core/tests/test-utils';

import { Divider } from '.';

describe('Divider', () => {
  it('should render the divider component', () => {
    render(<Divider />);
    expect(screen.getByTestId('divider-testid')).toBeInTheDocument();
  });

  it('should apply the correct orientation', () => {
    render(<Divider orientation="vertical" />);
    const divider = screen.getByTestId('divider-testid');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('should apply the correct variant class', () => {
    render(<Divider variant="dotted" />);
    const divider = screen.getByTestId('divider-testid');
    expect(divider.className).toMatch(/dotted/i);
  });

  it('should accept custom className', () => {
    render(<Divider className="custom-class" />);
    const divider = screen.getByTestId('divider-testid');
    expect(divider.className).toMatch(/custom-class/);
  });
});
