import type { Meta, StoryObj } from '@storybook/nextjs';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'headline',
        'body',
        'subtitle',
        'subtitle-article',
        'caption',
        'footnote',
        'label',
      ],
      description: 'The variant of the text.',
      table: {
        type: {
          summary:
            'h1 | h2 | h3 | h4 | headline | body | subtitle | subtitle-article | caption | footnote | label',
        },
        defaultValue: { summary: 'body' },
      },
    },
    component: {
      control: 'text',
      description: 'The component to render.',
    },
    gutterBottom: {
      control: 'boolean',
      description: 'Adds bottom margin to the text.',
    },
    noWrap: {
      control: 'boolean',
      description: 'Prevents the text from wrapping.',
    },
    align: {
      control: {
        type: 'select',
        options: ['left', 'center', 'right', 'justify'],
      },
      description: 'The alignment of the text.',
    },
    children: {
      control: 'text',
      description: 'The content of the text.',
    },
    className: {
      control: 'text',
      description: 'Additional class names for the text.',
    },
    role: {
      control: 'text',
      description: 'The ARIA role of the text.',
    },
    id: {
      control: 'text',
      description: 'The ID of the text.',
    },
    ariaLabel: {
      control: 'text',
      description: 'The ARIA label of the text.',
    },
    ariaLabelledby: {
      control: 'text',
      description: 'The ARIA labelledby attribute of the text.',
    },
    selectable: {
      control: 'boolean',
      description: 'Determines if the text is selectable.',
    },
    ariaHidden: {
      control: 'boolean',
      description: 'Determines if the text is hidden from ARIA.',
    },
    ariaLive: {
      control: {
        type: 'select',
        options: ['off', 'polite', 'assertive'],
      },
      description: 'Determines the ARIA live status of the text.',
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'disabled', 'brand', 'inverse'],
      },
      description: 'The color of the text.',
    },
    underline: {
      control: 'boolean',
      description: 'Adds underline to the text.',
      defaultValue: false,
    },
    regular: {
      control: 'boolean',
      description: 'Sets the text to regular weight.',
      defaultValue: false,
    },
    dotted: {
      control: 'boolean',
      description: 'Adds a dotted style to the text.',
      defaultValue: false,
    },
    light: {
      control: 'boolean',
      description: 'Sets the text to light weight.',
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'This is a text component',
    variant: 'body',
  },
};

export const Heading1: Story = {
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
};

export const Heading2: Story = {
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
};

export const Heading3: Story = {
  args: {
    children: 'Heading 3',
    variant: 'h3',
  },
};
export const Heading4: Story = {
  args: {
    children: 'Heading 4',
    variant: 'h4',
  },
};
export const Headline: Story = {
  args: {
    children: 'Headline',
    variant: 'headline',
  },
};

export const Subtitle: Story = {
  args: {
    children: 'Subtitle',
    variant: 'subtitle',
  },
};
export const SubtitleArticle: Story = {
  args: {
    children: 'Subtitle-article',
    variant: 'subtitle-article',
  },
};

export const Body: Story = {
  args: {
    children: 'Body text',
    variant: 'body',
  },
};

export const Caption: Story = {
  args: {
    children: 'Caption text',
    variant: 'caption',
  },
};

export const GutterBottom: Story = {
  args: {
    children: 'Text with gutter bottom',
    variant: 'body',
    gutterBottom: true,
  },
};

export const NoWrap: Story = {
  args: {
    children: 'This is a very long text that should not wrap to the next line',
    variant: 'body',
    noWrap: true,
  },
};

export const AlignCenter: Story = {
  args: {
    children: 'This text is centered',
    variant: 'body',
    align: 'center',
  },
};

export const CustomComponent: Story = {
  args: {
    children: 'This is rendered as a custom component',
    variant: 'body',
    component: 'div',
  },
};

export const Footnote: Story = {
  args: {
    children: 'This is a footnote',
    variant: 'footnote',
  },
};

export const Label: Story = {
  args: {
    children: 'Label text',
    variant: 'label',
    htmlFor: 'input',
  },
};

export const ColoredText: Story = {
  args: {
    children: 'This is primary colored text',
    variant: 'body',
    color: 'primary',
  },
};
