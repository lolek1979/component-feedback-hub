import { AxiosError } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { RequestDetailModel, ResultMessage } from './types';
import { REQUESTS_BASE_URL } from '.';

interface SubmitRequestResponse {
  state: string;
  messages: ResultMessage[];
  payload: RequestDetailModel;
}

export const submitRequestForApproval = async (id: string): Promise<RequestDetailModel | null> => {
  if (!id) return null;

  const url = `${REQUESTS_BASE_URL}/${id}/Submit`;

  try {
    const res = await axiosInstance.post<SubmitRequestResponse>(url);

    return res.data.payload;
  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const errorData = axiosError.response?.data;

    switch (statusCode) {
      case 400:
        console.error('Bad Request:', errorData);
        break;
      case 401:
        console.error('Unauthorized:', errorData);
        break;
      case 404:
        console.error('Not Found:', errorData);
        break;
      case 409:
        console.error('Conflict:', errorData);
        break;
      case 500:
        console.error('Internal Server Error:', errorData);
        break;
      default:
        console.error(`Error submitting request for approval (${statusCode}):`, errorData);
    }

    return null;
  }
};
