import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const COMPLAINT_TYPES = {
  INVALID: 'invalid',
  INSURED_NUMBER_CHANGE: 'insured-number-change',
  GENERAL: 'general',
} as const;

const COMPLAINT_HANDLERS = {
  CLIENT_DESK: 'clientDesk',
  BACK_OFFICE: 'backOffice',
} as const;

export type settlementResultType = 'approved' | 'denied';
export type communicationAddressType = 'address' | 'dataBox';

type ComplaintType = (typeof COMPLAINT_TYPES)[keyof typeof COMPLAINT_TYPES];
type ComplaintHandler = (typeof COMPLAINT_HANDLERS)[keyof typeof COMPLAINT_HANDLERS];

interface ComplaintFormData {
  complaintType: ComplaintType | null;
  communicationAddress: communicationAddressType;
  complaintHandler: ComplaintHandler | '';
  referenceNumber: string;
  settlementResult: settlementResultType | '';
  settlement: string;
  externalComment: string;
  internalComment: string;
}

interface ComplaintStoreState {
  currentStep: number;
  formData: ComplaintFormData;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setSettlementResult: (result: settlementResultType) => void;
  setSettlement: (amount: string) => void;
  setExternalComment: (comm: string) => void;
  setCommunicationAdress: (add: communicationAddressType) => void;
  setInternalComment: (comm: string) => void;
  setProceedingsNr: (proNr: string) => void;
  setComplaintType: (type: ComplaintType) => void;
  setComplaintHandler: (type: ComplaintHandler) => void;
  setReferenceNumber: (value: string) => void;
  resetStates: () => void;
}

const initialFormData: ComplaintFormData = {
  settlementResult: '',
  complaintType: null,
  complaintHandler: '',
  referenceNumber: '',
  settlement: '0',
  communicationAddress: 'address',
  internalComment: '',
  externalComment: '',
};

export const useComplaintStore = create<ComplaintStoreState>()(
  persist(
    (set) => ({
      currentStep: 0,
      formData: initialFormData,

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      setComplaintType: (type) =>
        set((state) => ({
          formData: {
            ...state.formData,
            complaintType: type,
          },
        })),

      setComplaintHandler: (type: ComplaintHandler) =>
        set((state) => ({
          formData: {
            ...state.formData,
            complaintHandler: type,
          },
        })),

      setReferenceNumber: (value: string) =>
        set((state) => ({
          formData: {
            ...state.formData,
            referenceNumber: value,
          },
        })),

      setCommunicationAdress: (add) =>
        set((state) => ({
          formData: {
            ...state.formData,
            communicationAddress: add,
          },
        })),

      setSettlementResult: (result) =>
        set((state) => ({
          formData: {
            ...state.formData,
            settlementResult: result,
          },
        })),

      setExternalComment: (comm) =>
        set((state) => ({
          formData: {
            ...state.formData,
            externalComment: comm,
          },
        })),

      setInternalComment: (comm) =>
        set((state) => ({
          formData: {
            ...state.formData,
            internalComment: comm,
          },
        })),

      setProceedingsNr: (procNr) =>
        set((state) => ({
          formData: {
            ...state.formData,
            referenceNumber: procNr,
          },
        })),

      setSettlement: (amount) =>
        set((state) => ({
          formData: {
            ...state.formData,
            settlement: amount,
          },
        })),

      resetStates: () =>
        set({
          currentStep: 0,
          formData: initialFormData,
        }),
    }),
    {
      name: 'complaint-storage', // name of the key in localStorage
    },
  ),
);

export { COMPLAINT_HANDLERS, COMPLAINT_TYPES };
export type { ComplaintHandler, ComplaintType };
