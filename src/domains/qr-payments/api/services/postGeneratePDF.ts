import { API_VERSION, axiosInstance } from '@/core/api';

/**
 * Parameters for the `postGeneratePDF` function.
 */
export interface postGeneratePDFParams {
  /**
   * Type of the payer (e.g., individual, company).
   */
  payerType: string;

  /**
   * Client number associated with the payer.
   */
  clientNumber: string;

  /**
   * List of payments to include in the PDF.
   */
  payments: {
    /**
     * Purpose of the payment.
     */
    paymentPurpose: string;

    /**
     * Amount of the payment.
     */
    amount: number;

    /**
     * Reference number for the payment.
     */
    reference: string;
  }[];

  /**
   * Type of address to be used in the PDF (e.g., permanent, temporary).
   */
  addressType: string;
}

/**
 * Sends a request to generate a PDF based on the provided payment data.
 * The generated PDF is opened in a new browser tab.
 *
 * @param params - The parameters required to generate the PDF.
 * @returns A Promise that resolves when the PDF is successfully opened.
 */
export const postGeneratePDF = async (params: postGeneratePDFParams): Promise<void> => {
  try {
    const response = await axiosInstance.post<Blob>(
      `/cdg-qr/api/rest/v${API_VERSION}/Generate-PDF`,
      params,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 500);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
