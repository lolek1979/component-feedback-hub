import { API_VERSION, axiosInstance } from '@/core/api';

/**
 * Parameters for the `getClientInfo` function.
 */
export interface getClientInfoParams {
  /**
   * Client's personal identification number (CP).
   */
  ssn: string;
}

/**
 * Represents a phone contact.
 */
type Phone = {
  type: number;
  number: string;
  primary: boolean;
};

/**
 * Represents an email contact.
 */
type Email = {
  type: number;
  address: string;
  primary: boolean;
};

/**
 * Represents a client's address.
 */
type Adress = {
  addressType: string;
  primary: boolean;
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  country: string;
};

/**
 * Represents a data box entry.
 */
type DataBox = {
  idDS: string;
  state: 'Error' | 'Active' | 'Inactive';
  updateState: string;
  lastActivity: string;
  type: string;
  primary: boolean;
};

/**
 * Represents a bank account.
 */
type BankAccount = {
  accountId: string;
  accountNumber: string;
  bankCode: string;
  accountType: string;
  iban: string;
  bic: string;
  specSymbol: string;
};

/**
 * Response structure for the `getClientInfo` function.
 */
export interface getClientInfoResponse {
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
  dataBoxes: DataBox[];
  addresses: Adress[];
  bankAccounts: BankAccount[];
}

/**
 * Fetches detailed client information by personal identification number (CP).
 *
 * @param params - Object containing the client's CP.
 * @returns A Promise that resolves to the client information.
 */
export const getClientInfo = async (
  params: getClientInfoParams,
): Promise<getClientInfoResponse> => {
  try {
    const response = await axiosInstance.get<getClientInfoResponse>(
      `/integration-ipf/api/rest/v${API_VERSION}/InsuredDetail/${params.ssn}`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching client info for CP ${params.ssn}:`, error);
    throw error;
  }
};
