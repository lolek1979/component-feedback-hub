import React from 'react';
import { render, screen } from '@testing-library/react';

import { Text } from './Text';

describe('Text', () => {
  it('renders with default variant', () => {
    render(<Text>Default text</Text>);
    const textElement = screen.getByText('Default text');
    expect(textElement).toBeInTheDocument();
    expect(textElement.tagName).toBe('SPAN');
    expect(textElement).toHaveClass('body');
  });

  it('renders with custom variant', () => {
    render(<Text variant="h1">Heading 1</Text>);
    const headingElement = screen.getByText('Heading 1');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H1');
    expect(headingElement).toHaveClass('h1');
  });

  it('applies custom className', () => {
    render(<Text className="custom-class">Custom class text</Text>);
    const textElement = screen.getByText('Custom class text');
    expect(textElement).toHaveClass('custom-class');
  });

  it('applies gutterBottom', () => {
    render(<Text gutterBottom>Gutter bottom text</Text>);
    const textElement = screen.getByText('Gutter bottom text');
    expect(textElement).toHaveClass('gutterBottom');
  });

  it('applies noWrap', () => {
    render(<Text noWrap>No wrap text</Text>);
    const textElement = screen.getByText('No wrap text');
    expect(textElement).toHaveClass('noWrap');
  });

  it('applies align', () => {
    render(<Text align="center">Centered text</Text>);
    const textElement = screen.getByText('Centered text');
    expect(textElement).toHaveClass('alignCenter');
  });

  it('renders footnote variant', () => {
    render(<Text variant="footnote">Footnote text</Text>);
    const footnoteElement = screen.getByText('Footnote text');
    expect(footnoteElement).toBeInTheDocument();
    expect(footnoteElement.tagName).toBe('SPAN');
    expect(footnoteElement).toHaveClass('footnote');
  });
});
