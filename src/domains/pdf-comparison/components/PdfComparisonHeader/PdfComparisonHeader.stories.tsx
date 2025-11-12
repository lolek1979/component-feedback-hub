import type { Meta, StoryObj } from '@storybook/react';

import { PdfComparisonHeader } from './PdfComparisonHeader';

const meta: Meta<typeof PdfComparisonHeader> = {
  title: 'Domains/PdfComparison/PdfComparisonHeader',
  component: PdfComparisonHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A header component that displays the match percentage for PDF comparison results.',
      },
    },
  },
  argTypes: {
    matchPercentage: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 0.1,
      },
      description: 'The percentage of content that matches between the two PDFs',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    id: {
      control: 'text',
      description: 'HTML id attribute',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    matchPercentage: 85.5,
  },
};

export const HighMatch: Story = {
  args: {
    matchPercentage: 95.2,
  },
};

export const LowMatch: Story = {
  args: {
    matchPercentage: 42.8,
  },
};

export const PerfectMatch: Story = {
  args: {
    matchPercentage: 100,
  },
};

export const NoMatch: Story = {
  args: {
    matchPercentage: 0,
  },
};

export const WithCustomClass: Story = {
  args: {
    matchPercentage: 75.5,
    className: 'custom-header-class',
    id: 'custom-header-id',
  },
};
