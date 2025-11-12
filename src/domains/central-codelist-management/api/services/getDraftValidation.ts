import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

export interface ResultMessage {
  severity: 'Debug' | 'Info' | 'Warning' | 'Error' | 'Critical';
  code: string | null;
  data: Record<string, unknown> | null;
}

export const getDraftValidation = async (draftId: string): Promise<ResultMessage[]> => {
  const response = await axiosInstance.get(
    `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/validation`,
  );

  return response.data as ResultMessage[];
};
