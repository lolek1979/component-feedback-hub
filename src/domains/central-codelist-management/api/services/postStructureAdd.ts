import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { Field } from './patchDraftStructure';

/**
 * Response returned after successfully adding structure fields to a draft.
 */
interface PostStructureAddResponse {
  /** Success message from the API */
  message: string;
}

/**
 * Payload containing an array of fields to be added to the draft structure.
 */
export interface Payload {
  /** List of fields to be added */
  fields: Field[];
}

/**
 * Adds structure fields to a specified draft.
 *
 * Validates the input `draftId` and `payload`, formats the fields, and sends a POST request
 * to the backend API to add the fields to the draft structure.
 *
 * @param draftId - The ID of the draft to which fields should be added.
 * @param payload - The payload containing the fields to be added.
 * @returns A promise that resolves to a `PostStructureAddResponse` on success, or `null` on failure.
 *
 * @throws Will throw an error if `draftId` is empty or if `payload.fields` is empty.
 */
export const postStructureAdd = async (
  draftId: string,
  payload: Payload,
): Promise<PostStructureAddResponse | null> => {
  if (!draftId || draftId.trim() === '') {
    throw new Error('Draft ID is required');
  }

  if (!payload.fields || payload.fields.length === 0) {
    throw new Error('At least one field is required');
  }

  try {
    const formattedFields = payload.fields.map((field) => ({
      index: field.index ?? 0,
      length: field.length ?? 0,
      name: field.name ?? '',
      code: field.code ?? '',
      description: field.description ?? '',
      valueType: field.valueType ?? 'String',
      valueFormat: field.valueFormat ?? '',
      validations: field.validations ?? [],
      default: field.default ?? '',
    }));

    const response = await axiosInstance.post(
      `codelists/api/rest/v${API_VERSION}/drafts/${draftId}/columns/add`,
      formattedFields,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as PostStructureAddResponse;
  } catch (error) {
    console.error('Error adding structure:', error);

    return null;
  }
};
