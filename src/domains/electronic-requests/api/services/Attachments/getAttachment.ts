import { axiosInstance } from '@/core/api/axiosInstance';

import { ATTACHMENT_URL } from '..';

export const getAttachment = async (id: string, fileName?: string): Promise<Blob> => {
  let url = `${ATTACHMENT_URL}/${id}`;
  url += fileName ? `/${fileName}` : '/file';

  try {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    });

    return response.data as Blob;
  } catch (error) {
    console.error('Error fetching attachment:', error);
    throw error;
  }
};

export const getAttachmentUrl = (id: string, fileName?: string): string => {
  const baseUrl = axiosInstance.defaults.baseURL || '';
  let url = `${baseUrl}${ATTACHMENT_URL}/${id}`;
  url += fileName ? `/${fileName}` : '/file';

  return url;
};
