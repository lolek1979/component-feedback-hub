import { AxiosResponse } from 'axios';

import { ResultMessage } from '../types';
import { REQUESTS_BASE_URL } from '..';

import { axiosInstance } from '@/core';

export interface CommentCreateDTO {
  text: string;
}

export interface CommentResponse {
  state: string;
  messages: ResultMessage[];
}

export const createNewRequestComment = async (
  requestId: string,
  data: CommentCreateDTO,
): Promise<AxiosResponse<CommentResponse>> => {
  return await axiosInstance.post(`${REQUESTS_BASE_URL}/${requestId}/Comment`, data);
};
