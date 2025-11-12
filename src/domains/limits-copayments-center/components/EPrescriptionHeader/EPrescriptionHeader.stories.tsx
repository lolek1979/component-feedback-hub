import type { Meta, StoryObj } from '@storybook/react';

import { EPrescriptionHeader } from './EPrescriptionHeader';

const meta: Meta<typeof EPrescriptionHeader> = {
  title: 'Molecules/EPrescriptionHeader',
  component: EPrescriptionHeader,
  argTypes: {
    date: {
      control: 'text',
      description: 'The date of the prescription in DD. MM. YYYY HH:MM format',
    },
    prescriptionCode: {
      control: 'text',
      description: 'The unique code of the prescription',
    },
  },
};

export default meta;

type Story = StoryObj<typeof EPrescriptionHeader>;

export const Default: Story = {
  args: {
    date: '17. 12. 2024 14:24',
    prescriptionCode: 'eRecept ERP-2024-00123',
  },
};
