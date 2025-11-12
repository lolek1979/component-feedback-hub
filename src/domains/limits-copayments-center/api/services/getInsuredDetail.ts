import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

type AxiosErrorResponse = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      messages?: {
        severity: string;
        code: string;
        data: {
          Description: string;
        };
      }[];
    };
  };
  status?: number;
  message?: string;
};

type Phone = {
  type: number;
  number: string;
  primary: string;
  country: string;
};

type Email = {
  type: number;
  address: string;
  primary: string;
};

export type BankAccount = {
  accountId: string;
  accountNumber: string;
  bankCode: string;
  accountType: string;
  iban: string;
  bic: string;
  specSymbol: string;
};

type DataBox = {
  idDS: string;
  state: string;
  updateState: string;
  lastActivity: string;
  type: string;
  primary: boolean;
};

type Address = {
  addressType: string;
  primary: boolean;
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  country: string;
};

export type Payload = {
  insuranceNumber: string;
  role: string;
  orgUnit: string;
  localOffice: string;
  version: string;
  firstName: string;
  lastName: string;
  birthName: string;
  phones: Phone[];
  emails: Email[];
  bankAccounts: BankAccount[];
  dataBoxes: DataBox[];
  addresses: Address[];
};

export type InsuredDetailResponse = {
  state: string;
  messages: {
    severity: string;
    code: string;
    data: {
      Description: string;
    };
  }[];
  payload: Payload | null;
  error?: {
    status: number | string;
    message: string;
  };
};

export const getInsuredDetail = async (
  insuredId: string,
): Promise<InsuredDetailResponse | null> => {
  try {
    const res = await axiosInstance.get(
      `integration-ipf/api/rest/v${API_VERSION}/InsuredDetail/${insuredId}`,
    );
    const data = res?.data;

    // Handle API response with state and payload structure
    if (data && typeof data === 'object' && 'state' in data && 'payload' in data) {
      if (!data.payload) {
        return {
          state: 'Error',
          error: {
            status: data.messages?.[0]?.code ?? 'UNKNOWN_ERROR',
            message: data.messages?.[0]?.data?.Description ?? 'Unknown error occurred',
          },
          messages: data.messages ?? [],
          payload: null,
        };
      }

      return data as InsuredDetailResponse;
    }

    // Handle direct payload response
    if (data && typeof data === 'object' && 'insuranceNumber' in data) {
      return {
        state: 'Success',
        messages: [],
        payload: data as Payload,
      };
    }

    return null;
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;

    return {
      state: 'Error',
      error: {
        status: axiosError.response?.status ?? axiosError.status ?? 'NETWORK_ERROR',
        message:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.messages?.[0]?.data?.Description ||
          axiosError.message ||
          'An unexpected error occurred',
      },
      messages: axiosError.response?.data?.messages ?? [],
      payload: null,
    };
  }
};
