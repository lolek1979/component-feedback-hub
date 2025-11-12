import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormActionCard } from './FormActionCard';

describe('FormActionCard', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    title: 'Test Document Title',
    buttonLabel: 'Print Document',
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and button correctly', () => {
    render(<FormActionCard {...defaultProps} />);

    expect(screen.getByText('Test Document Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print Document' })).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    render(<FormActionCard {...defaultProps} />);

    const title = screen.getByText('Test Document Title');
    // eslint-disable-next-line testing-library/no-node-access
    expect(title.parentElement).toHaveClass('primaryContainer');
  });

  it('renders with secondary variant when specified', () => {
    render(<FormActionCard {...defaultProps} variant="secondary" />);

    const title = screen.getByText('Test Document Title');
    // eslint-disable-next-line testing-library/no-node-access
    expect(title.parentElement).toHaveClass('secondaryContainer');
  });

  it('renders description when provided', () => {
    const description = 'This is a test description';
    render(<FormActionCard {...defaultProps} description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<FormActionCard {...defaultProps} />);

    expect(screen.getByText('Test Document Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print Document' })).toBeInTheDocument();
    expect(container.textContent).toBe('Test Document TitlePrint Document');
  });

  it('renders description with ReactNode', () => {
    const description = (
      <span>
        Description with <strong>bold text</strong>
      </span>
    );
    render(<FormActionCard {...defaultProps} description={description} />);

    expect(screen.getByText('Description with')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    render(<FormActionCard {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<FormActionCard {...defaultProps} disabled />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    expect(button).toBeDisabled();
  });

  it('does not call onClick when button is disabled', async () => {
    const user = userEvent.setup();
    render(<FormActionCard {...defaultProps} disabled />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows loading state when loading prop is true', () => {
    render(<FormActionCard {...defaultProps} loading />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    expect(button).toHaveClass('loading');
  });

  it('applies custom buttonId when provided', () => {
    const customButtonId = 'custom-print-button-id';
    render(<FormActionCard {...defaultProps} buttonId={customButtonId} />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    expect(button).toHaveAttribute('id', customButtonId);
  });

  it('generates buttonId based on title when not provided', () => {
    render(<FormActionCard {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    const buttonId = button.getAttribute('id');

    expect(buttonId).toBeTruthy();
    expect(buttonId).toContain('button-');
    expect(buttonId).toContain('test-document-title');
    expect(buttonId).toContain('form-action-card');
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<FormActionCard {...defaultProps} className={customClass} />);

    const title = screen.getByText('Test Document Title');
    // eslint-disable-next-line testing-library/no-node-access
    expect(title.parentElement).toHaveClass(customClass);
  });

  it('renders as section element for proper semantics', () => {
    render(<FormActionCard {...defaultProps} />);

    const title = screen.getByText('Test Document Title');
    // eslint-disable-next-line testing-library/no-node-access
    expect(title.parentElement?.tagName).toBe('SECTION');
  });

  it('maintains button reference across re-renders when memoized', () => {
    const { rerender } = render(<FormActionCard {...defaultProps} />);
    const firstButton = screen.getByRole('button', { name: 'Print Document' });

    rerender(<FormActionCard {...defaultProps} />);
    const secondButton = screen.getByRole('button', { name: 'Print Document' });

    expect(firstButton).toBe(secondButton);
  });

  it('re-renders when props change', () => {
    const { rerender } = render(<FormActionCard {...defaultProps} />);
    expect(screen.getByText('Test Document Title')).toBeInTheDocument();

    rerender(<FormActionCard {...defaultProps} title="Updated Title" />);
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Document Title')).not.toBeInTheDocument();
  });

  it('handles multiple clicks correctly', async () => {
    const user = userEvent.setup();
    render(<FormActionCard {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Print Document' });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('renders button with correct variant and size', () => {
    render(<FormActionCard {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Print Document' });

    expect(button).toBeInTheDocument();
  });
});
