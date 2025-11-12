import { axiosInstance } from '@/core/api/axiosInstance';

import { GetRequesterRequestsResponse, OrderBy, RequestRole, WFState } from './types';
import { REQUESTS_BASE_URL } from './';

export type GetRequestsParams = {
  role: RequestRole;
  skip?: number;
  take?: number;
  order?: OrderBy;
  ascending?: boolean;
  view?: string;
  requestNumber?: string;
  createdById?: string;
  recipientId?: string;
  approverId?: string;
  costCenterId?: string;
  stateFilter?: WFState[];
  includeClosed?: boolean;
};

export const getRequests = async ({
  role,
  skip,
  take,
  order,
  ascending,
  view,
  requestNumber,
  createdById,
  recipientId,
  approverId,
  costCenterId,
  stateFilter,
  includeClosed,
}: GetRequestsParams): Promise<GetRequesterRequestsResponse | null> => {
  const params: Record<string, string | number | boolean | null | WFState[]> = {
    role,
    skip: skip ?? 0,
    take: take ?? 10,
    order: order ?? null,
    ascending: ascending ?? true,
    view: view ?? null,
    requestNumber: requestNumber ?? null,
    createdById: createdById ?? null,
    recipientId: recipientId ?? null,
    approverId: approverId ?? null,
    costCenterId: costCenterId ?? null,
    stateFilter: stateFilter ?? null,
    includeClosed: includeClosed ?? true,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${encodeURIComponent(item)}`).join('&');
      }

      return `${key}=${encodeURIComponent(value !== null ? value.toString() : '')}`;
    })
    .join('&');

  const url = `${REQUESTS_BASE_URL}?${queryString}`;

  try {
    const response = await axiosInstance.get(url);

    return response.data as GetRequesterRequestsResponse;
  } catch (error) {
    console.error('Error fetching requests:', error);

    return null;
  }
};
