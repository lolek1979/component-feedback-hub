import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { ResultMessage } from '../types';
import { ATTACHMENT_URL } from '..';

export interface CreateAttachmentResponse {
  state: 'Success' | 'Error';
  messages: ResultMessage[];
  payload: string;
}

export const createAttachment = async (
  file: File,
): Promise<AxiosResponse<CreateAttachmentResponse>> => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the maximum allowed limit (10MB)');
  }

  const formData = new FormData();
  formData.append('file', file);

  return await axiosInstance.post(ATTACHMENT_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
