import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Typography } from './Typography';

const meta = {
  title: 'Molecules/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'The text content to be displayed',
      control: 'text',
    },
    component: {
      description: 'The HTML element to render',
      control: 'select',
      options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'a', 'strong', 'em'],
    },
    variant: {
      description: 'Typography variant based on design system',
      control: 'select',
      options: [
        'H1/Bold',
        'H1/Regular',
        'H2/Bold',
        'H2/Regular',
        'H3/Bold',
        'H3/Regular',
        'H4/Bold',
        'H4/Regular',
        'H4/Light',
        'H4/Link-inline',
        'Headline/Bold',
        'Headline/Regular',
        'Headline/Light',
        'Headline/Link-inline',
        'Body/Bold',
        'Body/Regular',
        'Body/Light',
        'Body/Link-inline',
        'Subtitle/Default/Bold',
        'Subtitle/Default/Regular',
        'Subtitle/Default/Link-inline',
        'Subtitle/Default/Link-dotted-regular',
        'Subtitle/Default/Link-dotted-bold',
        'Caption/Bold',
        'Caption/Regular',
        'Caption/Link-inline',
        'Caption/Link-dotted-regular',
        'Caption/Link-dotted-bold',
        'Footnote/Bold',
        'Footnote/Regular',
        'Footnote/Link-inline',
      ],
    },
    align: {
      description: 'Text alignment',
      control: 'radio',
      options: ['left', 'center', 'right', 'justify', 'inherit'],
    },
    className: {
      description: 'Additional CSS class names',
      control: 'text',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is the default Body/Regular typography',
    variant: 'Body/Regular',
  },
};

// Heading Stories
export const H1Bold: Story = {
  args: {
    component: 'h1',
    children: 'H1 Bold Heading',
    variant: 'H1/Bold',
  },
};

export const H1Regular: Story = {
  args: {
    component: 'h1',
    children: 'H1 Regular Heading',
    variant: 'H1/Regular',
  },
};

export const H2Bold: Story = {
  args: {
    component: 'h2',
    children: 'H2 Bold Heading',
    variant: 'H2/Bold',
  },
};

export const H2Regular: Story = {
  args: {
    component: 'h2',
    children: 'H2 Regular Heading',
    variant: 'H2/Regular',
  },
};

export const H3Bold: Story = {
  args: {
    component: 'h3',
    children: 'H3 Bold Heading',
    variant: 'H3/Bold',
  },
};

export const H3Regular: Story = {
  args: {
    component: 'h3',
    children: 'H3 Regular Heading',
    variant: 'H3/Regular',
  },
};

export const H4Bold: Story = {
  args: {
    component: 'h4',
    children: 'H4 Bold Heading',
    variant: 'H4/Bold',
  },
};

export const H4Regular: Story = {
  args: {
    component: 'h4',
    children: 'H4 Regular Heading',
    variant: 'H4/Regular',
  },
};

export const H4Light: Story = {
  args: {
    component: 'h4',
    children: 'H4 Light Heading',
    variant: 'H4/Light',
  },
};

export const H4LinkInline: Story = {
  args: {
    component: 'a',
    children: 'H4 Link Inline',
    variant: 'H4/Link-inline',
  },
};

// Headline Stories
export const HeadlineBold: Story = {
  args: {
    children: 'Headline Bold Text',
    variant: 'Headline/Bold',
  },
};

export const HeadlineRegular: Story = {
  args: {
    children: 'Headline Regular Text',
    variant: 'Headline/Regular',
  },
};

export const HeadlineLight: Story = {
  args: {
    children: 'Headline Light Text',
    variant: 'Headline/Light',
  },
};

export const HeadlineLinkInline: Story = {
  args: {
    component: 'a',
    children: 'Headline Link Inline',
    variant: 'Headline/Link-inline',
  },
};

// Body Stories
export const BodyBold: Story = {
  args: {
    component: 'p',
    children: 'Body Bold text for emphasis and important content.',
    variant: 'Body/Bold',
  },
};

export const BodyRegular: Story = {
  args: {
    component: 'p',
    children: 'Body Regular text is the standard text for most content in the application.',
    variant: 'Body/Regular',
  },
};

export const BodyLight: Story = {
  args: {
    component: 'p',
    children: 'Body Light text for secondary or less important content.',
    variant: 'Body/Light',
  },
};

export const BodyLinkInline: Story = {
  args: {
    component: 'a',
    children: 'Body Link Inline for clickable text within paragraphs',
    variant: 'Body/Link-inline',
  },
};

// Subtitle Stories
export const SubtitleBold: Story = {
  args: {
    children: 'Subtitle Bold Text',
    variant: 'Subtitle/Default/Bold',
  },
};

export const SubtitleRegular: Story = {
  args: {
    children: 'Subtitle Regular Text',
    variant: 'Subtitle/Default/Regular',
  },
};

export const SubtitleLinkInline: Story = {
  args: {
    component: 'a',
    children: 'Subtitle Link Inline',
    variant: 'Subtitle/Default/Link-inline',
  },
};

export const SubtitleLinkDottedRegular: Story = {
  args: {
    component: 'a',
    children: 'Subtitle Link Dotted Regular',
    variant: 'Subtitle/Default/Link-dotted-regular',
  },
};

export const SubtitleLinkDottedBold: Story = {
  args: {
    component: 'a',
    children: 'Subtitle Link Dotted Bold',
    variant: 'Subtitle/Default/Link-dotted-bold',
  },
};

// Caption Stories
export const CaptionBold: Story = {
  args: {
    children: 'Caption Bold',
    variant: 'Caption/Bold',
  },
};

export const CaptionRegular: Story = {
  args: {
    children: 'Caption Regular for small descriptive text',
    variant: 'Caption/Regular',
  },
};

export const CaptionLinkInline: Story = {
  args: {
    component: 'a',
    children: 'Caption Link Inline',
    variant: 'Caption/Link-inline',
  },
};

export const CaptionLinkDottedRegular: Story = {
  args: {
    component: 'a',
    children: 'Caption Link Dotted Regular',
    variant: 'Caption/Link-dotted-regular',
  },
};

export const CaptionLinkDottedBold: Story = {
  args: {
    component: 'a',
    children: 'Caption Link Dotted Bold',
    variant: 'Caption/Link-dotted-bold',
  },
};

// Footnote Stories
export const FootnoteBold: Story = {
  args: {
    children: 'Footnote Bold for small important text',
    variant: 'Footnote/Bold',
  },
};

export const FootnoteRegular: Story = {
  args: {
    children: 'Footnote Regular for the smallest text elements',
    variant: 'Footnote/Regular',
  },
};

export const FootnoteLinkInline: Story = {
  args: {
    component: 'a',
    children: 'Footnote Link Inline',
    variant: 'Footnote/Link-inline',
  },
};

// Alignment Examples
export const AlignmentShowcase: Story = {
  args: {
    children: 'Alignment showcase',
  },
  render: () => (
    <div style={{ width: '400px' }}>
      <Typography variant="Body/Bold" align="left">
        Left aligned text
      </Typography>
      <Typography variant="Body/Bold" align="center">
        Center aligned text
      </Typography>
      <Typography variant="Body/Bold" align="right">
        Right aligned text
      </Typography>
      <Typography variant="Body/Regular" align="justify">
        Justified text that wraps to multiple lines to demonstrate the justify alignment behavior
        with longer content.
      </Typography>
    </div>
  ),
};

// Component Showcase
export const ComponentShowcase: Story = {
  args: {
    children: 'Component showcase',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography component="h1" variant="H1/Bold">
        Article Title
      </Typography>
      <Typography component="h2" variant="H2/Regular">
        Section Heading
      </Typography>
      <Typography component="p" variant="Body/Regular">
        This is a paragraph with regular body text. It can contain
        <Typography component="a" variant="Body/Link-inline">
          {' '}
          inline links{' '}
        </Typography>
        and{' '}
        <Typography component="strong" variant="Body/Bold">
          bold text
        </Typography>{' '}
        for emphasis.
      </Typography>
      <Typography component="p" variant="Subtitle/Default/Regular">
        This is a subtitle providing additional context.
      </Typography>
      <Typography component="small" variant="Caption/Regular">
        Caption text for additional details.
      </Typography>
      <Typography component="span" variant="Footnote/Regular">
        Footnote text for the smallest details.
      </Typography>
    </div>
  ),
};
