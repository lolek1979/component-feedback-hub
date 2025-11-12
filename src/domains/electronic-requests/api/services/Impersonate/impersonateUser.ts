import { AxiosResponse } from 'axios';

import { axiosInstance } from '@/core/api/axiosInstance';

import { DEBUG_IMPERSONATE_URL } from '..';

export type UserRole =
  | 'admin99t'
  | 'bfu99t'
  | '1approver99t'
  | '2approver99t'
  | '3approver99t'
  | '4approver99t'
  | '5approver99t'
  | 'purchaser99t';

//user id you want to use (same as id shown in user codebook), or sAMAccountName. Recognized test user SAM values: UserRole
export const impersonateUser = async (id: UserRole): Promise<AxiosResponse<void> | null> => {
  try {
    const response = await axiosInstance.post(`${DEBUG_IMPERSONATE_URL}/${id}`);

    return response;
  } catch (error) {
    console.error(`Error impersonating user with id ${id}:`, error);

    return null;
  }
};
