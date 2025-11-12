// Mock for Zustand CSC Auth Store

const mockCSCAuthStore = {
  currentUserEmail: 'test@example.com',
  codeListId: 'test-id',
  status: 'concept',
  garants: [],
  editors: [],
  isLoading: false,
  isError: false,
  isEditAuth: true,
  isPublisherAuth: true,
  isGarant: true,
  isEditor: false,
  setCurrentUser: jest.fn(),
  setCodeListData: jest.fn(),
  setGarantsAndEditors: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  reset: jest.fn(),
  computeAuth: jest.fn(),
};

export const useCSCAuthStore = jest.fn(() => mockCSCAuthStore);

export const getCSCAuthData = jest.fn(() => ({
  isEditAuth: true,
  isPublisherAuth: true,
  isGarant: true,
  isEditor: false,
  isLoading: false,
  isError: false,
}));

export const setCSCAuthData = jest.fn();

export default {
  useCSCAuthStore,
  getCSCAuthData,
  setCSCAuthData,
};
