import { API_VERSION } from '@/core/api/axiosInstance';

import { getRequestCSCAddresses } from './getRequestCSCAddresses';
import { getRequestCSCCatalogue } from './getRequestCSCCatalogue';
import { getRequestCSCCategories } from './getRequestCSCCategories';
import { getRequestCSCUsers } from './getRequestCSCUsers';

const REQUEST_CSC_BASE_URL = `requestform/api/v${API_VERSION}/Codebook`;
const REQUEST_CSC_USERS_URL = `${REQUEST_CSC_BASE_URL}/Users/`;
const REQUEST_CSC_ADDRESSES_URL = `${REQUEST_CSC_BASE_URL}/Addresses/`;
const REQUEST_CSC_CATALOGUE_URL = `${REQUEST_CSC_BASE_URL}/Catalogue/`;
const REQUEST_CSC_CATEGORIES_URL = `${REQUEST_CSC_BASE_URL}/Categories/`;

export {
  getRequestCSCAddresses,
  getRequestCSCCatalogue,
  getRequestCSCCategories,
  getRequestCSCUsers,
  REQUEST_CSC_ADDRESSES_URL,
  REQUEST_CSC_BASE_URL,
  REQUEST_CSC_CATALOGUE_URL,
  REQUEST_CSC_CATEGORIES_URL,
  REQUEST_CSC_USERS_URL,
};
