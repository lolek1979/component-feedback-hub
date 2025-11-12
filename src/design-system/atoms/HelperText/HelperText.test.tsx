/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';

import { HelperText } from './HelperText';

describe('HelperText Component', () => {
  it('renders default icon and text when no variant is specified', () => {
    render(<HelperText id="messagge-test-default" text="Default message" />);
    expect(screen.getByText('Default message')).toBeInTheDocument();
    expect(screen.getByText('Default message')).toHaveClass('default'); // checks for span with "default" class
  });

  it('renders error icon and text when variant is "error"', () => {
    render(<HelperText id="messagge-test-error" variant="error" text="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(document.querySelector('svg-mock')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toHaveClass('error');
  });

  it('renders warning icon and text when variant is "warning"', () => {
    render(<HelperText id="messagge-test-warning" variant="warning" text="Warning message" />);
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(document.querySelector('svg-mock')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toHaveClass('warning');
  });

  it('renders success icon and text when variant is "success"', () => {
    render(<HelperText id="messagge-test-success" variant="success" text="Success message" />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(document.querySelector('svg-mock')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toHaveClass('success');
  });

  it('applies additional className if specified', () => {
    render(
      <HelperText id="messagge-test-custon" text="Custom class message" className="custom-class" />,
    );
    expect(screen.getByText('Custom class message').closest('div')).toHaveClass('custom-class');
  });
});
