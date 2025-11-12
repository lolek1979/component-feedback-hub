import { useQuery } from '@tanstack/react-query';

import {
  getRequests,
  GetRequestsParams,
} from '@/domains/electronic-requests/api/services/getRequests';

interface UseRequestsOptions extends GetRequestsParams {
  enabled?: boolean;
}

export const useRequests = (options: UseRequestsOptions) => {
  const { enabled = true, ...payload } = options;

  return useQuery({
    queryKey: [
      'requests',
      payload.role,
      payload.skip,
      payload.take,
      payload.order,
      payload.ascending,
      payload.view,
      payload.requestNumber,
      payload.createdById,
      payload.recipientId,
      payload.approverId,
      payload.costCenterId,
      payload.stateFilter,
      payload.includeClosed,
    ],
    queryFn: () => getRequests(payload),
    enabled,
    placeholderData: (previousData) => previousData,
  });
};
