//***** Core Types & Enums *****

export type OrderBy = 'RequestNumber' | 'Created';

export type RequestRole = 'admin' | 'approver' | 'purchaser' | 'requester';

enum ResultState {
  Success = 'Success',
  Failure = 'Failure',
}

export enum ResultMessageSeverity {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical',
}

export interface ResultMessage {
  severity: ResultMessageSeverity;
  code?: string[];
  data?: Record<string, any>;
}

export interface Result {
  state: ResultState;
  messages?: ResultMessage[];
}

export type WFState =
  | 'Draft'
  | 'Active'
  | 'PendingApprove0'
  | 'PendingApprove1'
  | 'PendingApprove2'
  | 'PendingApprove3'
  | 'PendingApprove4'
  | 'PendingApprove5'
  | 'Purchase'
  | 'Closed'
  | 'Rejected'
  | 'RejectedConfirmed'
  | 'Ordered'
  | 'Returned'
  | 'Withdrawn'
  | 'Approved'
  | 'ApprovedWithoutPurchase'
  | 'IssuedWithoutPurchase';

//***** Attachments *****
export interface AttachmentModel {
  id: string;
  fileName?: string;
}

//***** User & Identity Models *****
interface BaseUser {
  id: string;
  givenName?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  defaultAddress?: string;
}

//Basic information when displaying one user to another
// (example - user lists their own requests on dashboard and sees approver info for each).
export interface UserPublicInfoModel extends BaseUser {
  costCenter: CodebookItemModel;
  order: CodebookItemModel;
  description: string;
}

export interface ImpersonatedUserModel extends UserPublicInfoModel {
  isApprover: boolean;
  isPurchaser: boolean;
  isBudgetManager: boolean;
  isCatalogueManager: boolean;
  isAdmin: boolean;
  realUser: UserPublicInfoModel;
}

//***** Catalogue & Item Models *****
export enum CategoryType {
  ItGoodsAndServices = 'ItGoodsAndServices',
  Operations = 'Operations',
  Maintenance = 'Maintenance',
}

export interface CategoryModal {
  id: string;
  description?: string;
  categoryType: CategoryType;
  parentCategoryId?: string;
}

export interface CategoryDetailModel {
  id: string;
  description?: string;
  categoryType: CategoryType;
  parentCategoryId?: string;
}

export interface CatalogueItem {
  id: string;
  description: string;
  category: CategoryModal;
  sapNumber: string;
  supplierArticleNumber: string;
  unitOfMeasure: string;
  unitPrice: number;
  isFavorite: boolean;
  contract: string;
  externalUrl: string;
  attachments: AttachmentModel[];
}

export interface CatalogueItemDetailModel {
  //Null when used to model manual item.
  id?: string;
  description?: string;
  category: CategoryDetailModel;
  sapNumber?: string;
  supplierArticleNumber?: string;
  unitOfMeasure?: string;
  unitPrice: number;
  isFavorite: boolean;
  externalUrl?: string;
  //TODO: Check why it's missed on Swagger
  contract?: string;
  attachments: AttachmentModel[];
}

export interface ManualItem {
  description: string;
  categoryId: string;
  supplierArticleNumber: string;
  unitOfMeasure: string;
  unitPrice: number;
  contract: string;
  externalUrl: string;
}

export interface ManualItemUpdateModal {
  description?: string;
  categoryId: string;
  supplierArticleNumber?: string;
  unitOfMeasure?: string;
  unitPrice: number;
  contract?: string;
  externalUrl?: string;
}

export type Purchaser = {
  purchaser: UserPublicInfoModel;
  costCenter: CodebookItemModel;
};

export type BudgetLimit = {
  costCenter: CodebookItemModel;
  limitQuantity?: string;
  limitFinancial?: string;
};

export interface Department {
  id: string;
  code: string;
  description: string;
}

export interface AdminContract {
  id: string;
  name: string;
  description?: string;
  purchasers?: Purchaser[];
  budgetLimits?: BudgetLimit[];
}

export interface CodebookItemModel {
  id: string;
  code?: string;
  description?: string;
}

//***** Requests *****

enum RequestWorkflowState {
  Draft = 'Draft',
  PendingApprove1 = 'PendingApprove1',
  PendingApprove2 = 'PendingApprove2',
  PendingApprove3 = 'PendingApprove3',
  PendingApprove4 = 'PendingApprove4',
  PendingApprove5 = 'PendingApprove5',
  Purchase = 'Purchase',
  Closed = 'Closed',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn',
}

enum RequestListViewType {
  All = 'All',
  Own = 'Own',
  Approver = 'Approver',
}

export const RequestStateFilter = RequestWorkflowState;
export interface RequestUpdateModel {
  recipientId: string;
  //maxLength: 255
  description?: string;
  //maxLength: 255
  justification?: string;
  //maxLength: 100
  deliveryAddress?: string;
}

export interface RequestDetailModel {
  //Automapper projection parameters: observerId
  id: string;
  createdAtUtc: string;
  createdBy: UserPublicInfoModel;
  requestNumber?: string;
  recipient: UserPublicInfoModel;
  submitedAtUtc?: string;
  deliveryAddress?: string;
  costCenter: CodebookItemModel;
  order: CodebookItemModel;
  description?: string;
  justification?: string;
  isWatching: boolean;
  wfState: RequestWorkflowState;
  approver: UserPublicInfoModel;
  items?: RequestItemDetailModel[];
  approveHistory?: ApprovalHistoryItem[];
  comments?: CommentDetailModel[];
}

export interface RequestDetailModelResult {
  state: ResultState;
  messages?: ResultMessage;
  payload: RequestDetailModel;
}

interface RequestDetailModelListResultModelResult {
  state: ResultState;
  messages?: ResultMessage[];
  payload: RequestDetailModelListResultModel;
}

interface RequestDetailModelListResultModel {
  total: number;
  items?: RequestDetailModel[];
}

export interface ReturnRequestBody {
  level: number;
  returnReason: string;
}

//***** Requests Items *****

export enum RequestItemWorkflowState {
  Draft = 'Draft',
  Active = 'Active',
  Rejected = 'Rejected',
  ApprovedForPurchase = 'ApprovedForPurchase',
  IssuedWithoutPurchase = 'IssuedWithoutPurchase',
  Withdrawn = 'Withdrawn',
}

enum RequestItemApproverDecision {
  None = 'None',
  Approve = 'Approve',
  ApproveWithoutPurchase = 'ApproveWithoutPurchase',
  Reject = 'Reject',
}

enum RequestItemPurchaserState {
  None = 'None',
  Active = 'Active',
  ExportedCsv = 'ExportedCsv',
  ExportedSap = 'ExportedSap',
}

export interface RequestItemDetailModel {
  id: string;
  purchaserNote?: string;
  catalogueItem: CatalogueItemDetailModel;
  manualItem: CatalogueItemDetailModel;
  expectedDeliveryDate: string;
  quantity: number;
  wfState: RequestItemWorkflowState;
  approverDecision: RequestItemApproverDecision;
  purchaserState: RequestItemPurchaserState;
  description?: string;
  //Mandatory justification. If null, it means it's the same as justification for the whole request.
  justification?: string;
  /**Temporary rejection reason while approver is preparing for decision. 
     Set indirectly by updating item WFState to "Rejected", cleared for any other WFState.**/
  rejectionReason?: string;
  attachments?: AttachmentModel[];
}
export interface RequestItemDetailModelResult {
  state: ResultState;
  messages?: ResultMessage[];
  payload: RequestItemDetailModel;
}
export interface RequestItemUpdateModel {
  catalogueItemId?: string;
  manualItem: ManualItem;
  description?: string;
  quantity: number;
  //Null if same as the whole request. EmptyOrWhitespace-only is error.
  justification?: string | null;
  expectedDeliveryDate: string;
  attachments?: string[];
}

//***** Comments & History *****
export type ApprovalResolution = 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Withdrawn';

export interface ApprovalHistoryItem {
  level: number;
  approver: UserPublicInfoModel;
  receivedAtUtc: string;
  resolution: ApprovalResolution;
  resolvedBy: UserPublicInfoModel;
  resolvedAtUtc: string;
  comment: string;
}

export interface CommentDetailModel {
  text?: string;
  author: UserPublicInfoModel;
  timestampUtc: string;
}

interface CommentUpdateModel {
  //minLenght: 1
  text: string;
}

//***** API Response Models *****
export interface GetRequestsUsersResponse {
  payload: UserPublicInfoModel;
  state: ResultState;
  messages: ResultMessage[];
}

export interface GetImpersonateUsersResponse {
  payload: ImpersonatedUserModel;
  state: ResultState;
  messages: ResultMessage[];
}

export interface GetRequestItemResponse {
  state: 'Success' | 'Error';
  messages: ResultMessage[];
  payload: RequestItemDetailModel;
}

export interface GetAdminContractResponse {
  total: number;
  items: AdminContract[];
}

export interface ReturnRequestResponse {
  state: 'Success' | 'Error';
  messages: ResultMessage[];
  payload: RequestDetailModel;
}

export interface GetRequesterRequestsResponse {
  payload: {
    id: string;
    total: number;
    items: RequestDetailModel[];
  };
  state: 'Success' | 'Error';
  messages: ResultMessage[];
}
