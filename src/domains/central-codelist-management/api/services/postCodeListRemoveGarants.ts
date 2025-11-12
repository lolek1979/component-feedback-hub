import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostCodelistRemoveGarantsResponse {
  status: number;
}

export const postCodeListRemoveGarant = async (
  codeListId: string,
  garants: string[],
): Promise<PostCodelistRemoveGarantsResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/codelists/versions/${codeListId}/garants/remove`,
      garants,
    );

    return response.data as PostCodelistRemoveGarantsResponse;
  } catch (error) {
    console.error('Error removing garants to codelist:', error);

    return null;
  }
};
