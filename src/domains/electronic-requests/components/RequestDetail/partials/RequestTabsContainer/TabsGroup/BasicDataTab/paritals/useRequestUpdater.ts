import { useCallback } from 'react';

import { useUpdateRequest } from '@/domains/electronic-requests/api/query/useUpdateRequest';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

export const useRequestUpdater = (requestData: RequestDetailModel | null | undefined) => {
  const { mutate: updateRequest, isPending } = useUpdateRequest();

  const createPayload = useCallback(
    (
      updates: Partial<{
        recipientId: string;
        description: string;
        justification: string;
        deliveryAddress: string;
      }>,
    ) => ({
      recipientId: updates.recipientId ?? requestData?.recipient.id ?? '',
      description: updates.description ?? requestData?.description ?? '',
      justification: updates.justification ?? requestData?.justification ?? '',
      deliveryAddress: updates.deliveryAddress ?? requestData?.deliveryAddress ?? '',
    }),
    [requestData],
  );

  const updateRequestField = useCallback(
    (updates: Parameters<typeof createPayload>[0]) => {
      if (!requestData?.id) return;

      updateRequest({
        requestId: requestData.id,
        payload: createPayload(updates),
      });
    },
    [requestData?.id, updateRequest, createPayload],
  );

  return { updateRequestField, isPending };
};
