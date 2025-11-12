import type { Meta, StoryObj } from '@storybook/react';

import { UnsavedChangesProvider } from '@/core/providers/UnsavedChangesProvider';

import { PrescriptionReport } from './PrescriptionReport';

const meta: Meta<typeof PrescriptionReport> = {
  title: 'Organisms/PrescriptionReport',
  component: PrescriptionReport,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <UnsavedChangesProvider>
        <Story />
      </UnsavedChangesProvider>
    ),
  ],
  argTypes: {
    patientName: { description: 'Name of the patient' },
    patientId: { description: 'ID of the patient' },
    dateRange: { description: 'Date range for the report' },
    dataSource: { description: 'Source of the data' },
    limitAmount: { description: 'Limit amount for the patient' },
    transactions: { description: 'List of transactions' },
  },
};

export default meta;
type Story = StoryObj<typeof PrescriptionReport>;

export const Default: Story = {
  args: {
    patientName: 'Michal Novák',
    patientId: '1234567890',
    dateRange: '1. 1. 2024 - 31. 12. 2024',
    dataSource: 'Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv',
    limitAmount: 2000,
    transactions: [
      {
        date: '2024-12-17',
        receiptId: 'eRecept ERP-2024-00123',
        expenditureId: 'VYD-2024-98765',
        itemCode: 'LP-2024-54321',
        copayment: 300,
        paidByPatient: 0,
        paidByInsurance: 300,
        remainingLimit: null,
      },
      {
        date: '2025-01-17',
        receiptId: 'eRecept ERP-2024-00123',
        expenditureId: 'VYD-2024-98765',
        itemCode: 'LP-2024-54321',
        copayment: 300,
        paidByPatient: 0,
        paidByInsurance: 300,
        remainingLimit: null,
      },
      {
        date: '2025-02-17',
        receiptId: 'eRecept ERP-2024-00123',
        expenditureId: 'VYD-2024-98765',
        itemCode: 'LP-2024-54321',
        copayment: 300,
        paidByPatient: 0,
        paidByInsurance: 300,
        remainingLimit: null,
      },
    ],
  },
};
