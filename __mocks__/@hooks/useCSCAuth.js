// Mock for useCSCAuth hook

const mockUseCSCAuth = jest.fn(() => ({
  isEditAuth: true,
  isPublisherAuth: true,
  isGarant: true,
  isEditor: false,
  isLoading: false,
  isError: false,
}));

export default mockUseCSCAuth;
