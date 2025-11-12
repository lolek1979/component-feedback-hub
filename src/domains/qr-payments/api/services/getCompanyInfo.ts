import { API_VERSION, axiosInstance } from '@/core/api';

/**
 * Parameters for the `getCompanyInfo` function.
 */
export interface getCompanyInfoParams {
  /**
   * The company identification number (IČO).
   */
  ico: string;
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
 * Represents a company address.
 */
type Address = {
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
 * Response structure for the `getCompanyInfo` function.
 */
export interface getCompanyInfoResponse {
  role: string;
  orgUnit: string;
  localOffice: string;
  version: string;
  name: string;
  businessName: string;
  ico: string;
  phones: Phone[];
  emails: Email[];
  dataBoxes: DataBox[];
  addresses: Address[];
  bankAccounts: BankAccount[];
}

/**
 * Fetches detailed company information by IČO.
 *
 * @param params - Object containing the company IČO.
 * @returns A Promise that resolves to the company information.
 */
export const getCompanyInfo = async (
  params: getCompanyInfoParams,
): Promise<getCompanyInfoResponse | undefined> => {
  if (!params.ico || params.ico === '') return;

  try {
    const response = await axiosInstance.get<getCompanyInfoResponse>(
      `/integration-ipf/api/rest/v${API_VERSION}/CompanyDetail/${params.ico}`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching company info for ICO ${params.ico}:`, error);
    throw error;
  }
};
