import React from 'react';
import { render, screen } from '@testing-library/react';

import { Typography } from './Typography';

describe('Typography', () => {
  it('renders typography with text content', () => {
    render(<Typography>Test Typography</Typography>);
    expect(screen.getByText('Test Typography')).toBeInTheDocument();
  });

  it('applies default component as span', () => {
    render(<Typography>Default span</Typography>);
    const element = screen.getByText('Default span');
    expect(element.tagName.toLowerCase()).toBe('span');
  });

  it('renders with custom component', () => {
    render(<Typography component="h1">Heading text</Typography>);
    const element = screen.getByText('Heading text');
    expect(element.tagName.toLowerCase()).toBe('h1');
  });

  it('applies default variant Body/Regular', () => {
    render(<Typography>Default variant</Typography>);
    const element = screen.getByText('Default variant');
    expect(element).toHaveClass('bodyRegular');
  });

  it('applies custom variant', () => {
    render(<Typography variant="H1/Bold">Bold heading</Typography>);
    const element = screen.getByText('Bold heading');
    expect(element).toHaveClass('h1Bold');
  });

  it('applies default align inherit', () => {
    render(<Typography>Default align</Typography>);
    const element = screen.getByText('Default align');
    expect(element).toHaveClass('alignInherit');
  });

  it('applies custom align', () => {
    render(<Typography align="center">Centered text</Typography>);
    const element = screen.getByText('Centered text');
    expect(element).toHaveClass('alignCenter');
  });

  it('applies custom className', () => {
    const customClass = 'custom-typography';
    render(<Typography className={customClass}>Custom class</Typography>);
    const element = screen.getByText('Custom class');
    expect(element).toHaveClass('typography', 'bodyRegular', 'alignInherit', customClass);
  });

  it('renders with all typography classes applied', () => {
    render(
      <Typography variant="H2/Bold" align="right" className="extra-class">
        Full test
      </Typography>,
    );
    const element = screen.getByText('Full test');
    expect(element).toHaveClass('typography', 'h2Bold', 'alignRight', 'extra-class');
  });

  describe('variant mapping', () => {
    const variantTests = [
      { variant: 'H1/Bold', expectedClass: 'h1Bold' },
      { variant: 'H1/Regular', expectedClass: 'h1Regular' },
      { variant: 'H2/Bold', expectedClass: 'h2Bold' },
      { variant: 'H2/Regular', expectedClass: 'h2Regular' },
      { variant: 'H3/Bold', expectedClass: 'h3Bold' },
      { variant: 'H3/Regular', expectedClass: 'h3Regular' },
      { variant: 'H4/Bold', expectedClass: 'h4Bold' },
      { variant: 'H4/Regular', expectedClass: 'h4Regular' },
      { variant: 'H4/Light', expectedClass: 'h4Light' },
      { variant: 'H4/Link-inline', expectedClass: 'h4LinkInline' },
      { variant: 'Headline/Bold', expectedClass: 'headlineBold' },
      { variant: 'Headline/Regular', expectedClass: 'headlineRegular' },
      { variant: 'Headline/Light', expectedClass: 'headlineLight' },
      { variant: 'Headline/Link-inline', expectedClass: 'headlineLinkInline' },
      { variant: 'Body/Bold', expectedClass: 'bodyBold' },
      { variant: 'Body/Regular', expectedClass: 'bodyRegular' },
      { variant: 'Body/Light', expectedClass: 'bodyLight' },
      { variant: 'Body/Link-inline', expectedClass: 'bodyLinkInline' },
      { variant: 'Subtitle/Default/Bold', expectedClass: 'subtitleBold' },
      { variant: 'Subtitle/Default/Regular', expectedClass: 'subtitleRegular' },
      { variant: 'Subtitle/Default/Link-inline', expectedClass: 'subtitleLinkInline' },
      {
        variant: 'Subtitle/Default/Link-dotted-regular',
        expectedClass: 'subtitleLinkDottedRegular',
      },
      { variant: 'Subtitle/Default/Link-dotted-bold', expectedClass: 'subtitleLinkDottedBold' },
      { variant: 'Caption/Regular', expectedClass: 'captionRegular' },
      { variant: 'Caption/Link-inline', expectedClass: 'captionLinkInline' },
      { variant: 'Caption/Link-dotted-regular', expectedClass: 'captionLinkDottedRegular' },
      { variant: 'Caption/Link-dotted-bold', expectedClass: 'captionLinkDottedBold' },
      { variant: 'Footnote/Bold', expectedClass: 'footnoteBold' },
      { variant: 'Footnote/Regular', expectedClass: 'footnoteRegular' },
      { variant: 'Footnote/Link-inline', expectedClass: 'footnoteLinkInline' },
    ] as const;

    variantTests.forEach(({ variant, expectedClass }) => {
      it(`applies correct class for ${variant}`, () => {
        render(<Typography variant={variant}>Test {variant}</Typography>);
        const element = screen.getByText(`Test ${variant}`);
        expect(element).toHaveClass(expectedClass);
      });
    });
  });

  describe('align mapping', () => {
    const alignTests = [
      { align: 'left', expectedClass: 'alignLeft' },
      { align: 'center', expectedClass: 'alignCenter' },
      { align: 'right', expectedClass: 'alignRight' },
      { align: 'justify', expectedClass: 'alignJustify' },
      { align: 'inherit', expectedClass: 'alignInherit' },
    ] as const;

    alignTests.forEach(({ align, expectedClass }) => {
      it(`applies correct class for align="${align}"`, () => {
        render(<Typography align={align}>Test {align}</Typography>);
        const element = screen.getByText(`Test ${align}`);
        expect(element).toHaveClass(expectedClass);
      });
    });
  });

  it('passes through additional props to the component', () => {
    const linkProps = { href: 'https://example.com', title: 'Test link' };
    render(
      <Typography component="a" {...linkProps}>
        Link text
      </Typography>,
    );
    const element = screen.getByText('Link text');
    expect(element).toHaveAttribute('href', 'https://example.com');
    expect(element).toHaveAttribute('title', 'Test link');
  });
});
