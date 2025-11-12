import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { Textarea } from '.';

describe('Textarea', () => {
  it('should render the textarea with placeholder', () => {
    render(<Textarea placeholder="Zadejte text" id="Test" name="Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Zadejte text');
    expect(textareaElement).toBeInTheDocument();
  });

  it('should render the textarea with the correct id and name', () => {
    render(<Textarea placeholder="Zadejte text" id="Test" name="Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Zadejte text');
    expect(textareaElement).toHaveAttribute('id', 'Test');
    expect(textareaElement).toHaveAttribute('name', 'Textarea');
  });

  it('should handle input changes', () => {
    render(<Textarea placeholder="Zadejte text" id="Test" name="Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Zadejte text');
    fireEvent.change(textareaElement, { target: { value: 'New text' } });
    expect(textareaElement).toHaveValue('New text');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea placeholder="Zadejte text" id="Test" name="Textarea" disabled />);
    const textareaElement = screen.getByPlaceholderText('Zadejte text');
    expect(textareaElement).toBeDisabled();
  });

  it('should render with the correct value', () => {
    render(<Textarea placeholder="Zadejte text" id="Test" name="Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Zadejte text');
    expect(textareaElement).toBeInTheDocument;
  });
});
