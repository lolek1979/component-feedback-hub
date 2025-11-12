export interface CodeListDto {
  code: string;
  name: string;
}

export interface UserDto {
  id: string;
  name: string;
}

export interface UserGroupDto {
  id: string;
  name: string;
}

export interface ComplaintResponse {
  id: string;
  insuredId?: string;
  insuredFirstName?: string;
  insuredLastName?: string;
  requesterFullName?: string;
  fillingDate?: string;
  complaintPeriod?: number;
  regionalWorkplace?: number;
  phone?: string;
  email?: string;
  bankAccountNumber?: string;
  requestComment?: string;
  proceedingsNumber?: string;
  requestedCompensation?: number;
  realCompensation?: number;
  resultComment?: string;
  processingDeadlineDate?: string;
  decisionProceedingsNumber?: string;
  settlementDate?: string;
  solver?: UserDto;
  solvingGroup?: UserGroupDto;
  processingState?: CodeListDto;
  complaintReason?: CodeListDto;
  complaintResult?: CodeListDto;
}

export interface GetComplaintParams {
  insuredId?: string;
  processingStateCode?: string;
  complaintReasonCode?: string;
  complaintResultCode?: string;
  fulltext?: string;
}

export interface ComplaintCreateRequest {
  insuredId?: string;
  requesterFullName?: string;
  fillingDate?: string;
  phone?: string;
  email?: string;
  bankAccountNumber?: string;
  requestComment?: string;
  requestedCompensation?: number;
}

export interface ComplaintUpdateRequest {
  insuredId?: string;
  requesterFullName?: string;
  fillingDate?: string;
  phone?: string;
  email?: string;
  bankAccountNumber?: string;
  requestComment?: string;
  requestedCompensation?: number;
  id?: string;
  proceedingsNumber?: string;
}
