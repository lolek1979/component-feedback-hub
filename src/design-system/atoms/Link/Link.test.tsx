import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { AppLink } from './Link';

describe('AppLink', () => {
  it('should render the link with children', () => {
    render(
      <AppLink link="#" target="_self">
        Test Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Test Link/i });
    expect(linkElement).toBeInTheDocument();
  });

  it('should apply the primary style class', () => {
    render(
      <AppLink link="#" target="_self" variant="primary">
        Primary Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Primary Link/i });
    expect(linkElement).toHaveClass('primary');
  });

  it('should apply the secondary style class', () => {
    render(
      <AppLink link="#" target="_self" variant="secondary">
        Secondary Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Secondary Link/i });
    expect(linkElement).toHaveClass('secondary');
  });

  it('should apply the tertiary style class', () => {
    render(
      <AppLink link="#" target="_self" variant="tertiary">
        Tertiary Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Tertiary Link/i });
    expect(linkElement).toHaveClass('tertiary');
  });

  it('should open link in a new tab when target is _blank', () => {
    render(
      <AppLink link="#" target="_blank">
        New Tab Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /New Tab Link/i });
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('should change style on hover', () => {
    render(
      <AppLink link="#" target="_self" variant="primary">
        Hover Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Hover Link/i });
    fireEvent.mouseOver(linkElement);
    expect(linkElement).toHaveStyle('color: var(--icon-hover-color)');
  });

  it('should change style on active', () => {
    render(
      <AppLink link="#" target="_self" variant="primary">
        Active Link
      </AppLink>,
    );
    const linkElement = screen.getByRole('link', { name: /Active Link/i });
    fireEvent.mouseDown(linkElement);
    expect(linkElement).toHaveStyle('color: var(--icon-active-color)');
  });
});
