import CrossMark from '@/core/assets/icons/icon-error.svg';
import SuccessMark from '@/core/assets/icons/icon-success.svg';
import ArrowDown from '@/core/assets/icons/keyboard_arrow_down.svg';
import { render, screen } from '@/core/tests/test-utils';

import { InlineMessage } from './InlineMessage';

describe('InlineMessage', () => {
  it('should render the default message', () => {
    render(
      <InlineMessage
        id="inline-message-test-default"
        icon={<ArrowDown />}
        message="This is a default inline message."
        variant="default"
      />,
    );

    expect(screen.getByText(/This is a default inline message./i)).toBeInTheDocument();
  });

  it('should render a success message', () => {
    render(
      <InlineMessage
        id="inline-message-test-success"
        icon={<SuccessMark />}
        message="This is a success message."
        variant="success"
      />,
    );

    expect(screen.getByText(/This is a success message./i)).toBeInTheDocument();
  });

  it('should render a warning message', () => {
    render(
      <InlineMessage
        id="inline-message-test-warning"
        icon={<ArrowDown />}
        message="This is a warning message."
        variant="warning"
      />,
    );

    expect(screen.getByText(/This is a warning message./i)).toBeInTheDocument();
  });

  it('should render an error message', () => {
    render(
      <InlineMessage
        id="inline-message-test-error"
        icon={<CrossMark />}
        message="This is an error message."
        variant="error"
      />,
    );

    expect(screen.getByText(/This is an error message./i)).toBeInTheDocument();
  });

  it('should render an info message', () => {
    render(
      <InlineMessage
        id="inline-message-test-info"
        icon={<ArrowDown />}
        message="This is an info message."
        variant="info"
      />,
    );

    expect(screen.getByText(/This is an info message./i)).toBeInTheDocument();
  });

  it('should apply the correct variant class', () => {
    render(
      <InlineMessage
        id="inline-message-test-variant"
        icon={<ArrowDown />}
        message="Variant test"
        variant="error"
      />,
    );

    const messageElement = screen.getByText(/Variant test/i).closest('div');
    expect(messageElement).toHaveClass('error');
  });
});
