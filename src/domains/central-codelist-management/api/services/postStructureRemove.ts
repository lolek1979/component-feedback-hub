import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

interface PostStructureRemoveResponse {
  message: string;
}

interface Payload {
  indexes: number[];
}
/**
 * Removes structure fields to a specified draft.
 *
 *
 * @param draftId - The ID of the draft to which fields should be added.
 * @param payload - The payload containing indexes of the fields to be deleted.
 * @returns A promise that resolves to a `PostStructureRemoveResponse` on success, or `null` on failure.
 *
 */
export const postStructureRemove = async (
  draftId: string,
  payload: Payload,
): Promise<PostStructureRemoveResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/columns/remove`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as PostStructureRemoveResponse;
  } catch (error) {
    console.error('Error removing drafts:', error);

    return null;
  }
};
