import { create } from 'zustand';

/**
 * Represents a single row of payment data.
 */

type PaymentRowData = {
  /**
   * The type of payment (e.g., cash, card, etc.).
   */
  type: string;

  /**
   * The amount of the payment as a string.
   */
  amount: string;

  /**
   * The currency symbol (e.g., $, €, Kč).
   */
  symbol: string;
};

type PaymentDetailsState = {
  /**
   * Array of payment rows.
   */
  rows: PaymentRowData[];

  /**
   * Total payment amount as a string.
   */
  totalPayment: string;

  /**
   * Updates a specific row in the payment data.
   * @param index - Index of the row to update.
   * @param data - Partial data to update the row with.
   */
  setRow: (index: number, data: Partial<PaymentRowData>) => void;

  /**
   * Clears a specific row in the payment data.
   * @param index - Index of the row to clear.
   */
  removeRow: (index: number) => void;

  /**
   * Sets the total payment amount.
   * @param amount - New total payment amount.
   */
  setTotalPayment: (amount: string) => void;

  /**
   * Resets all rows and the total payment to their initial state.
   */
  resetStates: () => void;
};

/**
 * Initial state for payment rows.
 */

const initalRows: PaymentRowData[] = [
  { type: '', amount: '', symbol: '' },
  { type: '', amount: '', symbol: '' },
  { type: '', amount: '', symbol: '' },
];

export const usePaymentDetailsStore = create<PaymentDetailsState>((set) => ({
  rows: initalRows,
  totalPayment: '',
  setRow: (index, data) =>
    set((state) => ({
      rows: state.rows.map((row, i) => (i === index ? { ...row, ...data } : row)),
    })),
  removeRow: (index) =>
    set((state) => ({
      rows: state.rows.map((row, i) => (i === index ? { type: '', amount: '', symbol: '' } : row)),
    })),
  resetStates: () =>
    set(() => ({
      rows: initalRows,
      totalPayment: '',
    })),
  setTotalPayment: (amount) =>
    set(() => ({
      totalPayment: amount,
    })),
}));
