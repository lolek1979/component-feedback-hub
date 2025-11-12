module.exports = {
  success: {
    payload: {
      id: null,
      givenName: 'Pavel',
      surname: 'Fuchs',
      email: 'pavel.fuchs@vzp.cz',
      phoneNumber: '+420777123456',
      defaultAddress: {
        id: 'a11324a1-427e-4ae5-8794-a45018d2ec4d',
        workplaceCode: '0226',
        description: 'Územní pracoviště Mladá Boleslav',
      },
      department: {
        id: '02c6e67b-6909-4d0c-b7fa-616b8059a1e9',
        code: '123',
        description: 'Regionální pobočka Ostrava',
      },
      costCenter: {
        id: 'a584d7d0-cfb4-4f59-ac91-3d0448ee004c',
        code: '980025',
        description: '98 Ústředí URIIT',
      },
      order: {
        id: '92b606f3-9f56-483a-a6a1-b2fdf5ef3b2c',
        code: '26000223',
        description: 'ÚS98 - Odb. business analýzy nových IS',
      },
      isApprover: true,
      isPurchaser: true,
      isBudgetManager: true,
      isItCatalogueManager: false,
      isOperationsCatalogueManager: true,
      isAdmin: true,
    },
    state: 'Success',
    messages: [],
  },
  error: {
    state: 'error',
    messages: [
      {
        severity: 'Error',
        code: 'USR_ERR_001',
        data: { reason: 'Failed to fetch user data' },
      },
    ],
  },
};
