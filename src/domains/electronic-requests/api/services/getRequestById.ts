import { axiosInstance } from '@/core/api/axiosInstance';

import { RequestDetailModel, ResultMessage } from './types';
import { REQUESTS_BASE_URL } from '.';

export interface BadRequestError {
  state: string;
  messages: ResultMessage[];
}

interface RequestResponse {
  payload: RequestDetailModel;
  state: string;
  messages: ResultMessage[];
}

export const getRequestById = async (id: string): Promise<RequestDetailModel | null> => {
  if (!id) return null;

  const url = `${REQUESTS_BASE_URL}/${id}`;

  try {
    const { data } = await axiosInstance.get<RequestResponse>(url);

    return data.payload;
  } catch (error) {
    console.error(`Error getting request with ${id}: `, error);

    return null;
  }
};
