import { API_VERSION } from '@/core/api/axiosInstance';

import { getRequests } from './getRequests';
import { getRequestsUsers } from './getRequestsUsers';
import { createNewRequest } from './postNewRequest';

const REQUESTS_BASE_URL = `requestform/api/v${API_VERSION}/Request`;
const REQUEST_ITEM_URL = `requestform/api/v${API_VERSION}/RequestItem`;
const REQUEST_USERS_URL = `requestform/api/v${API_VERSION}/User/Self`;
const ATTACHMENT_URL = `requestform/api/v${API_VERSION}/Attachment`;
const CONTRACT_URL = `requestform/api/v${API_VERSION}/Admin/Contract`;
const DEBUG_IMPERSONATE_URL = `requestform/api/v${API_VERSION}/Debug/Impersonate`;

export {
  ATTACHMENT_URL,
  CONTRACT_URL,
  createNewRequest,
  DEBUG_IMPERSONATE_URL,
  getRequests,
  getRequestsUsers,
  REQUEST_ITEM_URL,
  REQUEST_USERS_URL,
  REQUESTS_BASE_URL,
};
