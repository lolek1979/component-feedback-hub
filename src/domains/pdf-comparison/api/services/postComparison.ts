import { axiosInstance } from '@/core/api';

export interface PostComparisonParams {
  pdfFileA: File;
  pdfFileB: File;
}

export interface PostComparisonResponse {
  state: string;
  payload?: string;
}

export const postComparison = async (
  params: PostComparisonParams,
): Promise<PostComparisonResponse> => {
  const formData = new FormData();
  formData.append('pdfFileA', params.pdfFileA);
  formData.append('pdfFileB', params.pdfFileB);

  const response = await axiosInstance.post<PostComparisonResponse>(
    '/shadow-pdf/api/rest/v1/Comparisons',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
