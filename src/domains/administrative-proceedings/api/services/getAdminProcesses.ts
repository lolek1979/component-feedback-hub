import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_URL } from '.';

export interface CodeListDto {
  code: string | null;
  name: string | null;
}

export interface UserDto {
  id: string;
  name: string | null;
}

export interface InsurancePayerSimpleResponse {
  id?: string;
  name: string | null;
}

export interface RecordFolderResponse {
  id?: string;
  number: string | null;
}

export interface AdminProcessDto {
  id?: string;
  dateCreated?: string;
  number: string | null;
  status: CodeListDto;
  agenda: CodeListDto;
  insurancePayer: InsurancePayerSimpleResponse;
  recordFolder: RecordFolderResponse;
  responsibleUsers?: UserDto[] | null;
  dateResolutionDeadline?: string | null;
  note?: string | null;
  highAttention: boolean;
}

export type GetAdminProcessesResponse = AdminProcessDto[];

export const getAdminProcesses = async (
  fullText: string | null,
  responsibleUserId: string | null,
  adminProcessStatusCode: string | null,
): Promise<GetAdminProcessesResponse | null> => {
  const params: Record<string, string | null> = {
    fullText,
    responsibleUserId,
    adminProcessStatusCode,
  };
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const url = `${ADMIN_PROCESS_URL}?${queryString}`;

  return await axiosInstance
    .get(url)
    .then((res) => {
      return res.data as GetAdminProcessesResponse;
    })
    .catch(() => {
      return null;
    });
};
