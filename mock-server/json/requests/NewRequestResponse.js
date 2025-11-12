module.exports = {
  success: {
    payload: {
      id: 'f8a3d25b-7e6c-4d9f-b951-a78def246c12',
      createdAtUtc: '2025-06-23T08:15:30.123Z',
      createdBy: {
        id: null,
        givenName: 'Pavel',
        surname: 'Fuchs',
        email: '',
        phoneNumber: '',
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
      },
      requestNumber: null,
      recipient: {
        id: null,
        givenName: 'Pavel',
        surname: 'Fuchs',
        email: '',
        phoneNumber: '',
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
      },
      submitedAtUtc: null,
      deliveryAddress: {
        id: 'a11324a1-427e-4ae5-8794-a45018d2ec4d',
        workplaceCode: '0226',
        description: 'Územní pracoviště Mladá Boleslav',
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
      description: 'Nový požadavek',
      justification: 'Potřeba nového vybavení',
      isWatching: false,
      wfState: 'Draft',
      approver: null,
      items: [],
    },
    state: 'Success',
    messages: [],
  },
  error: {
    state: 'error',
    messages: [
      {
        severity: 'Error',
        code: 'REQ_ERR_003',
        data: { reason: 'Failed to create new request' },
      },
    ],
  },
};
