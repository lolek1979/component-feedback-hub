import { create } from 'zustand';

/**
 * Type representing the payer type.
 * '1' might represent one category (e.g., individual), '2' another (e.g., company).
 */
type payerType = '1' | '2';

/**
 * Represents insurer information.
 */
interface Insurer {
  /**
   * Social security number or similar identifier.
   */
  ssn: string;

  /**
   * Name of the insurer.
   */
  name: string;

  /**
   * Type of address (e.g., permanent, temporary).
   */
  addressType: string;
}

/**
 * Zustand store state for managing client-related data.
 */
interface StoreState {
  /**
   * Type of payer.
   */
  payerType: payerType;

  /**
   * Insurer details.
   */
  insurer: Insurer;

  /**
   * Local office identifier or name.
   */
  localOffice: string;

  /**
   * Date when the client record was created.
   */
  createdAt: string;

  /**
   * Sets the payer type.
   * @param type - '1' or '2'
   */
  setPayerType: (type: '1' | '2') => void;

  /**
   * Sets the insurer details.
   * @param insurer - Insurer object
   */
  setInsurer: (insurer: Insurer) => void;

  /**
   * Sets the creation date.
   * @param date - Date string
   */
  setCreatedAt: (date: string) => void;

  /**
   * Sets the local office.
   * @param office - Office name or ID
   */
  setLocalOffice: (office: string) => void;

  /**
   * Resets insurer, createdAt, and localOffice to initial values.
   */
  resetStates: () => void;
}

/**
 * Zustand store for managing client data.
 */
export const useClientStore = create<StoreState>((set) => ({
  payerType: '2',
  insurer: {
    ssn: '',
    name: '',
    addressType: '',
  },
  createdAt: '',
  localOffice: '',
  setPayerType: (type) => set({ payerType: type }),
  setInsurer: (insurer) => set({ insurer }),
  setCreatedAt: (date) => set({ createdAt: date }),
  setLocalOffice: (office) => set({ localOffice: office }),
  resetStates: () =>
    set({
      insurer: { ssn: '', name: '', addressType: '' },
      createdAt: '',
      localOffice: '',
    }),
}));
