import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

export interface DocumentHeader {
  name: string;
  city: string;
  street: string;
  zip: string;
  represented: string;
  ic: string;
  icz: string;
}

export interface TextDifference {
  where: string;
  added: string[];
  removed: string[];
}

export interface SignatureData {
  name: string;
  date: string;
}

export interface HeaderDiff {
  sent: DocumentHeader;
  received: DocumentHeader;
  match_status: boolean;
}

export interface TextDiff {
  differences: TextDifference[] | null;
  match_rate: number;
}

export interface ComparisonResult {
  header: HeaderDiff;
  text: TextDiff;
  signature: SignatureData | null;
}

export interface ComparisonSuccessResponse {
  header: HeaderDiff;
  text: {
    differences: TextDifference[];
    match_rate: number;
  };
  signature: SignatureData | null;
}

export interface ComparisonErrorResponse {
  state: 'Error';
  messages: string[];
}

export type GetComparisonResponse = ComparisonSuccessResponse | ComparisonErrorResponse;

export interface GetComparisonParams {
  pdfFile1: File;
  pdfFile2: File;
}

export const getComparison = async (
  params: GetComparisonParams,
): Promise<GetComparisonResponse> => {
  const formData = new FormData();
  formData.append('pdfFile1', params.pdfFile1);
  formData.append('pdfFile2', params.pdfFile2);

  const response = await axiosInstance.post(
    `/shadow-pdf/api/rest/v${API_VERSION}/compare`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  const payload: unknown = response.data;

  if (payload && typeof payload === 'object') {
    const payloadObj = payload as Record<string, unknown>;
    if ('data' in payloadObj && payloadObj.data && typeof payloadObj.data === 'object') {
      return payloadObj.data as GetComparisonResponse;
    }
  }

  return payload as GetComparisonResponse;
};
