import { axiosInstance } from '@/core/api/axiosInstance';

import { ADMIN_PROCESS_URL } from '.';

export type GetAdminProcessByIdParams = {
  id: string;
};

export interface AdminProcessStatus {
  code: string;
  name: string;
}

export interface AdminProcessAgenda {
  code: string;
  name: string;
}

export interface AdminProcessInsurancePayer {
  id: string;
  name: string;
}

export interface AdminProcessRecordFolder {
  id: string;
  number: string;
}

export interface AdminProcessResponsibleUser {
  id: string;
  name: string;
}

export interface AdminProcessByIdResponse {
  id: string;
  dateCreated: string;
  number: string;
  status: AdminProcessStatus;
  agenda: AdminProcessAgenda;
  insurancePayer: AdminProcessInsurancePayer;
  recordFolder: AdminProcessRecordFolder;
  responsibleUsers: AdminProcessResponsibleUser[];
  dateResolutionDeadline: string;
}

export interface AdminProcessByIdErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}

export const getAdminProcessById = async ({
  id,
}: GetAdminProcessByIdParams): Promise<AdminProcessByIdResponse> => {
  try {
    const response = await axiosInstance.get<AdminProcessByIdResponse>(
      `${ADMIN_PROCESS_URL}/${id}`,
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      const err: AdminProcessByIdErrorResponse = error.response.data;
      throw err;
    }
    throw error;
  }
};
