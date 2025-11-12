import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostCodeListAddGarantsResponse {
  status: number;
}

export const postCodelistAddGarant = async (
  codeListId: string,
  garants: string[],
): Promise<PostCodeListAddGarantsResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/codelists/versions/${codeListId}/garants/add`,
      garants,
    );

    return response.data as PostCodeListAddGarantsResponse;
  } catch (error) {
    console.error('Error adding garants to codelist:', error);

    return null;
  }
};
