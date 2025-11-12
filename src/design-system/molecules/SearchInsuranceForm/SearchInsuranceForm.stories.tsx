import type { Meta, StoryObj } from '@storybook/nextjs';

import { SearchInsuranceForm } from './SearchInsuranceForm';

const meta: Meta<typeof SearchInsuranceForm> = {
  title: 'Organisms/SearchInsuranceForm',
  component: SearchInsuranceForm,
  argTypes: {
    isSubmitting: {
      description: 'Indicates if the form has been submitted',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInsuranceForm>;

export const Default: Story = {};
