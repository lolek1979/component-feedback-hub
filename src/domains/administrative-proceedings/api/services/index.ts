import { API_VERSION } from '@/core/api/axiosInstance';

import { getAdminProcessAgendas } from './getAdminProcessAgendas';
import { getAdminProcessById } from './getAdminProcessById';
import { getAdminProcessDocumentDownload } from './getAdminProcessDocumentDownload';
import { getAdminProcessDocuments } from './getAdminProcessDocuments';
import { getAdminProcessDocumentTypes } from './getAdminProcessDocumentTypes';
import { getAdminProcesses } from './getAdminProcesses';
import { getAdminProcessStatuses } from './getAdminProcessStatuses';
import { getAdminProcessUsers } from './getAdminProcessUsers';
import { postAdminProcessAction } from './postAdminProcessAction';
import { postAdminProcessDecision } from './postAdminProcessDecision';
import { postNewAdminProcess } from './postNewAdminProcess';
import { putAdminProcess } from './putAdminProcess';
import { putAdminProcessDocument } from './putAdminProcessDocument';

const RSZP_BASE_URL = `/administrative-proceeding/api/rest/v${API_VERSION}`;
const ADMIN_PROCESS_URL = `${RSZP_BASE_URL}/AdminProcesses`;
const ADMIN_PROCESS_AGENDAS_URL = `${RSZP_BASE_URL}/Agendas`;
const ADMIN_PROCESS_STATUSES_URL = `${RSZP_BASE_URL}/AdminProcessStatuses`;
const ADMIN_PROCESS_USERS_URL = `${RSZP_BASE_URL}/users`;
const ADMIN_PROCESS_DOCUMENT_TYPES_URL = `${RSZP_BASE_URL}/DocumentTypes`;
const ADMIN_PROCESS_DOCUMENTS_URL = `${RSZP_BASE_URL}/Documents`;
const ADMIN_PROCESS_DECISIONS_URL = `${RSZP_BASE_URL}/Decisions`;

export {
  ADMIN_PROCESS_AGENDAS_URL,
  ADMIN_PROCESS_DECISIONS_URL,
  ADMIN_PROCESS_DOCUMENT_TYPES_URL,
  ADMIN_PROCESS_DOCUMENTS_URL,
  ADMIN_PROCESS_STATUSES_URL,
  ADMIN_PROCESS_URL,
  ADMIN_PROCESS_USERS_URL,
  getAdminProcessAgendas,
  getAdminProcessById,
  getAdminProcessDocumentDownload,
  getAdminProcessDocuments,
  getAdminProcessDocumentTypes,
  getAdminProcesses,
  getAdminProcessStatuses,
  getAdminProcessUsers,
  postAdminProcessAction,
  postAdminProcessDecision,
  postNewAdminProcess,
  putAdminProcess,
  putAdminProcessDocument,
  RSZP_BASE_URL,
};
