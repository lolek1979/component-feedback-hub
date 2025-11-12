import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { Button } from './Button';

describe('Button', () => {
  it('should render the button with children', () => {
    render(
      <Button variant="primary" id="test">
        Test Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Test Button/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should apply the primary variant class', () => {
    render(
      <Button variant="primary" id="test">
        Primary Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Primary Button/i });
    expect(buttonElement).toHaveClass('primary');
  });

  it('should apply the secondary variant class', () => {
    render(
      <Button variant="secondary" id="test">
        Secondary Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Secondary Button/i });
    expect(buttonElement).toHaveClass('secondary');
  });

  it('should apply the small size class', () => {
    render(
      <Button size="small" id="test">
        Small Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Small Button/i });
    expect(buttonElement).toHaveClass('small');
  });

  it('should apply the medium size class', () => {
    render(
      <Button size="medium" id="test">
        Medium Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Medium Button/i });
    expect(buttonElement).toHaveClass('medium');
  });

  it('should apply the large size class', () => {
    render(
      <Button size="large" id="test">
        Large Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Large Button/i });
    expect(buttonElement).toHaveClass('large');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Button disabled id="test">
        Disabled Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Disabled Button/i });
    expect(buttonElement).toBeDisabled();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} id="test">
        Clickable Button
      </Button>,
    );
    const buttonElement = screen.getByRole('button', { name: /Clickable Button/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
