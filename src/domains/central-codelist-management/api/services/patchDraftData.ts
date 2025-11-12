import { axiosInstance, CODELIST_PATCH_VERSION } from '@/core/api/axiosInstance';

interface PatchDraftDataResponse {
  draftId: string;
  codeListId: string;
}
export type PatchDraftDataData = string[][];
export const patchDraftData = async (
  draftId: string,
  data: PatchDraftDataData,
): Promise<PatchDraftDataResponse | null> => {
  try {
    const response = await axiosInstance.patch(
      `codelists/api/rest/v${CODELIST_PATCH_VERSION}/drafts/${draftId}/data`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as PatchDraftDataResponse;
  } catch (error) {
    console.error('Error Patching draft data:', error);

    return null;
  }
};
