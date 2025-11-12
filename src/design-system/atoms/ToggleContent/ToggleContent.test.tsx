/* eslint-disable testing-library/no-node-access */
import userEvent from '@testing-library/user-event';

import { render, screen } from '@/core/tests/test-utils';

import { ToggleContent } from './ToggleContent';

describe('ToggleContent', () => {
  it('renders with title and content', () => {
    render(
      <ToggleContent title="Test Title">
        <p>Test Content</p>
      </ToggleContent>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('starts expanded when collapsed prop is false', () => {
    render(
      <ToggleContent title="Test Title" collapsed={false}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    const content = screen.getByText('Test Content');
    expect(content).toBeVisible();
    expect(content.closest('div')).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('starts collapsed when collapsed prop is true', () => {
    render(
      <ToggleContent title="Test Title" collapsed={true}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    const content = screen.getByText('Test Content');
    expect(content.closest('div')).toHaveAttribute('aria-hidden', 'true');
  });

  it('toggles expanded/collapsed when header is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToggleContent title="Test Title" collapsed={true}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    let contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByText('Test Title'));

    contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).not.toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByText('Test Title'));

    contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onToggle callback when toggled', async () => {
    const onToggleMock = jest.fn();
    const user = userEvent.setup();

    render(
      <ToggleContent title="Test Title" collapsed={true} onToggle={onToggleMock}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    await user.click(screen.getByText('Test Title'));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  it('cannot be toggled when disabled', async () => {
    const onToggleMock = jest.fn();
    const user = userEvent.setup();

    render(
      <ToggleContent title="Test Title" collapsed={true} isDisabled={true} onToggle={onToggleMock}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    await user.click(screen.getByText('Test Title'));

    expect(onToggleMock).not.toHaveBeenCalled();

    const contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with active step styling when isActiveStep is true', () => {
    render(
      <ToggleContent title="Test Title" isActiveStep={true}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    const header = screen.getByText('Test Title').closest('div');
    expect(header).toHaveClass('toggleTitleContainer');
  });

  it('updates collapsed state when collapsed prop changes', () => {
    const { rerender } = render(
      <ToggleContent title="Test Title" collapsed={true}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    let contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <ToggleContent title="Test Title" collapsed={false}>
        <p>Test Content</p>
      </ToggleContent>,
    );

    contentContainer = screen.getByText('Test Content').closest('div');
    expect(contentContainer).not.toHaveAttribute('aria-hidden', 'true');
  });
});
