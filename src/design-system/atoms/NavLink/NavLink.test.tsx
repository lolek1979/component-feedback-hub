import { render, screen } from '@testing-library/react';

import { NavLink } from './NavLink';
import styles from './NavLink.module.css';

import '@testing-library/jest-dom';

describe('NavLink component', () => {
  const href = '/example';
  const childrenText = 'Example Link';

  test('renders the link with correct href and children', () => {
    render(<NavLink href={href}>{childrenText}</NavLink>);

    const linkElement = screen.getByRole('link', { name: childrenText });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', href);
  });

  test('applies the default navLink class', () => {
    render(<NavLink href={href}>{childrenText}</NavLink>);

    const linkElement = screen.getByRole('link', { name: childrenText });
    expect(linkElement).toHaveClass(styles.navLink);
  });

  test('does not apply the active class when active prop is false', () => {
    render(<NavLink href={href}>{childrenText}</NavLink>);

    const linkElement = screen.getByRole('link', { name: childrenText });
    expect(linkElement).not.toHaveClass(styles.active);
  });

  test('applies additional className passed as prop', () => {
    const customClassName = 'custom-class';
    render(
      <NavLink href={href} className={customClassName}>
        {childrenText}
      </NavLink>,
    );

    const linkElement = screen.getByRole('link', { name: childrenText });
    expect(linkElement).toHaveClass(customClassName);
  });

  test('combines navLink and additional className when all are present', () => {
    const customClassName = 'custom-class';
    render(
      <NavLink href={href} className={customClassName}>
        {childrenText}
      </NavLink>,
    );

    const linkElement = screen.getByRole('link', { name: childrenText });
    expect(linkElement).toHaveClass(styles.navLink);
    expect(linkElement).toHaveClass(customClassName);
  });
});
