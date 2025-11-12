import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { CommentsSection } from './CommentsSection';

import '@testing-library/jest-dom';

const setup = (props: Partial<React.ComponentProps<typeof CommentsSection>> = {}) => {
  const defaultProps = {
    externalCommentLabel: 'External Comment',
    internalCommentLabel: 'Internal Comment',
    ...props,
  };

  return render(<CommentsSection {...defaultProps} />);
};

describe('CommentsSection', () => {
  it('renders without title', () => {
    setup();
    expect(screen.getByText('External Comment')).toBeInTheDocument();
    expect(screen.getByText('Internal Comment')).toBeInTheDocument();
  });

  it('renders with title', () => {
    setup({ title: 'Comments' });
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders external comment textarea with placeholder', () => {
    setup({ externalCommentPlaceholder: 'Enter external comment' });
    expect(screen.getByPlaceholderText('Enter external comment')).toBeInTheDocument();
  });

  it('renders internal comment textarea with placeholder', () => {
    setup({ internalCommentPlaceholder: 'Enter internal comment' });
    expect(screen.getByPlaceholderText('Enter internal comment')).toBeInTheDocument();
  });

  it('renders external comment textarea with helper text', () => {
    setup({ externalCommentHelper: 'This is a helper text' });
    expect(screen.getByText('This is a helper text')).toBeInTheDocument();
  });

  it('renders internal comment textarea with helper text', () => {
    setup({ internalCommentHelper: 'Internal helper text' });
    expect(screen.getByText('Internal helper text')).toBeInTheDocument();
  });

  it('calls onExternalCommentChange when external comment changes', () => {
    const onExternalCommentChange = jest.fn();
    setup({ onExternalCommentChange, externalCommentPlaceholder: 'Enter external comment' });

    const textarea = screen.getByPlaceholderText('Enter external comment');
    fireEvent.change(textarea, { target: { value: 'New external comment' } });

    expect(onExternalCommentChange).toHaveBeenCalledWith('New external comment');
  });

  it('calls onInternalCommentChange when internal comment changes', () => {
    const onInternalCommentChange = jest.fn();
    setup({ onInternalCommentChange, internalCommentPlaceholder: 'Enter internal comment' });

    const textarea = screen.getByPlaceholderText('Enter internal comment');
    fireEvent.change(textarea, { target: { value: 'New internal comment' } });

    expect(onInternalCommentChange).toHaveBeenCalledWith('New internal comment');
  });

  it('displays external comment value', () => {
    setup({
      externalCommentValue: 'Existing external comment',
      externalCommentPlaceholder: 'Enter external comment',
    });
    const textarea = screen.getByPlaceholderText('Enter external comment');
    expect(textarea).toHaveValue('Existing external comment');
  });

  it('displays internal comment value', () => {
    setup({
      internalCommentValue: 'Existing internal comment',
      internalCommentPlaceholder: 'Enter internal comment',
    });
    const textarea = screen.getByPlaceholderText('Enter internal comment');
    expect(textarea).toHaveValue('Existing internal comment');
  });

  it('applies custom maxLength to textareas', () => {
    setup({
      maxLength: 200,
      externalCommentPlaceholder: 'Enter external comment',
      internalCommentPlaceholder: 'Enter internal comment',
    });
    const externalTextarea = screen.getByPlaceholderText('Enter external comment');
    const internalTextarea = screen.getByPlaceholderText('Enter internal comment');

    expect(externalTextarea).toHaveAttribute('maxlength', '200');
    expect(internalTextarea).toHaveAttribute('maxlength', '200');
  });
});
